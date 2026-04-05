# WooCommerce React Storefront 部署指南

本文档旨在指导您如何将此 React (Vite) 前端项目与您的 WordPress + WooCommerce 后端连接，并将其部署到生产环境。

## 1. 准备工作 (WordPress / WooCommerce 端)

在部署前端之前，您需要确保您的 WooCommerce 后端已经准备就绪。

### 1.1 生成 WooCommerce API 密钥
1. 登录 WordPress 后台。
2. 导航至 **WooCommerce > 设置 > 高级 > REST API**。
3. 点击 **添加密钥**。
4. 填写描述（例如：React Storefront），选择一个用户，将 **权限** 设置为 **读/写 (Read/Write)**。
5. 点击生成，保存好 **Consumer Key** (`ck_...`) 和 **Consumer Secret** (`cs_...`)。

### 1.2 配置跨域请求 (CORS)
由于前端和后端域名不同，必须允许跨域请求，否则浏览器会拦截 API 请求：
- **推荐方法**：在 WordPress 安装并启用 `Handle CORS` 或 `WP GraphQL CORS` 插件，将您的前端域名（如 `https://your-frontend-domain.com`）加入白名单。
- **代码方法**：在当前主题的 `functions.php` 中添加以下代码：
  ```php
  add_action('init', function() {
      // 生产环境请将 * 替换为您实际的前端域名
      header("Access-Control-Allow-Origin: *"); 
      header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
      header("Access-Control-Allow-Headers: Authorization, Content-Type");
  });
  ```

## 2. 本地开发与环境变量配置

### 2.1 环境要求
- Node.js (v18 或更高版本)
- npm 或 yarn

### 2.2 配置环境变量
在项目根目录创建一个 `.env` 文件，并填入您的 WooCommerce 信息：

```env
VITE_WP_API_URL=https://your-wordpress-site.com
VITE_WC_CONSUMER_KEY=ck_your_consumer_key_here
VITE_WC_CONSUMER_SECRET=cs_your_consumer_secret_here
```

### 2.3 运行本地开发服务器
```bash
npm install
npm run dev
```
访问 `http://localhost:3000` 即可预览您的商城。

## 3. 生产环境构建与部署

### 3.1 构建静态文件
```bash
npm run build
```
构建完成后，所有用于生产环境的静态文件将生成在 `dist` 目录中。

### 3.2 部署到 Cloudflare Pages (通过 GitHub Actions)
本项目已配置了自动部署到 Cloudflare Pages 的 GitHub 工作流。当您推送代码到 `main` 分支时，会自动触发构建和部署。

**配置步骤：**
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 在左侧菜单选择 **Workers & Pages**，然后点击 **Create application** -> **Pages** -> **Connect to Git**（或者直接创建一个空项目并记下 `Project Name`）。
3. 获取您的 **Account ID**（在 Cloudflare 域名的右侧边栏可以找到）和 **API Token**（前往 My Profile -> API Tokens -> Create Token，选择 Edit Cloudflare Workers 模板）。
4. 前往您的 GitHub 仓库 -> **Settings** -> **Secrets and variables** -> **Actions**。
5. 添加以下 **Repository secrets**：
   - `CLOUDFLARE_ACCOUNT_ID`: 您的 Cloudflare 账户 ID
   - `CLOUDFLARE_API_TOKEN`: 您的 Cloudflare API 令牌
   - `VITE_WP_API_URL`: 您的 WordPress 站点地址
   - `VITE_WC_CONSUMER_KEY`: WooCommerce Consumer Key
   - `VITE_WC_CONSUMER_SECRET`: WooCommerce Consumer Secret
6. 修改代码库中的 `.github/workflows/cloudflare-pages.yml` 文件，将 `projectName: 'your-project-name'` 替换为您在 Cloudflare 上的实际项目名。
7. 将代码推送到 GitHub 的 `main` 分支，即可自动触发部署！

### 3.3 部署到 Vercel / Netlify (备选方案)
Vercel 和 Netlify 是部署 Vite/React 单页应用 (SPA) 的最简方式：
1. 将代码推送到 GitHub/GitLab。
2. 在 Vercel/Netlify 中导入该仓库。
3. 在平台的 **Environment Variables (环境变量)** 设置中，添加上述的 `VITE_WP_API_URL`, `VITE_WC_CONSUMER_KEY`, `VITE_WC_CONSUMER_SECRET`。
4. Framework Preset 选择 **Vite**。
5. 点击 **Deploy**。

### 3.3 部署到 Nginx (自托管服务器)
如果您使用自己的云服务器部署，请将 `dist` 目录下的文件上传到服务器，并配置 Nginx 以支持单页应用 (SPA) 的路由（将所有请求重定向到 `index.html`）：

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 4. ⚠️ 生产环境安全警告 (非常重要)

目前项目演示了如何使用 WooCommerce v3 REST API。但在**真实的生产环境**中，直接在 React (Vite) 前端代码中暴露 `Consumer Secret` 是**极度不安全**的，因为任何人都可以通过浏览器控制台窃取您的密钥。

为了保障您的商店安全，强烈建议在正式上线前采用以下两种方案之一：

1. **切换到 WooCommerce Store API (纯前端方案)**：
   将接口路径从 `/wp-json/wc/v3/...` 更改为 `/wp-json/wc/store/v1/...`。Store API 专为无头电商 (Headless Commerce) 设计，**不需要** API 密钥即可安全地读取商品、分类和处理购物车/结账。
   
2. **引入 Node.js 中间层 (BFF 方案)**：
   如果您需要使用完整的 v3 API（例如用户注册、修改订单状态等），请将此项目升级为全栈应用（例如使用 Express.js 作为后端）。
   - 前端向您的 Express 后端发送请求。
   - Express 后端安全地持有 `Consumer Secret`，并向 WooCommerce 发起请求。
   - 这样密钥就永远不会泄露给浏览器。
