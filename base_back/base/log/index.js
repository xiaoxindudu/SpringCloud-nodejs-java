/**
 * Created by liuxiaowei on 2017/6/12.
 */
const log4js = require('log4js')


var LOG = function() {
    /**
     * 如果要记录sql文等其它信息，需要使用log4js。
     * log的记录在生产环境中需要考虑转为专用的服务解决，不能放置于服务器的容器中！！！
     */
    global.config.log.appenders.policy.filename+=global.config.port;
    global.config.log.appenders.policy.filename+='/node.log';
    log4js.configure(global.config.log);
    this.log=log4js.getLogger('policy');
    /**
     * 通过export NODE_ENV=DEBUG 等值的设定，控制log的输出等级
     */
    this.log.level= global.node_env;

};

LOG.mixin = function(obj) {
    for ( var key in obj) {
        if (LOG.prototype.hasOwnProperty(key)) {
            throw new Error(
                'Don\'t allow override existed prototype method. method: '
                + key);
        }
        LOG.prototype[key] = obj[key];
    }
};

LOG.prototype.debug=function(msg) {
    this.log.debug(msg);
};

LOG.prototype.error = function(msg) {
    if(msg.hasOwnProperty("stack")){
          this.log.error(msg.stack);
    } else {
          msg=msg.toString().replace(/\n/g,' ');
          this.log.error(msg);
    }
};

module.exports = LOG;