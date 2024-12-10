// src/config/validation.js

exports.domainConfig = {
    // 顶级域名列表
    validTLDs: [
        // 通用顶级域名
        'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'biz', 'info', 'name', 'pro',
        'mobi', 'asia', 'tel', 'xxx', 'aero', 'cat', 'coop', 'jobs', 'museum', 'travel',
        'arpa', 'root', 'tel', 'post', 'blog',

        // 国家/地区顶级域名
        // 欧洲
        'eu', 'uk', 'fr', 'de', 'it', 'es', 'nl', 'be', 'dk', 'se', 'no', 'fi', 'ch',
        'at', 'ie', 'pl', 'ru', 'cz', 'gr', 'pt', 'ro', 'bg', 'hu', 'sk', 'hr', 'ee',
        'lt', 'lv', 'si',

        // 亚洲
        'cn', 'jp', 'kr', 'in', 'sg', 'my', 'th', 'vn', 'ph', 'id', 'pk', 'tw', 'hk',
        'mo', 'ae', 'il', 'sa', 'qa', 'kw', 'bh', 'om',

        // 美洲
        'us', 'ca', 'mx', 'br', 'ar', 'cl', 'co', 'pe', 've', 'ec', 'uy', 'py', 'bo',

        // 大洋洲
        'au', 'nz', 'fj',

        // 非洲
        'za', 'eg', 'ma', 'ng', 'ke', 'gh', 'tz',

        // 多级域名组合
        'co.uk', 'ac.uk', 'org.uk', 'gov.uk', 'nhs.uk', 'police.uk', 'mod.uk',
        'co.jp', 'ac.jp', 'go.jp', 'or.jp', 'ne.jp',
        'co.kr', 'ac.kr', 'go.kr', 'or.kr', 'ne.kr',
        'com.cn', 'edu.cn', 'gov.cn', 'org.cn', 'net.cn',
        'com.au', 'edu.au', 'gov.au', 'org.au', 'net.au',
        'com.br', 'edu.br', 'gov.br', 'org.br', 'net.br',
        'com.fr', 'edu.fr', 'gouv.fr', 'org.fr', 'net.fr'
    ],

    // 无效域名列表
    invalidDomains: [
        'example.com', 'test.com', 'localhost', 'invalid.com', 'temp.com',
        'temporary.com', 'demo.com', 'sample.com', 'fake.com', 'dummy.com',
        'test.org', 'example.org', 'example.net', 'test.net',
        'mailinator.com', 'tempmail.com', 'throwaway.com', 'disposable.com',
        'mailbox.org', 'guerrillamail.com', 'yopmail.com', '10minutemail.com',
        'sentry.io', 'logging.com', 'debug.com', 'local.dev', 'testing.com'
    ],

    // 商业相关域名（较高可信度）
    businessDomains: [
        'business', 'company', 'corporate', 'enterprise', 'limited', 'ltd', 'inc',
        'corporation', 'corp', 'group', 'holdings', 'solutions', 'services',
        'consulting', 'international', 'global', 'worldwide', 'partners'
    ]
};

exports.phoneConfig = {
    // 国际电话格式
    formats: {
        // 英国
        UK: {
            patterns: [
                
/^(?:\+44|0)(?:(?:1\d{8,9})|(?:7[0-9]\d{8})|(?:2[0-9]\d{8})|(?:3[0-9]\d{8})|(?:4[0-9]\d{8})|(?:5[0-9]\d{8})|(?:8[0-9]\d{8}))$/,
                /^(?:\+44|0)(?:[1-9]\d{9,10})$/
            ],
            prefixes: ['44', '0'],
            lengths: [10, 11, 12]
        },
        // 美国/加拿大
        US: {
            patterns: [
                /^(?:\+1|1)?[2-9]\d{9}$/
            ],
            prefixes: ['1'],
            lengths: [10, 11]
        },
        // 欧盟国家
        EU: {
            patterns: [
                // 法国
                /^(?:\+33|0033|0)[1-9][0-9]{8}$/,
                // 德国
                /^(?:\+49|0049|0)[1-9][0-9]{9,11}$/,
                // 意大利
                /^(?:\+39|0039|0)[3-9][0-9]{9,10}$/,
                // 西班牙
                /^(?:\+34|0034)[6-9][0-9]{8}$/
            ],
            prefixes: ['33', '49', '39', '34'],
            lengths: [9, 10, 11, 12]
        }
    },

    // 特殊号码前缀（如免费电话、高收费电话等）
    specialPrefixes: {
        UK: ['0800', '0808', '0844', '0845', '0870', '0871', '0900'],
        US: ['800', '844', '855', '866', '877', '888'],
        EU: ['00800']
    }
};

exports.emailConfig = {
    // 常见的无效用户名
    invalidUsernames: [
        'admin', 'administrator', 'webmaster', 'hostmaster', 'postmaster',
        'root', 'system', 'mail', 'spam', 'abuse', 'noreply', 'no-reply',
        'test', 'info', 'contact', 'support', 'sales', 'marketing',
        'help', 'enquiries', 'enquiry', 'feedback', 'service'
    ],

    // 商业相关用户名（较高可信度）
    businessUsernames: [
        'director', 'manager', 'ceo', 'founder', 'owner', 'partner',
        'executive', 'president', 'chairman', 'chief', 'head', 'lead'
    ],

    // 邮箱最大长度
    maxLength: 254,

    // 用户名最大长度
    maxUsernameLength: 64,

    // 域名最大长度
    maxDomainLength: 255
};
