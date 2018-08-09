module.exports = {
    port: 8905,
    mysql: {
        host: 'rm-pz55r2or1m2y052zxo.mysql.rds.aliyuncs.com',
        user: 'basemanage',
        password: 'db@20180102dev',
        database: 'basemanage',
        port: 3306,
        connectionLimit: 100
    },
    com_mysql: {
        host: 'rm-pz55r2or1m2y052zxo.mysql.rds.aliyuncs.com',
        user: 'aibaoxian',
        password: '1qaz!QAZ',
        database: 'aibaoxian',
        port: 3306,
        connectionLimit: 100
    },
    ods_mysql: {
        host: 'rm-pz55r2or1m2y052zxo.mysql.rds.aliyuncs.com',
        user: 'ods',
        password: 'db@20180102dev',
        database: 'ods',
        port: 3306,
        connectionLimit: 100
    },
    log: {
        appenders: {policy: {type: 'file', filename: './logs/'}},
        categories: {default: {appenders: ['policy'], level: 'error'}}
    },
    redis: {
        host: '139.224.145.118',//安装好的redis服务器地址
        port: 26379,　//端口
        db: 0,
        password: '1qaz!QAZ'
    },
    redis1: {
        host: '139.224.145.118',//安装好的redis服务器地址
        port: 26379,　//端口
        db: 1,
        password: '1qaz!QAZ'
    },
    redis2: {
        host: '139.224.145.118',//安装好的redis服务器地址
        port: 26379,　//端口
        db: 2,
        password: '1qaz!QAZ'
    },
    redis3: {
        host: '139.224.145.118',//安装好的redis服务器地址
        port: 26379,　//端口
        db: 2,
        password: '1qaz!QAZ'
    },
    redis11: {
        host: '139.224.145.118',//安装好的redis服务器地址
        port: 26379,　//端口
        db: 11,
        password: '1qaz!QAZ'
    },
    session:
        {
            key: 'koa:sess',
            maxAge: 86400000,
            overwrite: true, /** (boolean) can overwrite or not (default true) */
            httpOnly: true, /** (boolean) httpOnly or not (default true) */
            signed: true, /** (boolean) signed or not (default true) */
            rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
        },
    dataSync: {
        dataSync_url: 'http://139.224.145.118:8910/dataSync',
        actionId: 1
    },
    notificationUpdate: {
        notification_url: 'http://139.224.145.118:8906/clearMemoryData'
    },
    dataSycUrl:'http://139.224.145.118:8910/sendBusiData2DatawareHouse',
    email:{
        server:"smtp.aibaoxian.com",
        user:"service@aibaoxian.com",
        pass:"1qaz!QAZ"
    },
    notice_corn: '0 0 9 * * *',
    upload_url:"http://dev.aibaoxian.com/static/src/cfm/",
    carFee_email:["liufengjuan@aibaoxian.com","xingqingyuan@aibaoxian.com"],
    carFee_phone:["13488812577,15210846521"],
    notice_sms_url:"http://dev.aibaoxian.com:8940/smsService",
    system_no:"S10000005",
    validate_vode_url:"http://139.224.145.118:8930/routerServices?param=",
    smartbi_token:{url:'http://139.224.149.74/vision/getpassword.jsp?',
                   mnguser:'admin',
                       mngpwd:'********'
                    },
    smartbi_open_url:"http://139.224.149.74/vision/openresource.jsp?"
};