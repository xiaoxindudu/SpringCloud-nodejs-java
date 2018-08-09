/*
车险渠道服务实现
* */
const errorCodeMsg = require('../common/errorCodeMsg');
const util = require('../../base/utilities/index');
const faker = require('faker/locale/zh_CN')
/**
 * 新增车险渠道费率
 * product_fee_config
 * @param data 入参报文
 * @returns {Promise<*>}
 */
exports.demoServiceImpl=async function(data) {
    logger.debug('demoServiceImpl：开始');
    try{
        let user = data;
        let flag = data.flag;
        let count = 100;
        const books = new Array(count);
        while (count > 0) {
                books[count-1] = {
                    id: count.toString(),
                    name: faker.name.title(),
                    authorId: (parseInt(Math.random() * 100) + 1).toString(),
                    publishDate: faker.date.past().toLocaleString(),
                    des: faker.lorem.paragraph(),
                    ISBN: `ISBN 000-0000-00-0`
                }
                count --
            }
        const userrs = new Array(1)
        userrs[0] = {
                id: user.id,
                username: user.username,
                age: user.age,
                userid: user.userid,
                flag: user.flag
         }
        //检查列表是否为空
        if (books.length == 0) {
            userrs[0].errorCode = "2005";
            userrs[0].errorMessage = errorCodeMsg[2005];
        }else
        {//全部执行完成无异常则 默认成功
            userrs[0].books=books;
            userrs[0].errorCode = "0000";
            userrs[0].errorMessage = "成功";
        }
        logger.debug('demoServiceImpl：结束');
        return userrs;
    } catch(e){
        logger.error(e.message);
        console.log(e.stack);
        userrs[0].errorCode = "2005";
        userrs[0].errorMessage = errorCodeMsg[2005];
        return userrs;
    }
}
