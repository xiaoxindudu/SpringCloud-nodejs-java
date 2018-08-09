/**
 * Created by liuxiaowei on 2017/8/15.
 */

exports.getDataFromExcel=function(filename){
    const xlsx = require("node-xlsx");
    let list = xlsx.parse(filename);
    return list;
}