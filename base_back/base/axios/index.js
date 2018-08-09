/**
 * for axios service
 */
const axios=require('axios');
exports.post=async function(url,data){
    try{
        result=await axios.post(url,data,{timeout:18000});
        return result;
    }catch(e){
        throw e;
    }
};
exports.get=async function(url){
    try{
        result=await axios.get(url,{timeout:18000});
        return result;
    }catch(e){
        throw e;
    }
}