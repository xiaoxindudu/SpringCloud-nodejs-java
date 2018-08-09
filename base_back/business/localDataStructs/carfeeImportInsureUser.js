'use strict';

class carfeeImportInsureUser{
    constructor(){
        this.data={
            "head": {
                "timeStamp": "",//交易时间YYY-MM-DD HH:MM:SS
                "errorCode": "0000",//0000:成功；其它代表异常
                "errorMessage": "成功"//异常信息
            },
            "body": {
                flag:"",
                userId:"",
                conditions:
                    {
                        filename:"",
                        channelLevel:"",
                        upChannelId:"",
                        upUserChannelId:"",
                        channelId:"",
                        channelName:"",
                        channelDuty:"",
                        dutyPhone:"",
                        dutyEmail:""
                    }
            }
        }
    }
}
module.exports = carfeeImportInsureUser;