/**
 * 判断空字符串
 * @param str
 * @returns {boolean}
 */
exports.isEmptyString = function(str){
 
    return str === '' || str === undefined ||
        str === null || str === 'null';
}

/**
 * 判断空对象
 * @param obj
 * @returns {boolean}
 */
exports.isEmptyObject = function(obj){
    for (var key in obj) {
        return false;
    }
}