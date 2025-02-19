## 生成部署
#### 1.生成部署文件
      pnpm install
      pnpm run build
      得到 .output 文件夹
#### 2.部署到服务器
    PM2 部署linux
    5. 使用pm2启动Nuxt3项目
    1. 直接在根目录下面执行命令
       cd /iswink-web/
       pm2 start ecosystem.config.cjs
    
   2. 设置pm2开机自启
      1.检查 PM2 进程
      pm2 status
      2.保存当前的进程列表
      pm2 save
      3.设置 PM2 开机自启动
      pm2 startup