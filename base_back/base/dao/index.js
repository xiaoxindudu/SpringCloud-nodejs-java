var util = require('util');
var transDataEng = require('../utilities/sentData2DW');
var wrapper = require('co-mysql');
const mysql=require('mysql');

var DAO = function(pool) {
    this.pool = pool;
};

DAO.mixin = function(obj) {
    for ( var key in obj) {
        if (DAO.prototype.hasOwnProperty(key)) {
            throw new Error(
                'Don\'t allow override existed prototype method. method: '
                + key);
        }
        DAO.prototype[key] = obj[key];
    }
};

DAO.prototype.queryList = async function(sql,params){
    let p = wrapper(this.pool);
    try{
        //是否需要使用co？
        var rows =await p.query(sql,params);
        let str = mysql.format(sql,params);
        logger.error('打印SQL'+str)
        transDataEng.sendData2DW(str);
        return rows;
    }catch(e){
        logger.error(e.message);
        throw e;
    }
}
DAO.prototype.query = async function(sql,params){
    let p = wrapper(this.pool);
    try{
        //是否需要使用co？
        var rows =await p.query(sql,params);
        let str = mysql.format(sql,params);
        logger.error('打印SQL'+str);
        transDataEng.sendData2DW(str);
        return rows[0];
    }catch(e){
        logger.error(e.message);
        throw e;
    }
}

DAO.prototype.querySql = async function(sql){
    let p = wrapper(this.pool);
    try{
        //是否需要使用co？
        var rows =await p.query(sql);
        logger.error('打印SQL'+sql)
        transDataEng.sendData2DW(sql);
        return rows;
    }catch(e){
        logger.error(e.message);
        throw e;
    }
}
DAO.mixin(require('./funcs'));
module.exports = DAO;