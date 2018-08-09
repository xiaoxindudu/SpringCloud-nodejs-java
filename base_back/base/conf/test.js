module.exports = {
	port:8905,
	mysql : {
		host : 'rm-pz58f68xepra0q2lgo.mysql.rds.aliyuncs.com',
		user : 'basemanage',
		password : 'db@20180102test',
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
        user : 'ods',
        password : 'db@20180102test',
        database : 'ods',
        port : 3306,
        connectionLimit:100
    },
    log:{
        appenders: { policy: { type: 'file', filename: './logs/' } },
        categories: { default: { appenders: ['policy'], level: 'error' } }
    },
    redis:{
        host : '139.224.147.135',//安装好的redis服务器地址
        port : 26379,　//端口
        db: 0,
        password:'1qaz!QAZ'
    },
    redis1:{
        host : '139.224.147.135',//安装好的redis服务器地址
        port : 26379,　//端口
        db: 1,
        password:'1qaz!QAZ'
    },
    redis2:{
        host : '139.224.147.135',//安装好的redis服务器地址
        port : 26379,　//端口
        db: 2,
        password:'1qaz!QAZ'
    },
    redis3:{
        host : '139.224.147.135',//安装好的redis服务器地址
        port : 26379,　//端口
        db:3,
        password:'1qaz!QAZ'
    },
    redis11:{
        host : '139.224.147.135',//安装好的redis服务器地址
        port : 26379,　//端口
        db:11,
        password:'1qaz!QAZ'
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
        dataSync_url: 'http://139.224.147.135:8910/dataSync',
        actionId: 1
    },
    notificationUpdate: {
        notification_url: 'http://139.224.147.135:8906/clearMemoryData'
    },
    dataSycUrl:'http://localhost:8910/sendBusiData2DatawareHouse',
    mobilebusiness:{
        mobilebusinessUrl:'http://testbusinessmobile.aibaoxian.com/static/OAfrontbase/index.html',
        corpsecret:'tdoStFuMKeg6SnZ2qKQ19gFZOQjosqNm1P48_r-nVyE'
    },
    email:{
        server:"smtp.aibaoxian.com",
        user:"service@aibaoxian.com",
        pass:"1qaz!QAZ"
    },
    notice_corn: '0 30 16 * * *',
    upload_url:"http://test.aibaoxian.com/static/src/cfm/",
    carFee_email:["liufengjuan@aibaoxian.com","xingqingyuan@aibaoxian.com"],
    carFee_phone:["13488812577,15210846521"],
    notice_sms_url:"http://test.aibaoxian.com:8940/smsService",
    system_no:"S10000005",
    validate_vode_url:"http://test.router.aibaoxian.com/routerServices?param=",
    smartbi_token:{url:'http://139.224.149.74/vision/getpassword.jsp?',
        mnguser:'admin',
        mngpwd:'********'
    },
    smartbi_open_url:"http://139.224.149.74/vision/openresource.jsp?"
};