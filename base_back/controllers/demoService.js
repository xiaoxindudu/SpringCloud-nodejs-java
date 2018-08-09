/**
 *车险 渠道佣金接口
 */
const demoServiceImpl = require('../business/baseManage/demoServiceImpl.js');
const errorCodeMsg = require('../business/common/errorCodeMsg');
module.exports = {

    'POST /demoService': async (ctx, next) => {
        logger.debug('demoService：开始');
        try {
            //获取前端请求数据
            console.log("请求的数据：" + JSON.stringify(ctx.request.body));
            let data = ctx.request.body;
            let flag = ctx.request.body.flag;
            if("1" == flag ){
                data=await demoServiceImpl.demoServiceImpl(data);
            } else if( "2" == flag ){


            } else if( "3" == flag ){

            } else if( "4" == flag ){

            } else if( "5" == flag ) {


            }else if( "6" == flag ){

            } else {
                data.head.errorCode = "1323";
                data.head.errorMessage = errorCodeMsg[1323];
                logger.error('carChannelsService：返回前端数据'+ret);
            }
            logger.debug('demoService：结束');
            ctx.response.body=data;
            await next();
        }catch (e)
        {
            logger.error(e.message);
            ctx.response.body=null;
            await next();
        }
    }
};
