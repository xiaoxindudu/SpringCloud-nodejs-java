/**
 * Created by suxiaoqiang on 2017/09/01.
 */
'use strict';

class jsonTransData {
    constructor() {
        this.data = {
            "head": {
                "platform": "ABX",
                "timeStamp": "",//交易时间YYY-MM-DD HH:MM:SS
                "extTransactionNo": "",// 对方交易流水号
                "localTransactionNo": "",//本地交易流水号
                "systemId": "system",//
                "MD5": "",//MD5校验
                "errorCode": "0000",//0000:成功；其它代表异常
                "errorMessage": "成功"//异常信息
            },
            "body": {
                "dbName":"basemanage",//数据库名称
                "SQL": "ret"//SQL语句
            }
        }
    }
}
module.exports = jsonTransData;