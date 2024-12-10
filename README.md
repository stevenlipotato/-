# 通过提供体验商的网站名字，爬取体验商的邮箱，并导出，便于团队去对接外国体验商

# 网站联系方式爬虫工具

一个简单易用的工具，用于批量获取网站的联系方式、邮箱和社交媒体链接。

## 🌟 功能特点
- 支持批量导入网址（Excel、CSV、TXT格式）
- 自动提取邮箱地址和英国电话号码
- 支持导出为 Excel 格式
- 快速并发爬取

## 📋 使用前准备

### Windows 用户：

1. **安装 Node.js**：
   - 访问 https://nodejs.org/
   - 下载并安装 "LTS" 版本
   - 安装时全部选择默认选项

2. **安装 MongoDB**：
   - 访问 https://www.mongodb.com/try/download/community
   - 下载并安装 MongoDB Community Server
   - 安装时选择 "Complete" 安装类型

3. **安装 Git**：
   - 访问 https://git-scm.com/download/win
   - 下载并安装 Git
   - 安装时全部选择默认选项

### Mac 用户：

1. **安装 Homebrew**（如果没有）：
   - 打开终端（Terminal）
     - 点击右上角放大镜图标
     - 搜索 "Terminal" 或"终端"
     - 点击打开
   - 复制粘贴以下命令：
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **安装必要软件**：
   ```bash
   # 安装 Node.js
   brew install node

   # 安装 MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   ```

## 💻 安装步骤

1. **下载代码**：
   - 点击页面上的绿色 "Code" 按钮
   - 点击 "Download ZIP"
   - 解压下载的文件到你想要的位置

2. **打开终端**：
   - Windows：
     - 按 Win + R
     - 输入 cmd
     - 点击确定
   
   - Mac：
     - 点击右上角放大镜
     - 搜索 "Terminal"
     - 点击打开

3. **进入项目目录**：
   ```bash
   # Windows 示例（根据你的解压位置修改）：
   cd C:\Users\YourName\Downloads\contact-scraper

   # Mac 示例：
   cd ~/Downloads/contact-scraper
   ```

4. **安装项目依赖**：
   ```bash
   npm install
   ```

5. **启动 MongoDB**：
   - Windows：
     - 打开服务管理器
     - 找到 MongoDB
     - 点击启动
   
   - Mac：
     ```bash
     brew services start mongodb-community
     ```

6. **启动工具**：
   ```bash
   npm run dev
   ```

7. **使用工具**：
   - 打开浏览器
   - 访问 http://localhost:3000

## 📝 使用说明

### 准备网址列表：

1. **使用 Excel**：
   - 打开 Excel
   - 创建新表格
   - 第一列标题写 "Website Address"
   - 下面每行填写一个网址
   - 保存文件

2. **或使用文本文件**：
   - 打开记事本
   - 每行写一个网址
   - 保存为 .txt 文件

### 使用工具：

1. **导入网址**：
   - 点击"选择文件"按钮
   - 选择你准备好的 Excel 或文本文件
   - 点击"导入"按钮

2. **开始爬取**：
   - 检查导入的网址是否正确
   - 点击"开始爬取"按钮
   - 等待处理完成

3. **查看结果**：
   - 结果会直接显示在页面上
   - 同时会自动下载一个 Excel 文件
   - Excel 文件包含所有爬取结果

## ❗ 注意事项
- 确保电脑连接到互联网
- 每次建议处理不超过 100 个网址
- 如果遇到问题，可以尝试刷新页面重试

## 🆘 常见问题

1. **无法启动服务**：
   - 确保已经安装了所有必要软件
   - 确保 MongoDB 正在运行
   - 检查是否在正确的目录下运行命令

2. **导入文件失败**：
   - 确保 Excel 文件中有 "Website Address" 列
   - 确保网址格式正确
   - 尝试使用文本文件替代

3. **爬取结果为空**：
   - 检查网址是否正确
   - 确保网站可以正常访问
   - 有些网站可能有反爬虫机制

## 🤝 需要帮助？
如果遇到任何问题，请：
1. 检查上面的常见问题
2. 尝试重新启动工具
3. 联系技术支持人员

## 📞 联系方式
[这里填写你的联系方式]
