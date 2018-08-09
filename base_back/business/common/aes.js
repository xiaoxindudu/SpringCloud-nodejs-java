/**
 * Created by liuxiaowei on 2017/8/2.
 */
let crypto = require('crypto');

exports.aesEncrypt=function(data, key) {
    const cipher = crypto.createCipher('aes-128-ecb', key);
    //data=new Buffer(data);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.aesEncrypt2Base64=function(data, key) {
    const cipher = crypto.createCipher('aes-128-ecb', key);
    //data=new Buffer(data);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    let base64=new Buffer(crypted,'hex').toString('base64');
    return base64;
}

exports.aesDecrypt=function(encrypted, key) {
    var cipher = crypto.createDecipher('aes-128-ecb',key);
    let temp=cipher.update(encrypted,'hex','utf8') + cipher.final('utf8');
    //console.log(temp);
    return temp;
}

exports.aesDecryptFromBase64=function(encrypted, key) {
    if(encrypted ==null ||encrypted.length == 0 ){
        return null;
    }
    let data=new Buffer(encrypted,'base64').toString('hex');
    var cipher = crypto.createDecipher('aes-128-ecb',key);
    let temp=cipher.update(data,'hex','utf8') + cipher.final('utf8');
    //console.log(temp);
    return temp;
}

exports.md5Encypt=function(data){
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
}

exports.aesDecryptByMD5=function(data,key){
    key=this.md5Encypt(key).toString('hex');
    return this.testDecrypt(data,key);
}

exports.aesEncryptByMD5=function(data,key){
    key=this.md5Encypt(key).toString('hex');
    return this.aesEncrypt(data,key);
}

