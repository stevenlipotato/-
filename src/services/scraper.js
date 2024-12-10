const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

class Scraper {
    constructor() {
        this.browser = null;
        this.pages = new Set();
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080',
            ]
        });

        for (let i = 0; i < 5; i++) {
            const page = await this.browser.newPage();
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                    request.abort();
                } else {
                    request.continue();
                }
            });
            this.pages.add(page);
        }
    }

    async getPage() {
        if (this.pages.size > 0) {
            const page = this.pages.values().next().value;
            this.pages.delete(page);
            return page;
        }
        return await this.browser.newPage();
    }

    async releasePage(page) {
        if (this.pages.size < 5) {
            this.pages.add(page);
        } else {
            await page.close();
        }
    }

    isValidEmail(email) {
        // 基本验证
        if (!email.includes('@') || !email.includes('.')) return false;
        
        // 长度验证
        if (email.length < 5 || email.length > 255) return false;

        // 清理邮箱地址
        email = email.toLowerCase().trim();

        // 分离用户名和域名部分
        const [username, domain] = email.split('@');
        if (!username || !domain) return false;

        // 验证域名格式
        const validTLDs = [
            'com', 'org', 'net', 'edu', 'gov', 'mil',
            'co.uk', 'ac.uk', 'org.uk', 'gov.uk', 'nhs.uk',
            'eu', 'info', 'biz', 'io', 'me', 'uk',
            'de', 'fr', 'es', 'it', 'nl', 'be', 'dk', 'se', 'no', 'fi',
            'ch', 'at', 'ie', 'pl', 'ru', 'cn', 'jp', 'kr', 'in', 'au',
            'nz', 'br', 'mx', 'ar', 'cl', 'za', 'sg', 'my', 'th', 'vn',
            'ca', 'us', 'tv', 'cc'
        ];

        // 确保域名正确分割
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return false;

        // 获取顶级域名组合
        const tld = domainParts.slice(-2).join('.'); // 例如：co.uk
        const simpleTld = domainParts[domainParts.length - 1]; // 例如：com

        // 验证顶级域名
        if (!validTLDs.includes(tld) && !validTLDs.includes(simpleTld)) {
            return false;
        }

        // 排除特定域名
        const invalidDomains = [
            'sentry.io',
            'example.com',
            'test.com',
            'localhost',
            'temp.com',
            'invalid.com',
            'domain.com',
            'email.com',
            'tempmail.com',
            'mailinator.com',
            'temporary.com',
            'disposable.com',
            'throwaway.com',
            'fake.com',
            'dummy.com'
        ];

        if (invalidDomains.some(invalidDomain => domain === invalidDomain)) {
            return false;
        }

        // 排除明显是系统生成的邮箱
        const invalidPatterns = [
            /^[0-9a-f]{32}/,          // 32位16进制
            /^[0-9a-f]{24}/,          // 24位16进制
            /^[0-9a-f]{16}/,          // 16进制
            /^\d{10,}/,               // 纯数字
            /^[0-9a-f-]{30,}/,        // 带横杠的hash
            /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/, // UUID格式
            /^system/,                 // 系统邮箱
            /^noreply/,               // 无需回复邮箱
            /^no-reply/,              // 无需回复邮箱变体
            /^automated/,             // 自动化邮箱
            /^test/,                  // 测试邮箱
            /^admin/,                 // 管理员邮箱
            /^postmaster/,            // 邮件服务器邮箱
            /^webmaster/,             // 网站管理员邮箱
            /^[0-9]+/,               // 纯数字开头
            /^info/                   // 一般信息邮箱
        ];

        if (invalidPatterns.some(pattern => pattern.test(username))) {
            return false;
        }

        // 验证基本邮箱格式
        const emailRegex = 
/^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        // 验证域名部分不包含多余的文本
        if (domain.includes('events') || 
            domain.includes('contact') || 
            domain.includes('about') || 
            domain.includes('page') ||
            domain.includes('index') ||
            domain.includes('default')) {
            // 检查这些词是否作为完整的域名部分出现
            const domainParts = domain.split('.');
            const lastPart = domainParts[domainParts.length - 1];
            if (!validTLDs.includes(lastPart)) {
                return false;
            }
        }

        return true;
    }

    isValidUKPhone(phone) {
        // 清理电话号码
        phone = phone.replace(/[^\d+]/g, '');
        
        // 基本长度检查
        if (phone.length < 10 || phone.length > 15) return false;

        // 验证格式
        const validFormats = [
            /^0[1-9]\d{8,9}$/,      // 标准英国固话
            /^07[1-9]\d{8}$/,       // 英国手机
            /^(\+44|0044)[1-9]\d{8,9}$/, // 国际格式
            /^08[1-9]\d{8}$/,       // 特殊号码
            /^03[1-9]\d{8}$/        // 特殊号码
        ];

        return validFormats.some(format => format.test(phone));
    }

    formatUKPhone(phone) {
        phone = phone.replace(/[^\d+]/g, '');
        
        // 如果是 0044 开头，转换为 +44
        if (phone.startsWith('0044')) {
            phone = '+44' + phone.slice(4);
        }
        
        // 保持原始格式
        return phone;
    }

    cleanEmailAddress(email) {
        // 移除所有空白字符
        email = email.replace(/\s+/g, '').toLowerCase();

        // 查找最后一个包含有效域名的邮箱地址
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const match = email.match(emailRegex);
        if (!match) return '';

        // 获取匹配到的邮箱地址
        const cleanedEmail = match[0];

        // 检查用户名部分是否包含重复单词
        const [username, domain] = cleanedEmail.split('@');
        
        // 检查重复单词和常见前缀
        const commonWords = [
            'events', 'contact', 'email', 'info', 'enquiries',
            'stay', 'weddings', 'groups', 'schools', 'witch',
            'newsletter', 'partners', 'team', 'news', 'about',
            'admin', 'support', 'help', 'sales', 'marketing',
            'booking', 'reservations', 'general', 'office',
            'business', 'corporate', 'service', 'services',
            'customer', 'clients', 'public', 'press', 'media'
        ];

        // 移除用户名中的重复单词和常见前缀组合
        let cleanUsername = username;
        commonWords.forEach(word => {
            // 移除重复的单词
            const repeatRegex = new RegExp(`${word}${word}`, 'gi');
            cleanUsername = cleanUsername.replace(repeatRegex, word);

            // 移除常见前缀组合
            commonWords.forEach(otherWord => {
                if (word !== otherWord) {
                    const combinedRegex = new RegExp(`${word}${otherWord}`, 'gi');
                    cleanUsername = cleanUsername.replace(combinedRegex, word);
                }
            });
        });

        // 如果清理后的用户名为空或只包含特殊字符，返回空字符串
        if (!cleanUsername.match(/[a-zA-Z0-9]/)) {
            return '';
        }

        return `${cleanUsername}@${domain}`;
    }

    async scrapeContact(url) {
        let page = await this.getPage();
        try {
            console.log(`\n=== 开始爬取页面: ${url} ===`);
            
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }

            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });

            // 尝试点击联系方式链接
            try {
                await page.evaluate(() => {
                    const contactLinks = Array.from(document.querySelectorAll('a')).filter(a => 
                        a.textContent.toLowerCase().includes('contact') || 
                        a.href.toLowerCase().includes('contact')
                    );
                    if (contactLinks.length > 0) {
                        contactLinks[0].click();
                    }
                });
                await page.waitForTimeout(2000);
            } catch (e) {
                console.log('未找到或无法点击联系方式链接');
            }

            const html = await page.content();
            const $ = cheerio.load(html);

            const contacts = {
                url: url,
                emails: [],
                phones: [],
                socialMedia: {
                    facebook: '',
                    linkedin: '',
                    twitter: ''
                }
            };

            // 提取电话号码
            $('a[href^="tel:"]').each((_, el) => {
                const phone = $(el).attr('href').replace('tel:', '');
                if (this.isValidUKPhone(phone)) {
                    contacts.phones.push(this.formatUKPhone(phone));
                }
            });

            // 提取邮箱
            const emailPatterns = [
                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
                /Mail\s*[：:]\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
                /Email\s*[：:]\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
            ];

            const pageText = $('body').text();
            const allText = pageText.replace(/\s+/g, ' ').trim();

            let emails = new Set();
            emailPatterns.forEach(pattern => {
                const matches = allText.match(pattern) || [];
                matches.forEach(match => {
                    const cleanedEmail = this.cleanEmailAddress(match);
                    if (cleanedEmail && this.isValidEmail(cleanedEmail)) {
                        emails.add(cleanedEmail);
                    }
                });
            });
            contacts.emails = Array.from(emails);

            // 提取社交媒体链接
            $('a').each((i, element) => {
                const href = $(element).attr('href');
                if (href) {
                    const hrefLower = href.toLowerCase();
                    if (hrefLower.includes('facebook.com') || hrefLower.includes('fb.com')) {
                        contacts.socialMedia.facebook = href;
                    }
                    if (hrefLower.includes('linkedin.com')) {
                        contacts.socialMedia.linkedin = href;
                    }
                    if (hrefLower.includes('twitter.com') || hrefLower.includes('x.com')) {
                        contacts.socialMedia.twitter = href;
                    }
                }
            });

            console.log(`找到邮箱: ${contacts.emails.join(', ') || '无'}`);
            console.log(`找到电话: ${contacts.phones.join(', ') || '无'}`);
            console.log('=== 爬取完成 ===\n');

            return contacts;

        } catch (error) {
            console.error(`\n爬取 ${url} 时出错:`, error);
            return {
                url: url,
                emails: [],
                phones: [],
                socialMedia: {
                    facebook: '',
                    linkedin: '',
                    twitter: ''
                },
                error: error.message
            };
        } finally {
            await this.releasePage(page);
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

module.exports = Scraper;
