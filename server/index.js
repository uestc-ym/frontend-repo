import Koa from 'koa';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import koaStatic from 'koa-static';
import koaBody from 'koa-body';
import log4js from 'log4js';
import path from 'path';
import router from './router/index.js';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new Koa();

const PORT = process.argv.length >= 3 ? ~~process.argv[2] : 3000;

log4js.configure({
    appenders: { default: { type: 'console' }, cheese: { type: 'file', filename: 'logs/cheese.log' } },
    categories: { default: { appenders: ['default', 'cheese'], level: 'debug' } }
});
const logger = log4js.getLogger('server');

// 访问日志
app.use(async (ctx, next) => {
    const startTime = Date.now();
    try {
        await next();
    } catch (e) {
        // logger.error(e);
    }
    logger.info('%s %s %d %d', ctx.method, ctx.url, Date.now() - startTime, ctx.status);
});

// 注意：配置路由 fallback（必须放在静态资源之前）-- 所有请求（除静态资源、接口外），都返回 index.html，交给前端路由处理。
app.use(historyApiFallback({
    whiteList: ['/api']
}));

// 静态资源
app.use(koaStatic(path.resolve(__dirname, '../client/dist')));

app.use(koaBody({
    formLimit: '1G',
    multipart: true
}));

router(app);

app.listen(PORT, '0.0.0.0', () => {
    logger.info('System start at', PORT);
});

process.on('unhandledRejection', (error) => {
    // logger.error(error);
});

process.on('uncaughtException', (error) => {
    // logger.error(error);
});