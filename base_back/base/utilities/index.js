/**
 * Created by liuxiaowei on 2017/8/9.
 */
let D=require('date-utils');
let moment=require('moment');
let crypto = require('crypto');
const iconv = require('iconv-lite');


/**
 * 交易流水号生成
 * 本方法不使用redis及其它数据库。
 *
 */
exports.getTransactionNo= function() {
    try {
        let timestring=Date.now().toString();
        let prefix='ABXS';
        let random=Math.random().toString()+'00000000';
        //console.log(random);
        random=random.substr(2,9);
        temp=prefix+timestring+random;
        return prefix+timestring+random;
    }catch(e){
        logger.error(e.message);
        throw e;
    }
};

//判断字符串不为空
exports.stringIsEmpty = function(param) {

        if(param != null && param !== undefined && param !== ''){
            return false;
        }else {
            return true;
        }
};

/**
 * 得到当天的日期，及0：0：0的字符串
 * @returns {string}
 */
exports.getTodayTime=function(){
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 得到当天的日期字符串
 * @returns {string}
 */
exports.getToday=function(){
    return moment(new Date()).format("YYYY-MM-DD");
}

/**
 * 得到当天的日期，及0：0：0的字符串
 * @returns {string}
 */
exports.getNowTime=function(){
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * 得到明天的日期，及0：0：0的字符串
 * @returns {string}
 */
exports.getTommorrowTime=function(){
    return moment(Date.today().add({days: 1})).format("YYYY-MM-DD HH:mm:ss");;
}
/**
 * 得到明天的日期字符串
 * @returns {string}
 */
exports.getTommorrow=function(){
    return moment(Date.today().add({days: 1})).format("YYYY-MM-DD");;
}

/**
 * 得到几天后的日期字符串
 * @returns {string}
 */
exports.getNDay=function(n){
    return moment(Date.today().add({days: n})).format("YYYY-MM-DD");;
}

/**
 * 得到指定几天后的明年的前一天，即终止时间的日期字符串
 * @returns {string}
*/
exports.getNDayNextYear=function(n){
    let temp=Date.today().add({days: n-1});
    let thisYear=Date.today().getFullYear();
    temp.setYear(thisYear+1);
    return moment(temp).format("YYYY-MM-DD");
}

/**
 * 得到指定几天后的明年的前一天，即终止时间的日期字符串
 * @returns {string}
 */
exports.getNextYearDate=function(d){
    let inputDate=new Date(d);

    let temp=inputDate.add({days: -1});
    let thisYear=inputDate.getFullYear();
    temp.setYear(thisYear+1);
    return moment(temp).format("YYYY-MM-DD");
}

/**
 * 从excel的日期日期数字返回日期类型
 * @returns {string}d
 */
exports.getExcelNumberDate=function(d){
    let orgDate=new Date(1900,0,0);
    let temp=orgDate.add({days: d-1});
    return moment(temp).format("YYYY-MM-DD");
}
/**
 *
 * @param d格式化时间日期
 * @returns {string}
 */
exports.formatTime=function(d){
    return moment(d).format("YYYY-MM-DD HH:mm:ss");
}

/**
 *
 * @param d格式化时间日期
 * @returns {string}
 */
exports.formatDate=function(d){
    return moment(d).format("YYYY-MM-DD");
}


/**
 *
 * @param d格式化时间日期
 * @returns {string}
 */
exports.formatHour=function(d){
    return moment(d).format("HH");
}


/**
 * MD5加密密码
 * @param key
 * @returns {*}
 */
exports.md5Encypt=function(key){
    const hash = crypto.createHash('md5');
    hash.update(key);
    return hash.digest('hex');
}


/**
  获取明年一月一号
 */
exports.getNextYearFirstDate=function(){
    let thisYear=Date.today().getFullYear();
    thisYear++ ;
    return thisYear + '-01-01';
}

/**
 获取今年一月一号
 */
exports.getThisYearFirstDate=function(){
    let thisYear=Date.today().getFullYear();
    return thisYear + '-01-01';
}
/**
 * 获取今年12月31号
 * @returns {string}
 */
exports.getThisYearEndDate=function(){
    let thisYear=Date.today().getFullYear();
    return thisYear + '-12-31';
}
/**
 *参数 param
 * 用于生成唯一字段值
 *
 */
exports.getSeriNo= async function(param) {
    try {
        let timestring=Date.now().toString();
        let random=Math.random().toString()+'00000000';
        random=random.substr(2,9);
        temp= param + timestring+random;
        return param+timestring+random;
    }catch(e){
        logger.error(e.message);
        throw e;
    }
};
/**
 *得到当前到毫秒的时间戳
 * @returns {string}
 */
exports.formatYYYYMMDDHHmmssSSS=function(){
    return moment(new Date()).format("YYYYMMDDHHmmssSSS");
}
/**
 * 生成主键ID
 *
 */
exports.createUUID= function(param) {
    try {
        let random=Math.random().toString()+'00000000';
        random=random.substr(2,12);
        let timestring = this.formatYYYYMMDDHHmmssSSS();
        return param + timestring + random;
    }catch(e){
        logger.error(e);
        throw e;
    }
};
// 获得当前周的周一
exports.getFirstDayOfWeek = function() {
    let date = new Date();
    let day = date.getDay() || 7;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 - day);
};
// 获得指定日期的周一
exports.getFirstDayOfParamWeek = function(param) {
    let day = param.getDay() || 7;
    return new Date(param.getFullYear(), param.getMonth(), param.getDate() + 1 - day);
};
//指定日期所有天集合
exports.getAllDays = function( begin_date, end_date ) {
    const errArr = [],
        resultArr = [],
        dateReg = /^[2]\d{3}-[01]\d-[0123]\d$/;

    if ( typeof begin_date !== 'string' || begin_date === '' || !dateReg.test( begin_date ) ) {
        return errArr;
    }

    if ( typeof end_date !== 'string' || end_date === '' || !dateReg.test( end_date ) ) {
        return errArr;
    }

    try {
        const beginTimestamp = Date.parse( new Date( begin_date ) ),
            endTimestamp = Date.parse( new Date( end_date ) );

        // 开始日期小于结束日期
        if ( beginTimestamp > endTimestamp ) {
            return errArr;
        }

        // 开始日期等于结束日期
        if ( beginTimestamp === endTimestamp ) {
            resultArr.push( begin_date );
            return resultArr;
        }

        let tempTimestamp = beginTimestamp,
            tempDate = begin_date;


        // 新增日期是否和结束日期相等， 相等跳出循环
        while ( tempTimestamp !== endTimestamp ) {
            resultArr.push( tempDate );

            // 增加一天
            tempDate = moment( tempTimestamp )
                .add( 1, 'd' )
                .format( 'YYYY-MM-DD' );

            // 将增加时间变为时间戳
            tempTimestamp = Date.parse( new Date( tempDate ) );
        }

        // 将最后一天放入数组
        resultArr.push( end_date );
        return resultArr;

    } catch ( err ) {
        return errArr;
    }
}

/**
 *根据环境获取对应的接口地址
 * @returns {string}
 */
exports.getEnvInterfaceAddress=function(addrJson){
    let environment = global.node_env;
    let envInterfaceAddress = '';
    console.log(environment);
    try{
        if(global.node_env =='production'){//生产环境
            envInterfaceAddress = addrJson.production;
        }else if(global.node_env =='test'){//测试环境
            envInterfaceAddress = addrJson.test;
        }else{//development 开发环境
            envInterfaceAddress = addrJson.dev;
        }
    }catch (e){
        //console.log(addrJson+"--->不是合法的json格式")
        throw e;
    }
    return envInterfaceAddress;
}