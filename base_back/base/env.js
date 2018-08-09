/**
 * Created by liuxiaowei on 2017/8/15.
 */
exports.makeEnv=function(port){
    /**
     * 设置环境变量，表明当前运行的环境。
     * 在app启动时进行设置
     * export NODE_ENV=deubg forever start qunar_fight_delay_annual.js
     */
    if(global.node_env==null){
        global.node_env=process.env.NODE_ENV;
    }

    /**
     * 根据不同的环境变量，调用相应的配置文件
     * @type {boolean}
     */
    let environment = global.node_env;
    console.log(environment);
    if(global.node_env =='production'){//生产环境
        global.config=require('./conf/production.js');
    }else if(global.node_env =='test'){//测试环境
        global.config=require('./conf/test.js')
    }else{//development 开发环境
        global.config=require('./conf/dev.js')
        environment = 'development';
    }

    console.log(global.config);

    if(port!=null){
        global.config.port=port;
    }
    /**
     * 设置log输出时的全局量
     * @type {LOG}
     */
    const LOG = require('./log');
    global.logger=new LOG();

    /**
     * 设置redis的全局量
     * @type {REDIS}
     */
    const RD=require('./redis');
    global.redis=new RD();

    /**
     * 设置mysql操作的全局量
     * 使用mysql建立连接池，并传给DAO一个连接
     * @type {DAO}
     */
    const mysql=require('mysql');
    const DAO=require('./dao');
    global.dao = new DAO(mysql.createPool(global.config.mysql));



    global.com_dao = new DAO(mysql.createPool(global.config.com_mysql));

    global.ods_dao = new DAO(mysql.createPool(global.config.ods_mysql));

    return environment;
}