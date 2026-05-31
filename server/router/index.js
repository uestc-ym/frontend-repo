import KoaRouter from 'koa-router'; 
const router = new KoaRouter();

export default (app) => {
    router.get('/', async (ctx) => {
        ctx.body = 'Hello Koa!';
    });
    router.get('/about', async (ctx) => {
        ctx.body = 'About Us';
    });

    app
        .use(async (ctx, next) => {
            // do something
            try {
                await next();
            } catch (e) {
                console.error(e);
            }
        })
        .use(router.routes())
        .use(router.allowedMethods()); // 使用路由中间件
}