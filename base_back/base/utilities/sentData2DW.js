'use strict';
const jsonTransData = require('./transDataModual');
const axios=require('../axios/index');
//数据同步到DW
exports.sendData2DW = async function(params) {
    try {
        logger.error('传输SQL：'+params);

        if(global.node_env !='production'){
            return;
        }
        let str = params.toLowerCase();
        if( str.indexOf('add')>=0 ||
            str.indexOf('delete')>=0||
            str.indexOf('update')>=0||
            str.indexOf('insert')>=0||
            str.indexOf('creat')>=0
        ){
        	  logger.error("pxc进入数据推送params="+params+"=====dataSycUrl="+global.config.dataSycUrl);
            let dataModual = new jsonTransData();
            dataModual.data.body.SQL = params;
            let result = await axios.post(global.config.dataSycUrl,dataModual.data);
            logger.error("pxc进入数据推送params=result"+result);
            return 'ok';
        }
    }
    catch(e){
        logger.error(e.message);
    }
};