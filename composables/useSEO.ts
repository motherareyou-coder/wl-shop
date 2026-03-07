import type { Product, Category } from '~/types'
import { seoConfig } from '~/config/seo.config'

interface SEOOptions {
  routeKey?: string
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'product' | 'article'
  price?: number
  currency?: string
  availability?: string
  brand?: string
  category?: string
  breadcrumbs?: Array<{ name: string; url: string }>
  noIndex?: boolean
  canonical?: string
  product?: Product
  categoryData?: Category
  searchQuery?: string
}

export function useSEO(options: SEOOptions = {}) {
  const { t, locale, locales } = useI18n()
  const route = useRoute()
  const { 
    domain, 
    siteName, 
    defaultTitle, 
    defaultDescription, 
    defaultKeywords, 
    defaultOgImage,
    siteLogo,
    organizationName,
    organizationUrl,
    facebookAppId,
    twitterHandle,
  } = useRuntimeConfig().public
  
  const shouldNoIndex = computed(() => {
    if (options.noIndex) return true
    return seoConfig.noIndexRoutes.some(path => route.path.startsWith(path))
  })
  
  const routeConfig = computed(() => {
    if (options.routeKey && seoConfig.customRoutes[options.routeKey]) {
      return seoConfig.customRoutes[options.routeKey]
    }
    return null
  })
  
  const title = computed(() => {
    if (options.title) return options.title
    if (options.routeKey && routeConfig.value?.title) {
      const configTitle = routeConfig.value.title
      if (options.categoryData) {
        return t(configTitle, { category: options.categoryData.name })
      }
      if (options.product) {
        return t(configTitle, { name: options.product.name, category: options.product.categoryName })
      }
      if (options.searchQuery) {
        return t(configTitle, { query: options.searchQuery })
      }
      return t(configTitle)
    }
    return defaultTitle
  })
  
  const description = computed(() => {
    if (options.description) return options.description
    if (options.routeKey && routeConfig.value?.description) {
      const configDesc = routeConfig.value.description
      if (options.product) {
        const productDesc = options.product.introduction || options.product.name
        return t(configDesc, { 
          name: options.product.name,
          description: productDesc.substring(0, 160),
        })
      }
      if (options.categoryData) {
        return t(configDesc, { category: options.categoryData.name })
      }
      if (options.searchQuery) {
        return t(configDesc, { query: options.searchQuery })
      }
      return t(configDesc)
    }
    return defaultDescription
  })
  
  const keywords = computed(() => {
    if (options.keywords && options.keywords.length > 0) {
      return options.keywords.join(', ')
    }
    if (options.routeKey && routeConfig.value?.keywords) {
      const configKeywords = routeConfig.value.keywords
      if (options.product) {
        return [
          options.product.name,
          options.product.categoryName || '',
          ...configKeywords.map(k => t(k)),
        ].filter(Boolean).join(', ')
      }
      if (options.categoryData) {
        return [
          options.categoryData.name,
          ...configKeywords.map(k => t(k)),
        ].filter(Boolean).join(', ')
      }
      return configKeywords.map(k => t(k)).join(', ')
    }
    return defaultKeywords.join(', ')
  })
  
  const image = computed(() => {
    if (options.image) return options.image
    if (options.product?.picUrl) return options.product.picUrl
    return defaultOgImage
  })
  
  const canonical = computed(() => {
    if (options.canonical) return options.canonical
    return `${domain}${route.path}`
  })
  
  const alternateLinks = computed(() => {
    const currentPath = route.path.replace(`/${locale.value}`, '') || '/'
    return (locales.value || []).map(loc => ({
      rel: 'alternate',
      hreflang: loc.iso || loc.code,
      href: `${domain}/${loc.code}${currentPath}`,
    }))
  })
  
  const meta = computed(() => {
    const baseMeta = [
      { name: 'description', content: description.value },
      { name: 'keywords', content: keywords.value },
      { name: 'author', content: siteName },
      { name: 'robots', content: shouldNoIndex.value ? 'noindex, nofollow' : 'index, follow' },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:image', content: image.value },
      { property: 'og:url', content: canonical.value },
      { property: 'og:type', content: options.type || 'website' },
      { property: 'og:site_name', content: siteName },
      { property: 'og:locale', content: locale.value },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: twitterHandle },
      { name: 'twitter:title', content: title.value },
      { name: 'twitter:description', content: description.value },
      { name: 'twitter:image', content: image.value },
    ]
    
    if (options.type === 'product' && options.product) {
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: options.product.name,
        description: description.value,
        image: image.value,
        brand: {
          '@type': 'Brand',
          name: options.product.brandName || siteName,
        },
        offers: {
          '@type': 'Offer',
          price: options.price || 0,
          priceCurrency: options.currency || 'USD',
          availability: options.availability || 'https://schema.org/InStock',
          url: canonical.value,
        },
        category: options.product.categoryName,
      }
      baseMeta.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(productSchema),
      })
    }
    
    if (options.breadcrumbs && options.breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: options.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
      baseMeta.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbSchema),
      })
    }
    
    if (options.type === 'website') {
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: organizationName,
        url: organizationUrl,
        logo: siteLogo,
      }
      baseMeta.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(organizationSchema),
      })
    }
    
    return baseMeta
  })
  
  useHead({
    title: title.value,
    link: [
      { rel: 'canonical', href: canonical.value },
      ...alternateLinks.value,
    ],
    meta: meta.value,
  })
}
