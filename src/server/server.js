const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Scraper = require('../services/scraper');
const Contact = require('../models/Contact');
require('dotenv').config();

const app = express();
const scraper = new Scraper();

// 添加全局调试标志
const DEBUG = true;
console.log('服务器启动，DEBUG 模式:', DEBUG);

// 添加调试函数
function debug(message) {
    if (DEBUG) {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
}

// 添加彩色日志函数
function logInfo(message) {
    console.log('\x1b[36m%s\x1b[0m', `[INFO] ${message}`);
}

function logSuccess(message) {
    console.log('\x1b[32m%s\x1b[0m', `[SUCCESS] ${message}`);
}

function logError(message) {
    console.log('\x1b[31m%s\x1b[0m', `[ERROR] ${message}`);
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// 初始化爬虫
scraper.initialize().catch(console.error);

// API路由
app.post('/api/scrape', async (req, res) => {
    logInfo('=====================================');
    logInfo('收到新的爬虫请求');
    try {
        const { urls } = req.body;
        logInfo(`准备爬取以下URL:\n${urls.join('\n')}`);

        if (!Array.isArray(urls)) {
            logError('提供的不是URL数组');
            return res.status(400).json({ message: '请提供URL数组' });
        }

        const BATCH_SIZE = 5; // 同时爬取5个网站
        const results = [];
        
        // 分批处理URLs
        for (let i = 0; i < urls.length; i += BATCH_SIZE) {
            const batch = urls.slice(i, i + BATCH_SIZE);
            logInfo(`正在处理第 ${i + 1} 到 ${i + batch.length} 个URL`);
            
            const batchPromises = batch.map(url => scraper.scrapeContact(url));
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults.filter(result => result !== null));
            
            logSuccess(`已完成: ${i + batch.length}/${urls.length}`);
        }

        logSuccess('所有URL爬取完成');
        logInfo('=====================================\n');
        res.json(results);
    } catch (error) {
        logError(`爬取过程出错: ${error.message}`);
        res.status(500).json({ message: '爬取过程中出错' });
    }
});

// 获取所有联系人数据
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: '获取数据失败' });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || 
'mongodb://localhost:27017/contact-scraper', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(console.error);

// 优雅退出
process.on('SIGINT', async () => {
    await scraper.close();
    process.exit();
});
