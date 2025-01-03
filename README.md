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
# pnpm
pnpm run dev
```

## 生产环境构建 Production

构建生产版本命令 Build the application for production:

```bash
# pnpm
pnpm run build
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