export interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string[]
  defaultImage: string
  siteLogo: string
  social: {
    facebook?: {
      appId?: string
    }
    twitter?: {
      handle?: string
    }
  }
  organization: {
    name: string
    url: string
    logo: string
  }
  noIndexRoutes: string[]
  customRoutes: {
    [key: string]: {
      title?: string
      description?: string
      keywords?: string[]
      image?: string
      priority?: number
      changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    }
  }
}

export const seoConfig: SEOConfig = {
  siteName: process.env.NUXT_SITE_NAME || 'iswink',
  siteUrl: process.env.DOMAIN_URL || 'https://www.iswink.com',
  defaultTitle: process.env.NUXT_APP_TITLE_SUFFIX || 'iswink - Surprise Gifts for Love',
  defaultDescription: process.env.NUXT_DEFAULT_DESCRIPTION || 'Discover unique surprise gifts at iswink.',
  defaultKeywords: process.env.NUXT_DEFAULT_KEYWORDS?.split(',') || [
    'surprise gifts',
    'love gifts',
    'relationship gifts',
  ],
  defaultImage: process.env.NUXT_DEFAULT_OG_IMAGE || '',
  siteLogo: process.env.NUXT_SITE_LOGO || '',
  social: {
    facebook: {
      appId: process.env.NUXT_FACEBOOK_APP_ID || '',
    },
    twitter: {
      handle: process.env.NUXT_TWITTER_HANDLE || '',
    },
  },
  organization: {
    name: process.env.NUXT_ORGANIZATION_NAME || 'iswink',
    url: process.env.NUXT_ORGANIZATION_URL || 'https://www.iswink.com',
    logo: process.env.NUXT_SITE_LOGO || '',
  },
  noIndexRoutes: [
    '/user',
    '/login',
    '/register',
    '/checkout',
    '/cart',
    '/admin',
  ],
  customRoutes: {
    home: {
      title: 'seo.home.title',
      description: 'seo.home.description',
      keywords: ['seo.home.keyword1', 'seo.home.keyword2', 'seo.home.keyword3'],
      priority: 1.0,
      changeFreq: 'daily',
    },
    productList: {
      title: 'seo.productList.title',
      description: 'seo.productList.description',
      keywords: ['seo.productList.keyword1', 'seo.productList.keyword2'],
      priority: 0.9,
      changeFreq: 'daily',
    },
    productDetail: {
      title: 'seo.productDetail.title',
      description: 'seo.productDetail.description',
      keywords: ['seo.productDetail.keyword1', 'seo.productDetail.keyword2'],
      priority: 0.8,
      changeFreq: 'weekly',
    },
    articleList: {
      title: 'seo.articleList.title',
      description: 'seo.articleList.description',
      keywords: ['seo.articleList.keyword1', 'seo.articleList.keyword2'],
      priority: 0.7,
      changeFreq: 'weekly',
    },
    articleDetail: {
      title: 'seo.articleDetail.title',
      description: 'seo.articleDetail.description',
      keywords: ['seo.articleDetail.keyword1', 'seo.articleDetail.keyword2'],
      priority: 0.6,
      changeFreq: 'monthly',
    },
    seckill: {
      title: 'seo.seckill.title',
      description: 'seo.seckill.description',
      keywords: ['seo.seckill.keyword1', 'seo.seckill.keyword2'],
      priority: 0.7,
      changeFreq: 'daily',
    },
    combination: {
      title: 'seo.combination.title',
      description: 'seo.combination.description',
      keywords: ['seo.combination.keyword1', 'seo.combination.keyword2'],
      priority: 0.7,
      changeFreq: 'daily',
    },
    coupon: {
      title: 'seo.coupon.title',
      description: 'seo.coupon.description',
      keywords: ['seo.coupon.keyword1', 'seo.coupon.keyword2'],
      priority: 0.5,
      changeFreq: 'weekly',
    },
  },
}
