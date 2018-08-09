module.exports = {

    'GET /health': async (ctx, next) => {
        ctx.body={status:'UP'}
        await next();
    }
};