/**
 * Created by zhangfei on 2018/4/27.
 */

const xlsx=require("node-xlsx");
const fs=require("fs");

exports.exportExcelFile=async function(filename,data){

    //获得buffer流
    var buffer=xlsx.build(data);

    //导出文件标识
    let flag=true;

    //导出excel文件
    flag=this.writeFileSync(filename,buffer);

    // fs.writeFile(filename,buffer,function(e){
    //     if(e){
    //         logger.error(e);
    //         console.log(e);
    //         flag=false;
    //     }
    //     console.log(filename+' writed to excel has finished');
    //     // 读excel
    //     //var obj = xlsx.parse(filename);
    //     //console.log(JSON.stringify(obj));
    // })
    return flag;
};
exports.writeFileSync = function(path, data, options) {
    let isTrue=true;
    if (!options) {
        options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' };
    } else if (util.isString(options)) {
        options = { encoding: options, mode: 438, flag: 'w' };
    } else if (!util.isObject(options)) {
        throw new TypeError('Bad arguments');
    }
    //assertEncoding(options.encoding);
    var flag = options.flag || 'w';
    var fd = fs.openSync(path, flag, options.mode);
    // if (!util.isBuffer(data)) {
    //     data = new Buffer('' + data, options.encoding || 'utf8');
    // }
    var written = 0;
    var length = data.length;
    var position = /a/.test(flag) ? null : 0;
    try {
        while (written < length) {
            written += fs.writeSync(fd, data, written, length - written, position);
            position += written;
        }
    } catch(e){
        isTrue=false;
    } finally {
        fs.closeSync(fd);
        return isTrue;
    }
};