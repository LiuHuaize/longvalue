# 长丰数智网站部署指南

## 项目概述

本文档提供了将长丰数智网站部署到阿里云服务器的详细指南。网站基于React框架开发，是一个静态网站，包含六个主要栏目：首页、业务介绍、团队介绍、投资者关系、长丰加密研究所和关于我们。

## 部署前准备

1. 确保您已经拥有阿里云账号并已购买相应的服务器或云服务
2. 确保您的服务器已安装以下软件：
   - Node.js (推荐版本 16.x 或更高)
   - npm 或 pnpm 包管理工具
   - Nginx 或其他Web服务器软件

## 部署步骤

### 方法一：使用构建好的静态文件（推荐）

1. 解压随附的 `longvaluehk_build.zip` 文件，获取已构建好的静态网站文件
2. 将解压后的所有文件上传到阿里云服务器的网站根目录（通常为 `/var/www/html` 或您指定的其他目录）
3. 配置Nginx或其他Web服务器，指向上传的静态文件目录
4. 将您的域名 `www.longvaluehk.com` 解析到服务器IP地址

### 方法二：从源代码构建并部署

1. 解压随附的 `longvaluehk_source.zip` 文件，获取网站源代码
2. 将源代码上传到阿里云服务器
3. 进入项目目录，执行以下命令安装依赖：
   ```bash
   cd longvaluehk
   npm install
   # 或者使用 pnpm
   pnpm install
   ```
4. 修复React导入警告（可选）：
   在每个页面组件文件中，将 `import React from 'react';` 改为 `import * as React from 'react';`
5. 构建项目：
   ```bash
   npm run build
   # 或者使用 pnpm
   pnpm run build
   ```
6. 将生成的 `dist` 目录中的文件复制到网站根目录
7. 配置Nginx或其他Web服务器，指向这些静态文件
8. 将您的域名 `www.longvaluehk.com` 解析到服务器IP地址

## Nginx配置示例

以下是一个基本的Nginx配置示例，可以根据您的实际需求进行调整：

```nginx
server {
    listen 80;
    server_name www.longvaluehk.com longvaluehk.com;
    root /var/www/html;  # 静态文件所在目录
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # 支持React路由
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 常见问题解决

1. **页面刷新后出现404错误**：
   确保Nginx配置中包含 `try_files $uri $uri/ /index.html;` 以支持React路由

2. **图片或样式无法加载**：
   检查文件路径是否正确，确保所有资源文件都已上传

3. **网站无法访问**：
   - 检查域名解析是否正确
   - 确认服务器防火墙是否开放了80端口
   - 检查Nginx服务是否正常运行

## 后续支持

如果您在部署过程中遇到任何问题，或者需要对网站进行进一步的定制和开发，请随时联系我们获取技术支持。

## 网站维护

部署完成后，您可以通过以下方式维护网站：

1. **内容更新**：修改源代码中相应页面的内容，重新构建并部署
2. **添加新功能**：根据业务需求，可以进一步开发新的功能模块
3. **性能优化**：定期检查网站性能，优化加载速度和用户体验

祝您网站部署顺利！
