# 前端项目

## Node版本

v22.20.0

## 管理工具

pm2

## 如何开发和部署

### 前端代码

* 开发

```bash
cd client
npm run dev
```

* 部署

```bash
cd client
npm run build
```

### 后端代码

* 开发

```bash
cd server
npm run start
```

* 部署

```bash
pm2 restart repo
```

**注意**:  因为pm2配置文件配置的进程服务名称为`repo`，详见ecosystem.config.js
