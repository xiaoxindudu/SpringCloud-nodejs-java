module.exports = {
    port:8905,
    channel:'',
    project:'业务管理系统',
    mysql : {
		host : 'rm-pz5uq61vb2prp50e5.mysql.rds.aliyuncs.com',
		user : 'basemanage',
		password : '5tgb%TGB@20180102base',
		database : 'basemanage',
		port : 3306,
        connectionLimit:100
    },
    com_mysql : {
        host : 'rm-pz58f68xepra0q2lgo.mysql.rds.aliyuncs.com',
        user : 'aibaoxian',
        password : '1qaz!QAZ',
        database : 'aibaoxian',
        port : 3306,
        connectionLimit:100
    },
    ods_mysql : {
        host : 'rm-pz58f68xepra0q2lgo.mysql.rds.aliyuncs.com',
        user : 'aibaoxian',
        password : '1qaz!QAZ',
        database : 'aibaoxian',
        port : 3306,
        connectionLimit:100
    },
    log:{
        appenders: { policy: { type: 'file', filename: '/mnt/logs/'} },
        categories: { default: { appenders: ['policy'], level: 'error' } }
    },
    redis:{
        host : 'r-pz5a946a330e1744.redis.rds.aliyuncs.com',//安装好的redis服务器地址
        port : 6379,　//端口
        db: 0,
        password:'1qaz1QAZ'
    },
    redis1:{
        host : 'r-pz5a946a330e1744.redis.rds.aliyuncs.com',//安装好的redis服务器地址
        port : 6379,　//端口
        db: 1,
        password:'1qaz1QAZ'
    },
    redis2:{
        host : 'r-pz5a946a330e1744.redis.rds.aliyuncs.com',//安装好的redis服务器地址
        port : 6379,　//端口
        db: 2,
        password:'1qaz1QAZ'
    },
    redis3:{
        host : 'r-pz5a946a330e1744.redis.rds.aliyuncs.com',//安装好的redis服务器地址
        port : 6379,　//端口
        db: 3,
        password:'1qaz1QAZ'
    },
    redis11:{
        host : 'r-pz5a946a330e1744.redis.rds.aliyuncs.com',//安装好的redis服务器地址
        port : 6379,　//端口
        db: 11,
        password:'1qaz1QAZ'
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
        dataSync_url: 'http://139.224.146.188:8910/dataSync',
        actionId: 2
    },
    dataSycUrl:'http://139.224.138.101:8910/sendConfigDataFromDW2Product',
    mobilebusiness:{
        mobilebusinessUrl:'http://businessmobile.aibaoxian.com/static/8906/index.html',
        corpsecret:'HSBjEjPpeMfXv1jgs3GV_uVMKmYAlXLXvY01hr4eN9A'
    },
    email:{
        server:"smtp.aibaoxian.com",
        user:"service@aibaoxian.com",
        pass:"1qaz!QAZ"
    },
    notice_corn: '0 0 9 * * *',
    upload_url:"http://www.aibaoxian.com/static/src/cfm/",
    carFee_email:["liuwenjing@aibaoxian.com","wujingjing@aibaoxian.com"],
    carFee_phone:["13701017433,13810952288"],
    notice_sms_url:"http://www.aibaoxian.com:8940/smsService",
    system_no:"S10000005",
    validate_vode_url:"http://router.aibaoxian.com/routerServices?param=",
    smartbi_token:{url:'http://139.224.149.74/vision/getpassword.jsp?',
        mnguser:'admin',
        mngpwd:'********'
    },
    smartbi_open_url:"http://139.224.149.74/vision/openresource.jsp?"
};