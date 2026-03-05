// server/middleware/proxyLogger.ts
export default defineEventHandler((event) => {
    const url = event.node.req.url || ''

    // 只在开发环境启用日志
    if (process.env.NODE_ENV !== 'development') {
        return
    }

    // 监控 /app-api 开头的请求
    if (url.startsWith('/app-api')) {
        const startTime = Date.now()

        // 请求开始日志
        console.log('\n🔄 ====== Nitro Proxy 收到请求 ======')
        console.log('📍 请求 URL:', url)
        console.log('📍 请求方法:', event.node.req.method)
        console.log('📍 来源 IP:', event.node.req.socket.remoteAddress)
        console.log('📍 时间:', new Date().toLocaleString('zh-CN'))

        // 监听响应完成
        event.node.res.on('finish', () => {
            const duration = Date.now() - startTime
            const statusCode = event.node.res.statusCode

            console.log('\n✅ ====== Nitro Proxy 响应完成 ======')
            console.log('📍 请求 URL:', url)
            console.log('📊 状态码:', statusCode)
            console.log('⏱️  耗时:', `${duration}ms`)
            console.log('🎯 代理目标:', process.env.NUXT_API_TARGET_URL)
            console.log('====================================\n')
        })

        // 监听错误
        event.node.res.on('error', (error) => {
            console.error('\n❌ ====== Nitro Proxy 错误 ======')
            console.error('📍 请求 URL:', url)
            console.error('❌ 错误:', error.message)
            console.error('================================\n')
        })
    }
})
