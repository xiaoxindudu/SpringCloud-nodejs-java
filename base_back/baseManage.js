const Koa = require('koa');
const controller = require('./controller');
const app = new Koa();
const env=require('./base/env');
const bodyParser = require('koa-body');
const session = require('koa-session2');
/**
 * 设置cookie加密的密码，可以不设置，需要在config中将singed=false;
 * @type {[*]}
 */

let port=process.argv[2];

let isProduction=env.makeEnv(port);

app.keys=['abx'];
app.use(session(global.config.session,app));

/**
 * 对路由等进行扫描注册
 */
// parse request body:
// app.use(bodyParser());
const koaBody = require('koa-body');
app.use(koaBody({ multipart: true }));


//对跨域请求许可访问，因为本服务是API服务，存在其它页面直接访问的可能。
var cors = require('koa-cors');
app.use(cors());

app.use(controller());

app.listen(global.config.port);
console.log('app started at port: '+global.config.port+'...');
