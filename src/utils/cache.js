// src/utils/cache.js

class Cache {
    constructor() {
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            total: 0
        };
        this.options = {
            maxSize: 1000,          // 最大缓存条目数
            ttl: 24 * 60 * 60 * 1000, // 缓存有效期（24小时）
            cleanupInterval: 60 * 60 * 1000 // 清理间隔（1小时）
        };

        // 启动定期清理
        this.startCleanup();
    }

    /**
     * 获取缓存项
     * @param {string} key - 缓存键
     * @returns {any|null} 缓存值或null
     */
    get(key) {
        this.stats.total++;
        const item = this.cache.get(key);

        if (!item) {
            this.stats.misses++;
            return null;
        }

        if (this.isExpired(item)) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return item.value;
    }

    /**
     * 设置缓存项
     * @param {string} key - 缓存键
     * @param {any} value - 缓存值
     * @param {number} [ttl] - 可选的特定TTL
     */
    set(key, value, ttl = this.options.ttl) {
        // 如果达到最大大小，删除最旧的项
        if (this.cache.size >= this.options.maxSize) {
            const oldestKey = this.findOldestKey();
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * 检查缓存项是否过期
     * @param {Object} item - 缓存项
     * @returns {boolean}
     */
    isExpired(item) {
        return Date.now() - item.timestamp > item.ttl;
    }

    /**
     * 查找最旧的缓存键
     * @returns {string|null}
     */
    findOldestKey() {
        let oldestKey = null;
        let oldestTime = Infinity;

        for (const [key, item] of this.cache.entries()) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }

        return oldestKey;
    }

    /**
     * 清理过期项
     */
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * 启动定期清理
     */
    startCleanup() {
        setInterval(() => {
            this.cleanup();
        }, this.options.cleanupInterval);
    }

    /**
     * 获取缓存统计信息
     * @returns {Object}
     */
    getStats() {
        return {
            ...this.stats,
            size: this.cache.size,
            hitRate: (this.stats.hits / this.stats.total) || 0
        };
    }

    /**
     * 清除所有缓存
     */
    clear() {
        this.cache.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            total: 0
        };
    }

    /**
     * 获取特定域名的缓存键
     * @param {string} url - URL
     * @returns {string}
     */
    static getCacheKey(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return url;
        }
    }

    /**
     * 检查URL是否应该被缓存
     * @param {string} url - URL
     * @returns {boolean}
     */
    static shouldCache(url) {
        try {
            const urlObj = new URL(url);
            // 排除一些不应该缓存的域名
            const excludeDomains = ['localhost', '127.0.0.1', 'test', 'example'];
            return !excludeDomains.some(domain => urlObj.hostname.includes(domain));
        } catch (e) {
            return false;
        }
    }

    /**
     * 检查缓存是否命中
     * @param {string} key - 缓存键
     * @returns {boolean}
     */
    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;
        if (this.isExpired(item)) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }

    /**
     * 获取所有有效的缓存项
     * @returns {Array}
     */
    getValidItems() {
        const validItems = [];
        const now = Date.now();

        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp <= item.ttl) {
                validItems.push({
                    key,
                    value: item.value,
                    age: now - item.timestamp
                });
            }
        }

        return validItems;
    }
}

module.exports = new Cache();
