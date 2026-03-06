# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

第一步 确保安装最新依赖 Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## 开发服务器 Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm 本地 .env.local 本地环境
pnpm run dev:local
# pnpm 开发 .env.development 开发环境（默认）
pnpm run dev
# 生产环境开发（预览生产配置） .env.production 生产环境调试
pnpm run dev:prod
# 开发环境（快速启动) .env.development
pnpm run dev:fast
```

## 生产环境构建 Production

构建生产版本命令 Build the application for production:

```bash
# 2. 构建生产版本 .env.production 生产环境构建
pnpm run build:prod

# 3. 预览构建结果
pnpm run preview
# pnpm  .env 构建（默认）
pnpm run build
    若出现内存不足
    npm install -g increase-memory-limit
    increase-memory-limit
```

本地预览构建 Locally preview production build:

```bash
# pnpm
pnpm run preview
```

### nuxt 配置seo信息
    useHead({
        title: `${info.value?.name} ${$t('appTitle')}`,
        meta: [
            { name: 'keywords', content: info.value?.introduction },
        ],
    })

    1. 标题标签（Title Tag）
    2. 描述标签（Meta Description）
    3. 关键词标签（Meta Keywords）

    http://localhost:3000/robots.txt
    http://localhost:3000/sitemap.xml
