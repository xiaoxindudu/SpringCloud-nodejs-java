/**
 * Created by liuxiaowei on 2017/6/15.
 */
var Redis=require('ioredis');
const ut=require('../utilities/index');
const funcs=require('../dao/funcs');

var REDIS = function() {
    try{
        this.client = new Redis(config.redis);
        this.clientDB1 = new Redis(config.redis1);
        this.clientDB2 = new Redis(config.redis2);
        this.clientDB11 = new Redis(config.redis11);
        //服务发现用
        this.ServiceDB = new Redis(config.redis3);
    }catch(e){
        logger.error(e.message);
    }
};


REDIS.mixin = function(obj) {
    for ( var key in obj) {
        if (REDIS.prototype.hasOwnProperty(key)) {
            throw new Error(
                'Don\'t allow override existed prototype method. method: '
                + key);
        }
        REDIS.prototype[key] = obj[key];
    }
};
/**
 *
 *取得一个安全码
 *
 */
REDIS.prototype.getSecurityNo=async function(username) {
    try {
        const ut=require('../utilities/index');

        let key  =ut.getTransactionNo();
        let multi=await this.clientDB2.multi();
        await multi.setex(key,1800,username);
        await multi.exec(function (err, replies) {
        });
        return key;
    }catch(e){
        logger.error(e.message);
    }
}

/**
 *
 *查询安全码并将其删
 *
 */
REDIS.prototype.checkSecurityNo=async function(key) {
    try {
        let ret = await this.clientDB2.get(key);
        if(ret == null||ret == ''){
            return null;
        }else{
            let multi = await this.clientDB2.multi();
            // await multi.del(key);
            await multi.setex(key,1800,'FIXEDNAME');
            await multi.exec(function (err, replies) {
            });
        }
        return ret;
    } catch (e) {
        logger.error(e.message);
    }
}
/**
 *
 *获取表中最大值数据
 *
 */
REDIS.prototype.getMaxId=async function(tableName, columnName) {
    try {
        let maxId  =funcs.get_maxTableId(tableName, columnName);
        let multi=await this.clientDB2.multi();
        await multi.setex(tableName,1800,maxId);
        await multi.exec(function (err, replies) {
        });
        return tableName;
    }catch(e){
        logger.error(e.message);
    }
}

/**
 *
 *计算最大值覆盖当前值
 *
 */
REDIS.prototype.updateMaxId=async function(tableName, columnName) {
    try {
        let ret = await this.clientDB2.get(tableName);
        if(ret == null||ret == ''){
            return null;
        }else{
            let maxId  =funcs.get_maxTableId(tableName, columnName);
            let multi = await this.clientDB2.multi();
            await multi.setex(tableName,1800,maxId);
            await multi.exec(function (err, replies) {
            });
        }
        return ret;
    } catch (e) {
        logger.error(e.message);
    }
}

module.exports = REDIS;