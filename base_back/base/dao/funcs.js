/**
 * authorize
 * 页面用户登录
 */
var util = require('../utilities/index.js');
const mysql=require('mysql');
var commons = require('../../business/common/commons.js');


exports.authorize = async function(params){
    logger.error(params);
    let sql = 'call proc_sysUsers_check(?,?,?,?)';
    let rows=await this.query(sql,params);
    if(rows.length>0){
        let ret  = rows[0].role;
        return ret;
    }else{
        return null;
    }
};
exports.getSystemCountDb=async function(conditions){
    let str_sql = `SELECT count(*) count FROM systems where 1=1 `;
    if(conditions.systemId){
        str_sql += ` and systemId = '${conditions.systemId}'`;
    }
    if(conditions.systemName){
        str_sql += ` and systemName like '%${conditions.systemName}%'`;
    }
    str_sql += ` and rcd_end_time =date('9999-12-31')`;
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getSystemListFromDb=async function(conditions, from, length){
    let str_sql = `SELECT * FROM systems where 1=1 `;
    if(conditions.systemId){
        str_sql += ` and systemId = '${conditions.systemId}'`;
    }
    if(conditions.systemName){
        str_sql += ` and systemName like '%${conditions.systemName}%'`;
    }
    str_sql += ` and rcd_end_time =date('9999-12-31') order by systemId desc limit ?, ?`;
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.addOrUpdateSystemInfoFromDb=async function(flag, params){

    let sql = '';
    if('1' == flag){
        // sql = "INSERT INTO systems VALUES ('"+systemId+"', '"+systemName+"', '"+projects+"', '"+port+"', '"+servicemode+"', '"+interfacemode+"', '"+type+"', '"+description+"', '"+extend1+"', '"+extend2+"', '"+extend3+"', '"+userId+"', '"+userId+"', '"+util.getNowTime()+"','"+util.getNowTime()+"', '9999-12-31 00:00:00')";
        sql = "call proc_systems_add(?,?,?,?,?,?,?,?,?,?,?,?)";
    }else{
        sql = "UPDATE systems SET systemName=?, project=?, port=?,servicemode=?,interfacemode=?,type=?,description=?,extend1=?,extend2=?,extend3=? where systemId = ? AND rcd_end_time =date('9999-12-31')";
    }
    let rows=await global.dao.query(sql,params);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.deleteSystemFromDb=async function(key,userId){
    let sql = "UPDATE systems SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE systemId = '"+key+"' AND  rcd_end_time =date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.queryTableIdMaxFromDb =async function(tableName,key){
    let sql = "SELECT systemId from "+tableName+" where  rcd_end_time =date('9999-12-31') order by "+key+" desc ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.querySystemInfoFromDb =async function(systemName){
    let sql = "SELECT * from systems where systemName = '"+systemName+"' AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getSystemPrivilegesFromDb=async function(systemId){
    let sql = "SELECT * FROM `privilegeinfo` where systemId ='"+systemId+"' AND  rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.queryPrivilegeInfoFromDb =async function(systemId,privilegeId){
    let sql = "SELECT * from privilegeinfo where privilegeId = '"+privilegeId+"' AND systemId = '"+systemId+"' AND rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatePrivilegeFromDb=async function(data){
    let userId = data.body.userId ;
    let pid = data.body.privilege.pid || '';
    let systemId = data.body.privilege.systemId || '';
    let privilegeId = data.body.privilege.privilegeId || '';
    let privilegeName = data.body.privilege.privilegeName || '';
    let fatherId = data.body.privilege.fatherId || '';
    let privilegeUrl = data.body.privilege.privilegeUrl || '';
    let isEffective = data.body.privilege.isEffective || '';
    let menuType = data.body.privilege.menuType || '';
    let privilegeDetail = data.body.privilege.privilegeDetail || '';

    let sql = '';
    if(data.body.flag == 1 ){
        sql = "INSERT INTO `privilegeinfo` (systemId,privilegeId,privilegeName,fatherId,privilegeUrl,isEffective,menuType,privilegeDetail,rcd_crt_user,rcd_mod_user,rcd_crt_time,rcd_mod_time,rcd_end_time) VALUES ('"+systemId+"','"+privilegeId+"','"+privilegeName+"','"+fatherId+"','"+privilegeUrl+"','"+isEffective+"','"+menuType+"','"+privilegeDetail+"','"+userId+"','"+userId+"','"+util.getNowTime()+"','"+util.getNowTime()+"', '9999-12-31 00:00:00')";
    }else{
        sql = "UPDATE privilegeinfo SET privilegeName='"+privilegeName+"', fatherId='"+fatherId+"', privilegeUrl='"+privilegeUrl+"',isEffective='"+isEffective+"',menuType='"+menuType+"',privilegeDetail='"+privilegeDetail+"' where pid = '"+pid+"' AND rcd_end_time =date('9999-12-31')";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }

};
exports.deletePrivilegeFromDb=async function(keys,userId){
    let rows = '';
    for(let i=0; i < keys.length; i++){
        let  pid = keys[i].pid;
        let sql = "UPDATE privilegeinfo SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE pid = "+pid+"  AND  rcd_end_time =date('9999-12-31')";
        rows=await this.querySql(sql);
    }
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getRolePrivilegeCountDb=async function(roleId,pid){
    let str_sql = "SELECT count(*) count FROM roleright where 1=1 ";
    if(roleId){
        str_sql += " AND roleId = '"+roleId+"' ";
    }
    if(pid){
        str_sql += " AND pid = '"+pid+"' ";
    }
    str_sql += " AND rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.deleteRoleInfoFromDb=async function(roleId,userId){
    let sql = "UPDATE roleinfo SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE roleId = "+roleId+"  AND  rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.queryRoleInfoFromDb =async function(systemId,roleName,roleId){
    let strSql='';
    if(!roleId){
        strSql = "SELECT * from roleinfo where roleName = '"+roleName+"' AND systemId = '"+systemId+"' AND rcd_end_time =date('9999-12-31')";
    }else{
        strSql = "SELECT * from roleinfo where roleId = '"+roleId+"' AND rcd_end_time =date('9999-12-31')";
    }
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdateRoleFromDb=async function(data){
    let userId = data.body.userId ;
    let roleId = data.body.roleInfo.roleId || '';
    let systemId = data.body.roleInfo.systemId || '';
    let roleName = data.body.roleInfo.roleName || '';
    let isForbidden = data.body.roleInfo.isForbidden || '';
    let description = data.body.roleInfo.description || '';

    let sql = '';
    if(data.body.flag == 1 ){
        sql = "INSERT INTO `roleinfo` (systemId,roleName,isForbidden,description,rcd_crt_user,rcd_mod_user,rcd_crt_time,rcd_mod_time) VALUES ('"+systemId+"','"+roleName+"','"+isForbidden+"','"+description+"','"+userId+"','"+userId+"','"+util.getNowTime()+"','"+util.getNowTime()+"')";
        // sql = "call proc_roleinfo_add(?,?,?,?,?,?)";
        // params = [systemId, roleName, isForbidden, description, userId, userId];
    }else{
        sql = "UPDATE roleinfo SET roleName='"+roleName+"',isForbidden = '"+isForbidden+"',description='"+description+"'  , rcd_mod_user='"+userId+"',rcd_mod_time='"+util.getNowTime()+"'  where roleId = '"+roleId+"'  AND rcd_end_time =date('9999-12-31')";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        let sql_query = " SELECT * FROM roleinfo t WHERE t.systemId='"+systemId+"' AND t.roleName='"+roleName+"' AND t.rcd_end_time=date('9999-12-31') ";
        let  ret=await this.querySql(sql_query);
        return ret;
    }else{
        return null;
    }

};
exports.getSystemRoleCountDb=async function(systemId,roleName){
    // let str_sql = "SELECT count(*) count FROM roleinfo where 1=1 ";
    let str_sql = "SELECT count(*) count FROM `roleinfo` R, systems S where S.systemId = R.systemId and  R.rcd_end_time = S.rcd_end_time ";
    if(systemId){
        str_sql += " AND R.systemId = '"+systemId+"' ";
    }
    if(roleName){
        str_sql += " AND R.roleName = '"+roleName+"' ";
    }
    str_sql += " AND R.rcd_end_time =date('9999-12-31')";

    // let sql = "SELECT count(*) count FROM roleinfo where rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getSystemRolesFromDb=async function(systemId,roleName,from,length){
    let str_sql = 'SELECT s.systemName,r.* FROM `roleinfo` R, systems S where S.systemId = R.systemId and  R.rcd_end_time = S.rcd_end_time ';
    if(systemId){
        str_sql += " AND R.systemId ='"+systemId+"' ";
    }
    if(roleName){
        str_sql += " AND R.roleName like '%"+roleName+"%' ";
    }
    str_sql += " AND  R.rcd_end_time =date('9999-12-31') order by r.rcd_crt_time  desc limit ? , ?";

    let sqlFormat =  mysql.format(str_sql,[from,length]);

    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.deleteUserRoleInfoFromDb=async function(roleId,userId,userUserId){
    let sql = "UPDATE userrole SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE roleId = '"+roleId+"' AND userId = '"+userUserId+"' AND  rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.modifyRolePrivilegeInfoFromDb =async function(data){
    let userId = data.body.userId ;
    let roleId = data.body.roleId || '';
    let rolePrivileges = data.body.rolePrivileges || '';
    let nowDate = util.getNowTime();
    let rows = '';
    let sql_delete = " delete from roleright  where roleId = '"+roleId+"'  and rcd_end_time=DATE('9999-12-31 00:00:00') ";
    let ret=await this.querySql(sql_delete);
    if(rolePrivileges.length > 0){
        for (let i = 0; i < rolePrivileges.length; i++) {
            let pid = rolePrivileges[i].pid || '';
            let sql = " INSERT INTO `roleright` (`roleId`, `pid`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ('"+roleId+"', '"+pid+"', '"+userId+"', '"+userId+"', '"+nowDate+"', '"+nowDate+"') ";
            rows=await this.querySql(sql);
        }
    }
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.queryRolePrivilegesFromDb=async function(roleId){
    let sql = " select * from roleright where roleId = '"+roleId+"' and rcd_end_time =date('9999-12-31') ";
    // let sqlFormat =  mysql.format(str_sql);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.queryUserInfoFromDb =async function(userUserId){
    let strSql = "SELECT * from userinfo where userId = '"+userUserId+"'  AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.queryUserByMobileFromDb =async function(mobile){
    if(mobile){
        let strSql = `SELECT count(mobile) count from userinfo where mobile = '${mobile}'  AND rcd_end_time =date('9999-12-31')`;
        let rows=await this.querySql(strSql);
        if(rows.length>0){
            let ret  = rows[0].count;
            return ret;
        }else{
            return null;
        }
    }else{
       return null;
    }   

};
exports.queryUserByEmailFromDb =async function(email){
    if(email){
        let strSql = `SELECT count(email) count from userinfo where email = '${email}'  AND rcd_end_time =date('9999-12-31')`;
        let rows=await this.querySql(strSql);
        if(rows.length>0){
            let ret  = rows[0].count;
            return ret;
        }else{
            return null;
        }
    }else{
        return null;
    }

};
exports.addOrUpdatUserInfoFromDb=async function(data){
    let userId = data.body.userId ;
    let userUserId = data.body.userInfo.userUserId || '';
    let username = data.body.userInfo.username || '';
    let idType = data.body.userInfo.idType || '';
    let idNo = data.body.userInfo.idNo || '';
    let idName = data.body.userInfo.idName || '';
    let sex = data.body.userInfo.sex || '';
    let birthday = data.body.userInfo.birthday || '';
    let address = data.body.userInfo.address || '';
    let mobile = data.body.userInfo.mobile || '';
    let mobile2 = data.body.userInfo.mobile2 || '';
    let phone = data.body.userInfo.phone || '';
    let email = data.body.userInfo.email || '';
    let forbiddenStatus = data.body.userInfo.forbiddenStatus || '';
    let status = data.body.userInfo.status || '';
    let passwd = data.body.userInfo.passwd || '';
    let type = data.body.userInfo.type || '';
    let departmentId = data.body.userInfo.departmentId || '';
    let memo = data.body.userInfo.memo || '';
    let sql = '';
    if(data.body.flag == 1){
        sql = "INSERT INTO `userinfo` (`userId`, `username`, `idType`, `idNo`, `idName`, `sex`, `birthday`, `address`, `mobile`, `mobile2`, `phone`, `email`, `forbiddenStatus`, `status`, `passwd`, `type`, `departmentId`, `memo`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ('"+userUserId+"', '"+username+"', '"+idType+"', '"+idNo+"', '"+idName+"', '"+sex+"', '"+birthday+"', '"+address+"', '"+mobile+"', '"+mobile2+"', '"+phone+"', '"+email+"', '"+forbiddenStatus+"', '"+status+"',  MD5('"+passwd+"'), '"+type+"', '"+departmentId+"', '"+memo+"', '"+userId+"', '"+userId+"', SYSDATE(), SYSDATE()) ";
    }else{
        sql = " update userinfo set username='"+username+"',idType='"+idType+"',idNo='"+idNo+"',idName='"+idName+"',sex='"+sex+"',birthday='"+birthday+"',address='"+address+"',mobile='"+mobile+"',mobile2='"+mobile2+"',phone='"+phone+"',email='"+email+"',forbiddenStatus='"+forbiddenStatus+"',status='"+status+"',type='"+type+"',departmentId='"+departmentId+"',memo='"+memo+"' where userId = '"+userUserId+"'  and rcd_end_time = DATE('9999-12-31 00:00:00') ";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getUserListFromDb=async function(conditions, from, length){
    let str_sql = 'SELECT u.forbiddenStatus forbiddenStatusCname, u.status statusCname, u.sex sexCname ,u.type typeCname ,d.departmentName ,u.* FROM userInfo u LEFT JOIN department d on u.departmentId=d.departmentId and u.rcd_end_time=d.rcd_end_time  where 1=1 ';

    if(conditions.userIdCon){
        str_sql += "AND u.userId = '"+conditions.userIdCon+"' ";
    }
    if(conditions.userNameCon){
        str_sql += "AND u.userName like '%"+conditions.userNameCon+"%' ";
    }
    if(conditions.departmentId){
        str_sql += "AND d.departmentId = '"+conditions.departmentId+"' ";
    }
    if(conditions.departmentName){
        str_sql += "AND d.departmentName like '%"+conditions.departmentName+"%' ";
    }
     str_sql += " AND u.rcd_end_time =date('9999-12-31') order by u.rcd_crt_time desc limit ?, ? ";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getUserCountDb=async function(conditions){
    let str_sql = "SELECT count(*) count FROM userInfo u LEFT JOIN department d on u.departmentId=d.departmentId and u.rcd_end_time=d.rcd_end_time  where 1=1 ";

    if(conditions.userIdCon){
        str_sql += "AND u.userId = '"+conditions.userIdCon+"' ";
    }
    if(conditions.userNameCon){
        str_sql += "AND u.userName like '%"+conditions.userNameCon+"%' ";
    }
    if(conditions.departmentId){
        str_sql += "AND d.departmentId = '"+conditions.departmentId+"' ";
    }
    if(conditions.departmentName){
        str_sql += "AND d.departmentName like '%"+conditions.departmentName+"%' ";
    }
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.deleteUserFromDb=async function(userUserId,userId){

    let sql = "UPDATE userInfo SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE userId = '"+userUserId+"' AND  rcd_end_time =date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.deleteUserRoleFromDb=async function(userUserId,userId){

    let sql = "UPDATE userrole SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE userId = '"+userUserId+"' AND  rcd_end_time =date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.deleteUserProductFromDb=async function(userUserId,userId){

    let sql = "UPDATE userproducts SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE userId = '"+userUserId+"' AND  rcd_end_time =date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.getCodeListByCodeTypefromDb=async function(codeCode, codetype){
    let sql = "select codetype, codecode, codeCname from code where 1=1 ";
    if(codeCode){
        sql += " AND codeCode ='" + codeCode + "' ";
    }
    sql += " and codetype = '" + codetype + "' AND rcd_end_time = '9999-12-31 00:00:00' ";
    let rows=await this.querySql(sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getUserRoleCountDb=async function(userUserId,roleName){
    let str_sql = "SELECT count(*) count FROM userrole ur, userinfo u,roleinfo r ,systems s where ur.userId=u.userId and ur.roleId=r.roleId AND r.systemId = s.systemId and ur.rcd_end_time=u.rcd_end_time and ur.rcd_end_time=r.rcd_end_time ";
    if(userUserId){
        str_sql += " AND ur.userId = '"+userUserId+"' ";
    }
    if(roleName){
        str_sql += " AND r.roleName like '%"+roleName+"%' ";
    }
    str_sql += " and ur.rcd_end_time=DATE('9999-12-31 00:00:00') and s.rcd_end_time = DATE('9999-12-31 00:00:00') ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getUserRolesFromDb=async function(userUserId,roleName,from,length){
    let str_sql = "SELECT r.roleName,r.systemId,s.systemName,u.username,ur.* FROM userrole ur, userinfo u,roleinfo r, systems s where ur.userId=u.userId and ur.roleId=r.roleId AND r.systemId = s.systemId and ur.rcd_end_time=u.rcd_end_time and ur.rcd_end_time=r.rcd_end_time ";
    if(userUserId){
        str_sql += " AND ur.userId ='"+userUserId+"' ";
    }
    if(roleName){
        str_sql += " AND R.roleName like '%"+roleName+"%' ";
    }
    str_sql += " and ur.rcd_end_time=DATE('9999-12-31 00:00:00')  and s.rcd_end_time = DATE('9999-12-31 00:00:00') order by ur.rcd_crt_time desc  limit ? , ?";

    let sqlFormat =  mysql.format(str_sql,[from,length]);

    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.addUserRoleInfoFromDb =async function(userId,userUserId, roleId){
    let nowDate = util.getNowTime();
    let sql = " INSERT INTO `userrole` (`userId`, `roleId`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ('"+userUserId+"', '"+roleId+"', '"+userId+"','"+userId+"', '"+nowDate+"', '"+nowDate+"') ";
    let rows=await this.querySql(sql);

    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getdepartmentGroupCountFromDb=async function(upDepartmentId){
    let sql = "select count(*) count from department where  upDepartmentId = '"+upDepartmentId+"' ";
    let rows=await this.querySql(sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getdepartmentGroupFromDb=async function(upDepartmentId){
    let sql = "select * from department where  upDepartmentId = '"+upDepartmentId+"' ";
    let rows=await this.querySql(sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getdepartmentCountFromDb=async function(departmentName){
    let str_sql = "SELECT count(*) count FROM department d  LEFT JOIN  department t on  d.upDepartmentId=t.departmentId and d.rcd_end_time=t.rcd_end_time where 1=1 ";
    if(departmentName){
        str_sql += " AND d.departmentName like '%"+departmentName+"%' ";
    }
    str_sql += " AND d.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getdepartmentListFromDb=async function(departmentName,from,length ){
    let str_sql = "SELECT t.departmentName upDepartmentName,d.* FROM department d  LEFT JOIN  department t on  d.upDepartmentId=t.departmentId and d.rcd_end_time=t.rcd_end_time where 1=1 ";
    if(departmentName){
        str_sql += " AND d.departmentName like '%"+departmentName+"%' ";
    }
    str_sql += " AND d.rcd_end_time =date('9999-12-31') order by d.rcd_crt_time desc limit ?, ? ";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.queryDepartmentInfoFromDb =async function(departmentId){
    let strSql = "SELECT * from department where departmentId = '"+departmentId+"'  AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatDepartmentInfoFromDb=async function(data){
    let userId = data.body.userId ;
    let departmentId = data.body.departmentInfo.departmentId || '';
    let departmentName = data.body.departmentInfo.departmentName || '';
    let upDepartmentId = data.body.departmentInfo.upDepartmentId || '';
    let memo = data.body.departmentInfo.memo || '';
    let sql = '';
    if(data.body.flag == 1){
        sql = "INSERT INTO `department` (`departmentName`, `upDepartmentId`, `memo`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ( '"+departmentName+"', '"+upDepartmentId+"', '"+memo+"', '"+userId+"', '"+userId+"', SYSDATE(), SYSDATE())";
    }else{
        sql = " update department set departmentName='"+departmentName+"',memo='"+memo+"' where departmentId = '"+departmentId+"'  and rcd_end_time =date('9999-12-31') ";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        let sql_query = " SELECT * FROM department t WHERE t.departmentName='"+departmentName+"' AND t.rcd_end_time=date('9999-12-31') ";
        let  ret=await this.querySql(sql_query);
        return ret;
    }else{
        return null;
    }
};
//查询部门下是否有人员信息
exports.queryDepartmentFromDb=async function(departmentId){
    let sql = "select count(d.departmentId) count from department  d,userinfo u where u.departmentId=d.departmentId and u.rcd_end_time=d.rcd_end_time and u.`forbiddenStatus`=0 and d.departmentId = '"+departmentId+"' and d.rcd_end_time=date('9999-12-31') ";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.deleteDepartmentFromDb=async function(departmentId,userId){
    let sql = " update department set  rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE departmentId = '"+departmentId+"' and rcd_end_time=date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.getInterfaceCountDb=async function(conditions){
    let str_sql = "SELECT count(*) count FROM interface f , systems s where f.providerSystemId=s.systemId and f.rcd_end_time=s.rcd_end_time ";
    if(conditions.systemId){
        str_sql += " AND s.systemId = '"+conditions.systemId+"' ";
    }
    if(conditions.systemName){
        str_sql += " AND s.systemName like '%"+conditions.systemName+"%' ";
    }
    if(conditions.name){
        str_sql += " AND f.name like '%"+conditions.name+"%' ";
    }
    if(conditions.cname){
        str_sql += " AND f.cname like '%"+conditions.cname+"%' ";
    }
    if(conditions.status){
        str_sql += " AND f.status = '"+conditions.status+"' ";
    }
    str_sql += " AND f.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getInterfaceListFromDb=async function(conditions, from, length){
    let str_sql = "SELECT f.*,s.systemName FROM interface f , systems s where f.providerSystemId=s.systemId and f.rcd_end_time=s.rcd_end_time ";
    if(conditions.systemId){
        str_sql += " AND s.systemId = '"+conditions.systemId+"' ";
    }
    if(conditions.systemName){
        str_sql += " AND s.systemName like '%"+conditions.systemName+"%' ";
    }
    if(conditions.name){
        str_sql += " AND f.name like '%"+conditions.name+"%' ";
    }
    if(conditions.cname){
        str_sql += " AND f.cname like '%"+conditions.cname+"%' ";
    }
    if(conditions.status){
        str_sql += " AND f.status = '"+conditions.status+"' ";
    }
    str_sql += " and f.rcd_end_time =date('9999-12-31') order by f.rcd_crt_time desc limit ?, ?";

    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//查询接口是否被某系统使用
exports.queryInterfacesystemFromDb=async function(interfaceId){
    let sql = "select count(s.interfaceId) count from interfacesystem  s,interface f where s.interfaceId=f.interfaceId and s.rcd_end_time=f.rcd_end_time and f.`status`=1 and f.interfaceId = '"+interfaceId+"' and f.rcd_end_time=date('9999-12-31') ";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.deleteInterfacesystemFromDb=async function(interfaceId,userId){
    let sql_middle = " update interfacesystem set  rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE interfaceId = '"+interfaceId+"' and rcd_end_time=date('9999-12-31')";
    let sql = " update interface set  rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE interfaceId = '"+interfaceId+"' and rcd_end_time=date('9999-12-31')";
    try{
        let rows_middle=await this.querySql(sql_middle);
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.isExitInterfaceInfoFromDb =async function(providerSystemId,name){
    let sql = "SELECT * from interface where providerSystemId = '"+providerSystemId+"' and name = '"+name+"' AND rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//当前系统下的接口数
exports.getSystemInterfaceCountDb=async function(conditions){
    let str_sql = "select count(*) count from interfacesystem a left join interface i on a.interfaceId=i.interfaceId and a.rcd_end_time=i.rcd_end_time left join systems s on i.providerSystemId=s.systemId and i.rcd_end_time=s.rcd_end_time where 1=1 ";
    if(conditions.systemId){
        str_sql += " and a.systemId='"+conditions.systemId+"' ";
    }
    if(conditions.providerSystemId){
        str_sql += " and i.providerSystemId='"+conditions.providerSystemId+"' ";
    }
    if(conditions.providerSystemName){
        str_sql += " AND s.systemName like '%"+conditions.providerSystemName+"%' ";
    }
    if(conditions.name){
        str_sql += " AND i.name like '%"+conditions.name+"%' ";
    }
    if(conditions.cname){
        str_sql += " AND i.cname like '%"+conditions.cname+"%' ";
    }
    if(conditions.status){
        str_sql += " AND i.status = '"+conditions.status+"' ";
    }
    str_sql += " AND a.rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
//当前系统提供的接口 在其他系统使用情况
exports.getSystemInterfaceBySystemIdCountDb=async function(providerSystemId, conditions){
    let str_sql = "SELECT count(*) count FROM interfacesystem a left JOIN systems s on a.systemId=s.systemId and a.rcd_end_time=s.rcd_end_time LEFT JOIN interface i on a.interfaceId=i.interfaceId and a.rcd_end_time=i.rcd_end_time WHERE a.interfaceId in (select interfaceId from interface where providerSystemId = '"+providerSystemId+"') ";
    if(conditions.systemId){
        str_sql += " and a.systemId='"+conditions.systemId+"' ";
    }
    if(conditions.interfaceId){
        str_sql += " AND a.interfaceId = '"+conditions.interfaceId+"' ";
    }
    str_sql += " AND a.rcd_end_time = DATE('9999-12-31') ";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
//当前系统提供的接口 在其他系统使用情况
exports.getSystemInterfaceBySystemIdFromDb=async function(providerSystemId, conditions, from, length){
    let str_sql = "SELECT a.*,s.systemName,i.name,i.cname FROM interfacesystem a left JOIN systems s on a.systemId=s.systemId and a.rcd_end_time=s.rcd_end_time LEFT JOIN interface i on a.interfaceId=i.interfaceId and a.rcd_end_time=i.rcd_end_time WHERE a.interfaceId in (select interfaceId from interface where providerSystemId = '"+providerSystemId+"' )  ";
    if(conditions.systemId){
        str_sql += " and a.systemId='"+conditions.systemId+"' ";
    }
    if(conditions.interfaceId){
        str_sql += " AND a.interfaceId = '"+conditions.interfaceId+"' ";
    }
    str_sql += " AND a.rcd_end_time = DATE('9999-12-31') limit ?, ? ";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//当前系统下可访问的接口列表
exports.getSystemInterfaceListFromDb=async function(conditions, from, length){
    let str_sql = "select a.*,i.name,i.cname,i.status,i.url,i.providerSystemId,s.systemName providerSystemName  from interfacesystem a left join interface i on a.interfaceId=i.interfaceId and a.rcd_end_time=i.rcd_end_time left join systems s on i.providerSystemId=s.systemId and i.rcd_end_time=s.rcd_end_time where 1=1";
    if(conditions.systemId){
        str_sql += " and a.systemId='"+conditions.systemId+"' ";
    }
    if(conditions.providerSystemId){
        str_sql += " and i.providerSystemId='"+conditions.providerSystemId+"' ";
    }
    if(conditions.providerSystemName){
        str_sql += " AND s.systemName like '%"+conditions.providerSystemName+"%' ";
    }
    if(conditions.name){
        str_sql += " AND i.name like '%"+conditions.name+"%' ";
    }
    if(conditions.cname){
        str_sql += " AND i.cname like '%"+conditions.cname+"%' ";
    }
    if(conditions.status){
        str_sql += " AND i.status = '"+conditions.status+"' ";
    }
    str_sql += " AND a.rcd_end_time =date('9999-12-31')  limit ?, ?";

    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//给选定系统添加可访问接口信息
exports.addSystemInterfaceInfoFromDb =async function(data, interfaceId, userId){
    let systemId = data.body.systemId ;
    let isCrypt = data.body.isCrypt ;
    let cryptType = data.body.cryptType ;
    let cryptKey = data.body.cryptKey ;
    let isCompress = data.body.isCompress ;
    let mode = data.body.mode ;
    let sessionCheck = data.body.sessionCheck ;
    let extend1 = data.body.extend1 ;
    let sql = " INSERT INTO `interfacesystem` (`interfaceId`, `systemId`, `isCrypt`, `cryptType`, `cryptKey`, `isCompress`, `mode`, `sessionCheck`, `extend1`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ('"+interfaceId+"', '"+systemId+"', '"+isCrypt+"', '"+cryptType+"', '"+cryptKey+"', '"+isCompress+"', '"+mode+"', '"+sessionCheck+"', '"+extend1+"', '"+userId+"', '"+userId+"', SYSDATE(), SYSDATE()) ";

    let rows=await this.querySql(sql);

    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.updateSystemInterfaceInfoFromDb =async function(data, interfaceId, userId){
    let systemId = data.body.systemId ;
    let isCrypt = data.body.isCrypt ;
    let cryptType = data.body.cryptType ;
    let cryptKey = data.body.cryptKey ;
    let isCompress = data.body.isCompress ;
    let mode = data.body.mode ;
    let sessionCheck = data.body.sessionCheck ;
    let extend1 = data.body.extend1 ;
    let sql = " update `interfacesystem` set  `isCrypt`='"+isCrypt+"', `cryptType`='"+cryptType+"', `cryptKey`='"+cryptKey+"', `isCompress`='"+isCompress+"', `mode`='"+mode+"', `sessionCheck`='"+sessionCheck+"', `extend1`='"+extend1+"',  `rcd_mod_user`='"+userId+"', `rcd_mod_time`=sysdate() where `interfaceId` ='"+interfaceId+"' and `systemId` ='"+systemId+"' and rcd_end_time =date('9999-12-31')";

    let rows=await this.querySql(sql);

    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.deleteSystemInterfaceFromDb=async function(systemId, interfaceId, userId){
    let sql = " update interfacesystem set  rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE systemId = '"+systemId+"' and interfaceId='"+interfaceId+"' and rcd_end_time=date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.addOrUpdateInterfaceInfoFromDb=async function(data){
    let userId = data.body.userId ;
    let interfaceId = data.body.interfaceInfo.interfaceId || '';
    let name = data.body.interfaceInfo.name || '';
    let cname = data.body.interfaceInfo.cname || '';
    let status = data.body.interfaceInfo.status || 1;
    let url = data.body.interfaceInfo.url || '';
    let providerSystemId = data.body.interfaceInfo.providerSystemId || '';
    let description = data.body.interfaceInfo.description || '';
    let devUrl = data.body.interfaceInfo.devUrl || '';
    let testUrl = data.body.interfaceInfo.testUrl || '';
    let proUrl = data.body.interfaceInfo.proUrl || '';
    if(devUrl || proUrl || proIp){
        let envIp = {"test":"","dev":"","production":""};
        envIp.dev = devUrl;
        envIp.test = testUrl;
        envIp.production = proUrl;
        url = JSON.stringify(envIp);
    }
    let sql = '';
    let nowDate = util.getNowTime();
    if('1' == data.body.flag){
        sql = "INSERT INTO `interface` ( `name`, `cname`, `status`, `url`, `providerSystemId`, `description`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ( '"+name+"', '"+cname+"', '"+status+"', '"+url+"', '"+providerSystemId+"', '"+description+"', '"+userId+"', '"+userId+"', '"+nowDate+"', '"+nowDate+"')";
    }else{
        sql = "update interface set name='"+name+"',cname='"+cname+"',status='"+status+"',url='"+url+"',providerSystemId='"+providerSystemId+"',description='"+description+"',rcd_mod_user='"+userId+"',rcd_mod_time='"+nowDate+"' where interfaceId = '"+interfaceId+"' AND rcd_end_time =date('9999-12-31')";
        //接口禁用删除系统可访问接口信息 interfaceSystem
        if('0' == status){
            let sql_Middle =  " update interfaceSystem set rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE interfaceId = '"+interfaceId+"' and rcd_end_time=date('9999-12-31') ";
            let rows_Middle=await this.querySql(sql_Middle);
        }
    }

    let rows=await this.querySql(sql);
    if(rows!=null){
        let sql = "SELECT * from interface where providerSystemId = '"+providerSystemId+"' and name = '"+name+"' AND rcd_end_time =date('9999-12-31') ";
        let ret=await this.querySql(sql);
        return ret;
    }else{
        return null;
    }
};
exports.getCodeTypeInfoCountDb=async function(conditions){
    let str_sql = "SELECT count(*) count FROM codetype where 1=1 ";
    if(conditions.typeCode){
        str_sql += " AND typeCode = '"+conditions.typeCode+"' ";
    }
    if(conditions.typeCname){
        str_sql += " AND typeCname like '%"+conditions.typeCname+"%' ";
    }

    str_sql += " AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getCodeTypeInfoListFromDb=async function(conditions, from, length){
    let str_sql = "SELECT * FROM codetype where 1=1 ";
    if(conditions.typeCode){
        str_sql += " AND typeCode = '"+conditions.typeCode+"' ";
    }
    if(conditions.typeCname){
        str_sql += " AND typeCname like '%"+conditions.typeCname+"%' ";
    }

    str_sql += " AND rcd_end_time =date('9999-12-31') order by rcd_crt_time desc limit ?, ?";

    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};

exports.queryCodeTypeInfoFromDb =async function(typeCode){
    let strSql = "SELECT * from codeType where typeCode = '"+typeCode+"'  AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatcodeTypeInfoFromDb=async function(data){
    let userId = data.body.userId ;
    let typeId = data.body.codeTypeInfo.typeId || '';
    let typeCode = data.body.codeTypeInfo.typeCode || '';
    let typeEname = data.body.codeTypeInfo.typeEname || '';
    let typeCname = data.body.codeTypeInfo.typeCname || '';
    let meno = data.body.codeTypeInfo.meno || '';
    let sql = '';
    if(data.body.flag == 1){
        sql = "INSERT INTO `codetype` (`typeCode`, `typeCname`, `typeEname`, `meno`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ( '"+typeCode+"', '"+typeCname+"', '"+typeEname+"', '"+meno+"', '"+userId+"', '"+userId+"', sysdate(), sysdate() ) ";
    }else{
        sql = " update codetype set typeCname='"+typeCname+"',typeEname='"+typeEname+"',meno='"+meno+"' where typeCode = '"+typeCode+"'  and rcd_end_time =date('9999-12-31') ";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        let sql = "SELECT * from codetype where typeCode = '"+typeCode+"' AND rcd_end_time =date('9999-12-31') ";
        let ret=await this.querySql(sql);
        return ret;
    }else{
        return null;
    }
};
exports.queryChangeCodeCountFromDb=async function(code,codetype){
    let sql = "select * from changecode where codetype='"+codetype+"' and code = '"+code+"' ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.queryCodeInfoFromDb =async function(codeCode, codetype){
    let strSql = "SELECT * from code where codeCode = '"+codeCode+"' and codetype = '"+codetype+"' AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatCodeInfoFromDb=async function(data){
    let userId = data.body.userId ;
    let codeCode = data.body.codeInfo.codeCode || '';
    let codeEname = data.body.codeInfo.codeEname || '';
    let codeCname = data.body.codeInfo.codeCname || '';
    let codetype = data.body.codeInfo.codetype || '';
    let upCodeCode = data.body.codeInfo.upCodeCode || '';
    let meno = data.body.codeInfo.meno || '';
    let sql = '';
    if(data.body.flag == 1){
        sql = "INSERT INTO `code` (`codeCode`, `codeEname`, `codeCname`, `codetype`,  `upCodeCode`, `meno`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ('"+codeCode+"', '"+codeEname+"', '"+codeCname+"', '"+codetype+"', '"+upCodeCode+"', '"+meno+"', '"+userId+"', '"+userId+"', SYSDATE(), SYSDATE())";
    }else{
        sql = " update code set codeEname='"+codeEname+"',codeCname='"+codeCname+"',codetype='"+codetype+"',upCodeCode='"+upCodeCode+"',meno='"+meno+"' where codeCode = '"+codeCode+"'  and codetype = '"+codetype+"' and rcd_end_time =date('9999-12-31') ";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getCodeInfoCountDb=async function(conditions){
    let str_sql = "SELECT count(*)  FROM code c ,codetype t where c.codetype=t.typeCode and c.rcd_end_time=t.rcd_end_time ";
    if(conditions.codeType){
        str_sql += " AND c.codeType = '"+conditions.codeType+"' ";
    }
    if(conditions.codeTypeCname){
        str_sql += " AND t.typeCname like '%"+conditions.codeTypeCname+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getCodeInfoListFromDb=async function(conditions, from, length){
    let str_sql = "SELECT c.*,t.typeCname codeTypeName FROM code c ,codetype t where c.codetype=t.typeCode and c.rcd_end_time=t.rcd_end_time ";
    if(conditions.codeType){
        str_sql += " AND c.codetype = '"+conditions.codeType+"' ";
    }
    if(conditions.codeTypeCname){
        str_sql += " AND t.typeCname like '%"+conditions.codeTypeCname+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by codecode   limit ? ,?";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//查询是否有转码信息
exports.isExitchangeCodeInfoFromDb =async function(conditions){
    let strSql = "SELECT * from changeCode where code = '"+conditions.codecode+"' and codetype = '"+conditions.codetype+"' and channelId = '"+conditions.channelID+"' and channelCode = '"+conditions.channelCode+"' AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.deleteCodeInfoFromDb=async function(codecode,codetype,userId){
    let sql = "UPDATE code SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE codecode = '"+codecode+"'  and codetype = '"+codetype+"' AND  rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.deleteChangeCodeInfoFromDb=async function(codecode,codetype,userId,channelID,channelCode){
    let str_sql = "UPDATE changecode SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE code = '"+codecode+"'  and codetype = '"+codetype+"' ";
    if(channelID){
        str_sql += " AND channelID = '"+channelID+"' ";
    }
    if(channelCode){
        str_sql += " AND channelCode = '"+channelCode+"' ";
    }
    str_sql += " AND  rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getChangeCodeInfoCountDb=async function(conditions){
    // let str_sql = "select count(*) count from code c LEFT JOIN codetype t on c.codetype=t.typeCode and c.rcd_end_time=t.rcd_end_time  left join changecode b on t.typeCode=b.codeType and c.codeCode=b.`code` and t.rcd_end_time=b.rcd_end_time where 1=1 ";
    let str_sql = "select count(*) count from code c LEFT JOIN codetype t on c.codetype=t.typeCode and c.rcd_end_time=t.rcd_end_time  left join (select * from changecode d where 1=1 ";
    if(conditions.channelID){
        str_sql += " AND d.channelID = '"+conditions.channelID+"' ";
    }
    str_sql += " and d.rcd_end_time = date('9999-12-31') ) b on t.typeCode=b.codeType and c.codeCode=b.`code` and t.rcd_end_time=b.rcd_end_time where 1=1 ";
    if(conditions.codetype){
        str_sql += " AND c.codetype = '"+conditions.codetype+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getChangeCodeInfoListFromDb=async function(conditions, from, length){
    let str_sql = "select c.*,b.channelID channelId,b.channelCode from code c LEFT JOIN codetype t on c.codetype=t.typeCode and c.rcd_end_time=t.rcd_end_time  left join (select * from changecode d where 1=1 ";
    if(conditions.channelID){
        str_sql += " AND d.channelID = '"+conditions.channelID+"' ";
    }
    str_sql += " and d.rcd_end_time = date('9999-12-31') ) b on t.typeCode=b.codeType and c.codeCode=b.`code` and t.rcd_end_time=b.rcd_end_time where 1=1 ";
    if(conditions.codetype){
        str_sql += " AND c.codetype = '"+conditions.codetype+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by rcd_crt_time  desc limit ? ,?";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.addOrUpdatChangeCodeInfoFromDb=async function(data){
    let userId = data.body.userId ;
    let codecode =  data.body.conditions.codecode || '';
    let channelID =  data.body.conditions.channelID || '';
    let codetype =  data.body.conditions.codetype || '';
    let channelCode =  data.body.conditions.channelCode || '';
    let newChannelCode =  data.body.conditions.newChannelCode || '';
    let meno = data.body.conditions.meno || '';
    let sql = '';
    if(data.body.flag == 1){
        sql = "INSERT INTO `changecode` (`codeType`, `code`, `channelID`, `channelCode`,  `meno`,  `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES ('"+codetype+"', '"+codecode+"', '"+channelID+"', '"+channelCode+"', '"+meno+"', '"+userId+"', '"+userId+"', SYSDATE(), SYSDATE())";
    }else{
        sql = " update changecode set channelCode='"+newChannelCode+"',meno='"+meno+"' where code = '"+codecode+"'  and codetype = '"+codetype+"' and channelID = '"+channelID+"' and channelCode = '"+channelCode+"'  and rcd_end_time =date('9999-12-31') ";
    }
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

//查询码表类型是否在使用
exports.queryCodeTypeUsedFromDb=async function(typeCode){
    let sql = "SELECT count(c.codecode) count FROM `CODE` c, codetype t WHERE c.codetype = t.typeCode AND c.rcd_end_time = t.rcd_end_time and t.typeCode = '"+typeCode+"' AND c.rcd_end_time = date('9999-12-31') ";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
exports.deleteCodeTypeFromDb=async function(typeCode, userId){
    let sql = " update codetype set  rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE typeCode = '"+typeCode+"' and rcd_end_time=date('9999-12-31')";
    try{
        let rows=await this.querySql(sql);
        if(rows!=null){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
    }
};
/**
 * 渠道@产品信息新增、修改方法
 * @param flag 1新增，2修改
 * @param datas 数据集合
 * @returns {Promise<null>}
 */
exports.addOrUpdateChannelsFromDb=async function(flag,datas){
    let sql = "";
    let rsql = "";
    let rows = null;
    if('1' == flag){
        sql = "call proc_channels_add(?,?,?,?,?,?,?)";
        rows=await this.query(sql,datas);
    } else if('2' == flag) {
        sql = "UPDATE channels SET rcd_mod_time = now(),rcd_mod_user = ?,channelName =?,upChannelId=?,level=?,channelType=?," +
            "memo=? where channelId = ? and rcd_end_time =date('9999-12-31')";
        rsql = mysql.format(sql,datas);
        rows=await this.querySql(rsql);

    }
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
/**
 *渠道@产品信息查询方法
 * @param conditions
 * @returns {Promise<null>}
 */
exports.getChannelsListByConditionsfromDb=async function(conditions){
    let sql = "select channelId,channelName,upChannelId,level,channelType,memo,rcd_crt_user,rcd_mod_user,rcd_crt_time," +
        "rcd_mod_time,rcd_end_time from channels where 1=1 AND rcd_end_time =date('9999-12-31') " + conditions;
    // let rsql = mysql.format(sql,datas);

    let rows=await this.querySql(sql);

    return rows;
};

/**
 *子渠道手机号是否已存在
 * @param conditions
 * @returns {Promise<null>}
 */
exports.checkDutyPhoneExsit = async function(conditions){
    let sql = "select dutyMobel from channelsextrainfo  ch WHERE  ch.dutyMobel = '"+conditions+"'  and rcd_end_time =date('9999-12-31')";
    let rows = await  this.querySql(sql);
    return rows;

}


/**
 * 渠道@产品信息删除方法
 * @param keys
 * @param userId
 * @returns {Promise<*>}
 */
exports.deleteChannelsFromDb=async function(keys,userId){
    let rows = '';
    let rsql = "";
    let sql = "";
    for(let i=0; i < keys.length; i++){
        sql = "UPDATE channels SET rcd_end_time = now(),rcd_mod_user=? WHERE channelId = ? AND rcd_end_time =date('9999-12-31')";
        rsql = mysql.format(sql,[userId,keys[i]]);
        rows=await this.querySql(rsql);
    }
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

exports.getChannelsCountDb=async function(channelId,channelName,channelType,level){
    let str_sql = "SELECT count(1) count FROM channels where 1=1 ";
    if(channelId){
        str_sql += " AND channelId = '"+channelId+"' ";
    }
    if(channelName){
        str_sql += " AND channelName like '%"+channelName+"%' ";
    }
    if(channelType){
        str_sql += " AND channelType = '"+channelType+"' ";
    }
    if(level){
        str_sql += " AND level = '"+level+"' ";
    }
    str_sql += " AND rcd_end_time =date('9999-12-31')";

    // let sql = "SELECT count(*) count FROM roleinfo where rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getChannelsAndUsersCount=async function(params){
    let str_sql = "select count(1) count from (SELECT " +
        "  COUNT(1) count " +
        "  FROM" +
        "  channels c " +
        "  INNER JOIN channelsuser u ON c.channelId = u.channelId AND u.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product_channel_config pc ON pc.saleChannelId=c.channelId AND pc.rcd_end_time = DATE('9999-12-31') " +
        "   LEFT JOIN product p ON p.productId=pc.productId AND p.rcd_end_time = DATE('9999-12-31')" +
        "   LEFT JOIN product_group pg ON pg.productGroupId=p.productGroupId AND pg.rcd_end_time = DATE('9999-12-31')" +
        " WHERE 1 = 1  ";
    if(params[0]){
        str_sql += " AND (u.channeluserId LIKE '%"+params[0]+"%' OR c.channelName LIKE '%"+params[0]+"%') ";
    }
    let arr=params[1];
    if(arr&&arr.length>0){
        str_sql += " AND pg.productGroupId IN( ";
        for(let i=0;i<arr.length;i++){
            if(i==arr.length-1){
                str_sql +=" '"+arr[i]+"'";
            }else{
                str_sql +=" '"+arr[i]+"',";
            }
        }
        str_sql+=" )";
    }
    if(params[2]){
        str_sql += " AND u.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND u.accountStatus='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND c.channelType='"+params[4]+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') group by pg.productGroupId,pg.groupName,c.channelId ORDER BY u.rcd_crt_time DESC)t ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getPolicyListCount=async function(params){
    let str_sql = "SELECT COUNT(1) count FROM datawarehouse.carpolicyinfo c LEFT JOIN basemanage.channels ch ON c.channelId=ch.channelId  WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND (c.licenseNo LIKE '%"+params[0]+"%' OR c.carOwner LIKE '%"+params[0]+"%' OR c.policyNo LIKE '%"+params[0]+"%') ";
    }
    if(params[1]){
        str_sql += " AND c.autoInsurer='"+params[1]+"' ";
    }
    if(params[2]){
        str_sql += " AND c.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND c.rcd_crt_time>='"+params[3]+" 00:00:00' ";
    }
    if(params[4]){
        str_sql += " AND c.rcd_crt_time<='"+params[4]+" 23:59:59' ";
    }
    if(params[5]){
        str_sql +=" AND (ch.channelId='"+params[5]+"' OR ch.upChannelId='"+params[5]+"')";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')  ORDER BY c.rcd_crt_time DESC ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getPolicyList=async function(params){
    let str_sql = "SELECT  c.orderNo,c.policyNo,(SELECT cu.channeluserId FROM basemanage.channelsuser cu WHERE cu.channelId=c.channelId limit 1) AS channeluserId,ch.channelName,c.autoInsurer,c.regionID,c.licenseNo,c.carOwner,format(c.premium,2) as premium,c.rcd_crt_time AS underwrittendate, " +
        "(SELECT o.codeCname FROM basemanage.code o WHERE o.codetype ='autoInsurer' AND o.codeCode=c.autoInsurer) AS autoInsurerName, " +
        "(SELECT r.fullName FROM basemanage.region r WHERE  r.regionId=c.regionID) AS regionIDName "
        + " FROM datawarehouse.carpolicyinfo c LEFT JOIN basemanage.channels ch ON c.channelId=ch.channelId  WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND (c.licenseNo LIKE '%"+params[0]+"%' OR c.carOwner LIKE '%"+params[0]+"%' OR c.policyNo LIKE '%"+params[0]+"%') ";
    }
    if(params[1]){
        str_sql += " AND c.autoInsurer='"+params[1]+"' ";
    }
    if(params[2]){
        str_sql += " AND c.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND c.rcd_crt_time>='"+params[3]+" 00:00:00' ";
    }
    if(params[4]){
        str_sql += " AND c.rcd_crt_time<='"+params[4]+" 23:59:59' ";
    }
    if(params[5]){
        str_sql +=" AND (ch.channelId='"+params[5]+"' OR ch.upChannelId='"+params[5]+"')";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')  ORDER BY c.rcd_crt_time DESC  limit ? , ? ";

    let sqlFormat =  mysql.format(str_sql,[params[6],params[7]]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getChannelreportCount=async function(params){
    let str_sql = "SELECT COUNT(1) count FROM (SELECT 1 FROM datawarehouse.ywchannelreport yw LEFT JOIN basemanage.channels c ON yw.channelId=c.channelId LEFT JOIN basemanage.channelsuser cu ON cu.channelId=yw.channelId  WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND (cu.channeluserId LIKE '%"+params[0]+"%' OR c.channelName LIKE '%"+params[0]+"%') ";
    }
    if(params[1]){
        str_sql += " AND yw.autoInsurer='"+params[1]+"' ";
    }
    if(params[2]){
        str_sql += " AND yw.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND yw.dataDate>='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND yw.dataDate<='"+params[4]+"' ";
    }
    if(params[5]){
        str_sql += " AND yw.channelId IN (SELECT c.channelId FROM basemanage.channels c WHERE c.channelId='"+params[5]+"' OR c.upChannelId='"+params[5]+"') ";
    }

    str_sql += " AND yw.rcd_end_time =date('9999-12-31') group by c.channelId,c.channelName ORDER BY yw.rcd_crt_time DESC)t ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getChannelreportTotal=async function(params){
    let str_sql = "SELECT SUM(countPolicyJQ) AS totalCountPolicyJQ,format(SUM(sumPremiumJQ),2) AS totalSumPremiumJQ,SUM(countPolicySY) AS totalCountPolicySY,format(SUM(sumPremiumSY),2) AS totalSumPremiumSY,SUM(countPolicyJQ+countPolicySY) AS totalCount,format(SUM(sumPremiumJQ+sumPremiumSY),2) AS totalMoney "
        + " FROM datawarehouse.ywchannelreport yw LEFT JOIN basemanage.channels c ON yw.channelId=c.channelId LEFT JOIN basemanage.channelsuser cu ON cu.channelId=yw.channelId  WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND (cu.channeluserId LIKE '%"+params[0]+"%' OR c.channelName LIKE '%"+params[0]+"%') ";
    }
    if(params[1]){
        str_sql += " AND yw.autoInsurer='"+params[1]+"' ";
    }
    if(params[2]){
        str_sql += " AND yw.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND yw.dataDate>='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND yw.dataDate<='"+params[4]+"' ";
    }
    if(params[5]){
        str_sql += " AND yw.channelId IN (SELECT c.channelId FROM basemanage.channels c WHERE c.channelId='"+params[5]+"' OR c.upChannelId='"+params[5]+"') ";
    }

    str_sql += " AND yw.rcd_end_time =date('9999-12-31')  ORDER BY yw.rcd_crt_time DESC ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getChannelreportList=async function(params){
    let str_sql = "SELECT cu.channeluserId,c.channelName,sum(yw.countPolicyJQ) as countPolicyJQ,format(sum(yw.sumPremiumJQ),2) as sumPremiumJQ,sum(yw.countPolicySY) as countPolicySY,format(sum(yw.sumPremiumSY),2) as sumPremiumSY,sum(yw.countPolicy) as countPolicy,format(sum(yw.sumPremium),2) as sumPremium  "
        + " FROM datawarehouse.ywchannelreport yw LEFT JOIN basemanage.channels c ON yw.channelId=c.channelId LEFT JOIN basemanage.channelsuser cu ON cu.channelId=yw.channelId  WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND (cu.channeluserId LIKE '%"+params[0]+"%' OR c.channelName LIKE '%"+params[0]+"%') ";
    }
    if(params[1]){
        str_sql += " AND yw.autoInsurer='"+params[1]+"' ";
    }
    if(params[2]){
        str_sql += " AND yw.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND yw.dataDate>='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND yw.dataDate<='"+params[4]+"' ";
    }
    if(params[5]){
        str_sql += " AND yw.channelId IN (SELECT c.channelId FROM basemanage.channels c WHERE c.channelId='"+params[5]+"' OR c.upChannelId='"+params[5]+"') ";
    }

    str_sql += " AND yw.rcd_end_time =date('9999-12-31') group by c.channelId,c.channelName ORDER BY yw.rcd_crt_time DESC limit ? , ? ";
    let sqlFormat =  mysql.format(str_sql,[params[6],params[7]]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};


exports.getChannelsCountByLevelCount=async function(params){
    let str_sql = "select count(1) count from (SELECT " +
        "  COUNT(1) count " +
        "  FROM" +
        "  channels c " +
        "  INNER JOIN channelsuser u ON c.channelId = u.channelId AND u.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product_channel_config pc ON pc.saleChannelId=c.channelId AND pc.rcd_end_time = DATE('9999-12-31') " +
        "   LEFT JOIN product p ON p.productId=pc.productId AND p.rcd_end_time = DATE('9999-12-31')" +
        "   LEFT JOIN product_group pg ON pg.productGroupId=p.productGroupId AND pg.rcd_end_time = DATE('9999-12-31')" +
        " WHERE 1 = 1  ";
    if(params[0]){
        str_sql += " AND (u.channeluserId like '%"+params[0]+"%' or c.channelName like '%"+params[0]+"%' ) ";
    }
    let arr=params[1];
    if(arr&&arr.length>0){
        str_sql += " AND pg.productGroupId IN( ";
        for(let i=0;i<arr.length;i++){
            if(i==arr.length-1){
                str_sql +=" '"+arr[i]+"'";
            }else{
                str_sql +=" '"+arr[i]+"',";
            }
        }
        str_sql+=" )";
    }
    if(params[2]){
        str_sql += " AND u.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND u.accountStatus='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND c.channelType='"+params[4]+"' ";
    }
    if(params[5]){
        str_sql += " AND (c.channelId ='"+params[5]+"' or c.upChannelId='"+params[5]+"') ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') group by pg.productGroupId,pg.groupName,c.channelId ORDER BY u.rcd_crt_time DESC )t";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getPartnerListCount=async function(params){
    let str_sql = "SELECT COUNT(1) count FROM applycooperationinfo WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND ( username LIKE '%"+params[0]+"%' OR company LIKE '%"+params[0]+"%' OR mobile LIKE '%"+params[0]+"%') ";
    }
    str_sql += " AND rcd_end_time =date('9999-12-31')  ORDER BY  results,rcd_crt_time desc ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.checkChannelsMobileDb=async function(params){
    let str_sql = "SELECT COUNT(1) count FROM channelsuser WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND mobile= '"+params[0]+"' ";
    }
    str_sql += "AND accountStatus=1 AND rcd_end_time =date('9999-12-31') ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.checkChannelsMobileDb2=async function(params){
    let str_sql = "SELECT COUNT(1) count FROM channelsuser WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND mobile= '"+params[0]+"' ";
    }
    str_sql += "AND rcd_end_time =date('9999-12-31') ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.checkChannelsMobileDb1=async function(params){
    let str_sql = "SELECT channeluserId FROM channelsuser WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND mobile= '"+params[0]+"' ";
    }
    str_sql += "AND rcd_end_time =date('9999-12-31') ";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].channeluserId;
        return ret;
    }else{
        return null;
    }
};

exports.getChannelsUserByMobile=async function(param){
    let str_sql = "SELECT channeluserId,channelId,regionID,linkman,mobile,accountStatus,isDuty FROM channelsuser WHERE mobile=? AND accountStatus=1 AND rcd_end_time =date('9999-12-31')";

    let sqlFormat =  mysql.format(str_sql,[param]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};


exports.getPartnerListFromDb=async function(params){
    let str_sql = "SELECT seq,rcd_crt_time,username,company,mobile,email,content,results,(SELECT cc.codeCname FROM CODE cc  WHERE cc.codetype = 'results'  AND cc.codecode = results) AS resultsName  FROM applycooperationinfo WHERE 1=1 ";
    if(params[0]){
        str_sql += " AND ( username LIKE '%"+params[0]+"%' OR company LIKE '%"+params[0]+"%' OR mobile LIKE '%"+params[0]+"%') ";
    }
    str_sql += " AND rcd_end_time =date('9999-12-31')  ORDER BY  results,rcd_crt_time desc limit ? , ? ";

    let sqlFormat =  mysql.format(str_sql,[params[1],params[2]]);

    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getChannelsListFromDb=async function(channelId,channelName,channelType,level,from,length){
    let str_sql = "select c.channelId,c.channelName,c.upChannelId," +
        "(select t.channelName from channels t where t.channelId = c.upChannelId) as upChannelName,c.channelType" +
        ",(select cc.codeCname from code cc where cc.codetype = 'channelType' and cc.codecode = c.channelType ) as channelTypeName" +
        ",c.level,c.memo,c.rcd_crt_user,c.rcd_mod_user,c.rcd_crt_time,c.rcd_mod_time from channels c  where 1=1 ";
    if(channelId){
        str_sql += " AND c.channelId = '"+channelId+"' ";
    }
    if(channelName){
        str_sql += " AND c.channelName like '%"+channelName+"%' ";
    }
    if(channelType){
        str_sql += " AND c.channelType = '"+channelType+"' ";
    }
    if(level){
        str_sql += " AND c.level = '"+level+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by channelId  limit ? , ? ";

    let sqlFormat =  mysql.format(str_sql,[from,length]);

    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getChannelsAndUsersListDb=async function(params){
    let str_sql = "SELECT " +
        "   c.channelId,c.channelName,c.upChannelId,(SELECT t.channelName FROM channels t WHERE t.channelId = c.upChannelId) AS upChannelName,c.level," +
        "        (SELECT cc.codeCname FROM CODE cc WHERE cc.codetype = 'channelType' AND cc.codecode = c.channelType ) AS channelTypeName," +
        "        (SELECT r.fullName FROM region r WHERE r.regionId=u.regionID) AS businessAreaName," +
        "        c.channelType,u.regionID,u.rcd_crt_time,u.linkman,u.mobile,u.accountStatus,u.channeluserId, " +
        "        (SELECT cc.codeCname FROM CODE cc WHERE cc.codetype = 'accountStatus' AND cc.codecode = u.accountStatus ) AS accountStatusName," +
        "        pg.groupName," +
        "        pg.productGroupId," +
        "        c.memo" +
        " FROM" +
        "  channels c " +
        "  INNER JOIN channelsuser u ON c.channelId = u.channelId AND u.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product_channel_config pc ON pc.saleChannelId=c.channelId AND pc.rcd_end_time = DATE('9999-12-31') " +
        "   LEFT JOIN product p ON p.productId=pc.productId AND p.rcd_end_time = DATE('9999-12-31')" +
        "   LEFT JOIN product_group pg ON pg.productGroupId=p.productGroupId AND pg.rcd_end_time = DATE('9999-12-31')" +
        " WHERE 1 = 1  ";
    if(params[0]){
        str_sql += " AND (u.channeluserId LIKE '%"+params[0]+"%' OR c.channelName LIKE '%"+params[0]+"%') ";
    }
    let arr=params[1];
    if(arr&&arr.length>0){
        str_sql += " AND pg.productGroupId IN( ";
        for(let i=0;i<arr.length;i++){
            if(i==arr.length-1){
                str_sql +=" '"+arr[i]+"'";
            }else{
                str_sql +=" '"+arr[i]+"',";
            }
        }
        str_sql+=" )";
    }
    if(params[2]){
        str_sql += " AND u.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND u.accountStatus='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND c.channelType='"+params[4]+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') group by pg.productGroupId,pg.groupName,c.channelId ORDER BY u.rcd_crt_time DESC  limit ? , ? ";

    let sqlFormat =  mysql.format(str_sql,[params[5],params[6]]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getChannelsByLevelDb=async function(params){
    let str_sql = "SELECT " +
        "c.channelId,c.channelName,c.upChannelId,(SELECT t.channelName FROM channels t WHERE t.channelId = c.upChannelId) AS upChannelName,c.level," +
        "        (SELECT cc.codeCname FROM CODE cc WHERE cc.codetype = 'channelType' AND cc.codecode = c.channelType ) AS channelTypeName," +
        "        (SELECT r.fullName FROM region r WHERE r.regionId=u.regionID) AS businessAreaName," +
        "        c.channelType,u.regionID,u.rcd_crt_time,u.linkman,u.mobile,u.accountStatus,u.channeluserId," +
        "        (SELECT cc.codeCname FROM CODE cc WHERE cc.codetype = 'accountStatus' AND cc.codecode = u.accountStatus ) AS accountStatusName," +
        "        pg.productGroupId," +
        "        pg.groupName," +
        "        c.memo" +
        " FROM" +
        "  channels c " +
        "  INNER JOIN channelsuser u " +
        "    ON c.channelId = u.channelId " +
        "    AND u.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product_channel_config pc " +
        "    ON pc.saleChannelId = c.channelId " +
        "    AND pc.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product p " +
        "    ON p.productId = pc.productId " +
        "    AND p.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product_group pg " +
        "    ON pg.productGroupId = p.productGroupId " +
        "    AND pg.rcd_end_time = DATE('9999-12-31') " +
        " WHERE 1 = 1  ";
    if(params[0]){
        str_sql += " AND (u.channeluserId like '%"+params[0]+"%' or c.channelName like '%"+params[0]+"%' ) ";
    }
    let arr=params[1];
    if(arr&&arr.length>0){
        str_sql += " AND pg.productGroupId IN( ";
        for(let i=0;i<arr.length;i++){
            if(i==arr.length-1){
                str_sql +=" '"+arr[i]+"'";
            }else{
                str_sql +=" '"+arr[i]+"',";
            }
        }
        str_sql+=" )";
    }
    if(params[2]){
        str_sql += " AND u.regionID='"+params[2]+"' ";
    }
    if(params[3]){
        str_sql += " AND u.accountStatus='"+params[3]+"' ";
    }
    if(params[4]){
        str_sql += " AND c.channelType='"+params[4]+"' ";
    }
    if(params[5]){
        str_sql += " AND (c.channelId ='"+params[5]+"' or c.upChannelId='"+params[5]+"') ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') group by pg.productGroupId,pg.groupName,c.channelId ORDER BY u.rcd_crt_time DESC  limit ? , ? ";

    let sqlFormat =  mysql.format(str_sql,[params[6],params[7]]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

//产品组管理
exports.getProductGroupInfoCountDb=async function(conditions){
    let str_sql = "select count(1) count from product_group c where 1=1 ";
    if(conditions.groupName){
        str_sql += " AND c.groupName like '%"+conditions.groupName+"%' ";
    }
    if(conditions.rcd_crt_user){
        str_sql += " AND c.rcd_crt_user like '%"+conditions.rcd_crt_user+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getProductGroupInfoListFromDb=async function(conditions, from, length){
    let str_sql = "select * from product_group c where 1=1 ";
    if(conditions.groupName){
        str_sql += " AND c.groupName like '%"+conditions.groupName+"%' ";
    }
    if(conditions.rcd_crt_user){
        str_sql += " AND c.rcd_crt_user like '%"+conditions.rcd_crt_user+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by rcd_crt_time  desc limit ? ,?";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.deleteProductGroupInfoFromDb=async function(productGroupId,userId){
    let sql = "UPDATE product_group SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE productGroupId = '"+productGroupId+"' AND  rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//查询产品组是否存在信息
exports.isExitProductGroupInfoFromDb =async function(groupName,productGroupId){
    let strSql = "SELECT * from product_group where 1=1 ";
    if(productGroupId){
        strSql += " And productGroupId = '"+productGroupId+"'";
    }else if(groupName){
        strSql += " And groupName = '"+groupName+"'";
    }
    strSql += " AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatProductGroupInfoFromDb=async function(flag,params){
    let sql = '';
    if('1' == flag){
        sql = "INSERT INTO `product_group` (`groupName`, `memo`, `extend1`, `extend2`,  `extend3`,  `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES (?, ?, ?, ?, ?, ?, ?, SYSDATE(), SYSDATE() )";
    }else if("2" == flag){
        sql = " update product_group set rcd_mod_time = now(),rcd_mod_user = ?, groupName=?,memo=?,extend1=?,extend2=?,extend3=? where  productGroupId = ?  and rcd_end_time =date('9999-12-31') ";
    }
    let rows=await global.dao.query(sql,params);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//产品管理
exports.getProductInfoCountDb=async function(conditions,userId){
    let str_sql = "select count(1) count from product c left join channels c1 on c.insurer=c1.channelId and c.rcd_end_time=c1.rcd_end_time left join product_group  g on c.productGroupId = g.productGroupId and c.rcd_end_time=g.rcd_end_time LEFT JOIN userproducts up on c.productId=up.productId and c.rcd_end_time = up.rcd_end_time where 1=1 ";
    if(conditions.productId){
        str_sql += " AND c.productId = '"+conditions.productId+"' ";
    }
    if(conditions.productStatus){
        str_sql += " AND c.productStatus = '"+conditions.productStatus+"' ";
    }
    if(conditions.productName){
        str_sql += " AND c.productName like '%"+conditions.productName+"%' ";
    }
    if(conditions.productType){
        str_sql += " AND c.productType = '"+conditions.productType+"' ";
    }
    if(conditions.productGroupId){
        str_sql += " AND c.productGroupId = '"+conditions.productGroupId+"' ";
    }
    if(conditions.insurer){
        str_sql += " AND c.insurer = '"+conditions.insurer+"' ";
    }
    if(conditions.insurerProductCode){
        str_sql += " AND c.insurerProductCode = '"+conditions.insurerProductCode+"' ";
    }
    if(conditions.rcd_crt_user){
        str_sql += " AND c.rcd_crt_user like '%"+conditions.rcd_crt_user+"%' ";
    }
    if('admin' != userId){
        str_sql += " AND up.userId='"+userId+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
//查询产品和产品组
exports.getProductAndGroupInfoCountDb=async function(productGroupId){
    let str_sql = "select count(1) count from product c ,product_group p where c.productGroupId=p.productGroupId and c.rcd_mod_time=p.rcd_end_time ";
    if(productGroupId){
        str_sql += " AND p.productGroupId = '"+productGroupId+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.isExitProductInfoFromDb =async function(productId){
    let strSql = "SELECT * from product where productId = '"+productId+"'  AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatProductInfoFromDb=async function(flag,params){
    let sql = "";
    if("1" == flag){
        sql = "INSERT INTO `product` (`productId`, `productName`, `productType`, `productGroupId`,  `premium`,  `amount`, " +
            "`subjectType`, `productStatus`, `clauses`,`description`,`detail`,`orgCode`,`period`,`classCode`,`riskCode`," +
            "`insurer`,`insurerProductCode`,`ext1`,`ext2`,`ext3`,`rcd_crt_user`,`rcd_mod_user`,`rcd_crt_time`,`rcd_mod_time`" +
            ")  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,SYSDATE(),SYSDATE())";
    } else if("2" == flag) {
        sql = "UPDATE product SET rcd_mod_time = now(),rcd_mod_user = ?,productName =?,productType=?,productGroupId=?,premium=?," +
            "amount=?,subjectType=?,productStatus=?,clauses=?,description=?,detail=?,orgCode=?,period=?,classCode=?,riskCode=?" +
            ",insurer=?,insurerProductCode=?,ext1=?,ext2=?,ext3=? where productId = ?  and rcd_end_time =date('9999-12-31')";
    }
    let rows=await global.dao.query(sql,params);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getProductInfoListFromDb=async function(conditions,userId, from, length){
    let str_sql = "select distinct c.*,c1.channelName insurerName,c.productType productTypeName,g.groupName from product c left join channels c1 on c.insurer=c1.channelId and c.rcd_end_time=c1.rcd_end_time left join product_group  g on c.productGroupId = g.productGroupId and c.rcd_end_time=g.rcd_end_time LEFT JOIN userproducts up on c.productId=up.productId and c.rcd_end_time = up.rcd_end_time where 1=1 ";
    if(conditions.productId){
        str_sql += " AND c.productId = '"+conditions.productId+"' ";
    }
    if(conditions.productStatus){
        str_sql += " AND c.productStatus = '"+conditions.productStatus+"' ";
    }
    if(conditions.productName){
        str_sql += " AND c.productName like '%"+conditions.productName+"%' ";
    }
    if(conditions.productType){
        str_sql += " AND c.productType = '"+conditions.productType+"' ";
    }
    if(conditions.productGroupId){
        str_sql += " AND c.productGroupId = '"+conditions.productGroupId+"' ";
    }
    if(conditions.insurer){
        str_sql += " AND c.insurer = '"+conditions.insurer+"' ";
    }
    if(conditions.insurerProductCode){
        str_sql += " AND c.insurerProductCode = '"+conditions.insurerProductCode+"' ";
    }
    if(conditions.rcd_crt_user){
        str_sql += " AND c.rcd_crt_user like '%"+conditions.rcd_crt_user+"%' ";
    }
    if('admin' != userId){
        str_sql += " AND up.userId='"+userId+"' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by c.rcd_crt_time  desc limit ? ,?";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.deleteProductInfoFromDb=async function(productId,userId){
    let sql = "UPDATE product SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE productId = '"+productId+"' AND  rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//用户产品关系管理
exports.addOrUpdatUserProductInfoFromDb=async function(param){

    let sql = "INSERT INTO `userproducts` (`userId`, `productId`, `rcd_crt_user`,`rcd_mod_user`,`rcd_crt_time`,`rcd_mod_time`)  VALUES(?,?,?,?,SYSDATE(),SYSDATE() )";

    let rows=await global.dao.query(sql,param);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getUserProductInfoCountDb=async function(conditions){
    let str_sql = "select count(1) count from userproducts c left join product p on c.productId=p.productId and c.rcd_end_time=p.rcd_end_time left join userinfo u on c.userId=u.userId and u.rcd_end_time=c.rcd_end_time where 1=1 ";
    if(conditions.userId){
        str_sql += " AND c.userId = '"+conditions.userId+"' ";
    }
    if(conditions.productId){
        str_sql += " AND p.productId = '"+conditions.productId+"' ";
    }
    if(conditions.productName){
        str_sql += " AND p.productName like '%"+conditions.productName+"%' ";
    }
    if(conditions.userName){
        str_sql += " AND u.userName like '%"+conditions.userName+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getUserProductInfoListFromDb=async function(conditions, from, length){
    let str_sql = "select c.*,c.relation relationName,p.productName,u.userName from userproducts c left join product p on c.productId=p.productId and c.rcd_end_time=p.rcd_end_time left join userinfo u on c.userId=u.userId and u.rcd_end_time=c.rcd_end_time where 1=1 ";
    if(conditions.userId){
        str_sql += " AND c.userId = '"+conditions.userId+"' ";
    }
    if(conditions.productId){
        str_sql += " AND p.productId = '"+conditions.productId+"' ";
    }
    if(conditions.productName){
        str_sql += " AND p.productName like '%"+conditions.productName+"%' ";
    }
    if(conditions.userName){
        str_sql += " AND u.userName like '%"+conditions.userName+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by rcd_crt_time  desc limit ? ,?";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.isExitUserProductInfoFromDb =async function(userUserId,productId,relation){
    let strSql = "SELECT * from userproducts where userId = '"+userUserId+"' and productId = '"+productId+"' and relation = '"+relation+"' AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addOrUpdatUserProductsInfoFromDb=async function(flag,params){
    let sql = '';
    if('1' == flag){
        sql = "INSERT INTO `userProducts` (`userId`, `productId`, `relation`, `rcd_crt_user`, `rcd_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES (?, ?, ?, ?,?, SYSDATE(), SYSDATE() )";
    }else if("2" == flag){
        sql = " update userProducts set productId=?,relation=?,rcd_mod_user=?,rcd_mod_time=now() where userId= ? and productId =? and relation=? and rcd_end_time = date('9999-12-31') ";
    }
    //let rows=await global.dao.query(sql,params);
    sql = mysql.format(sql,params);
    let rows=await global.dao.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.deleteUserProductInfoFromDb=async function(userUserId,productId,relation,userId){
    let sql = "UPDATE userproducts SET rcd_end_time = now(),rcd_mod_user='"+userId+"' WHERE userID = '"+userUserId+"' and productId ='"+productId+"' and relation = '"+relation+"' AND  rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//产品费用管理
exports.addChannelProductFromDb=async function(params){
    let sql = `INSERT INTO product_channel_config (
                productchannelId,
                saleChannelId,
                productId,
                effective_time,
                expiration_time,
                memo,
                extend1,
                extend2,
                extend3,
                rcd_crt_user,
                rcd_mod_user,
                rcd_crt_time,
                rcd_mod_time
            )
            VALUES
                (?,?,?,?,?,?,?,?,?,?,?,SYSDATE(),SYSDATE() )`
    ;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(!commons.isEmptyObject(rows)){
        return rows;
    }else{
        return null;
    }
};
exports.addProductFeeFromDb=async function(params){
    let sql = `INSERT INTO product_fee_config (
                productchannelId,
                fromChannel,
                toChannel,
                feeType,
                platFee,
                rate,
                taxRate,
                memo,
                extend1,
                extend2,
                extend3,
                rcd_crt_user,
                rcd_mod_user,
                rcd_crt_time,
                rcd_mod_time
            )
            VALUES
                (
                    ?,?,?,?,?,?,?,?,?,?,?,?,?,SYSDATE(),SYSDATE()
                )`
    ;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(!commons.isEmptyObject(rows)){
        return rows;
    }else{
        return null;
    }
};
exports.updateProductFeeFromDb=async function(params,productFeeId){

    try{
        //逻辑删除
        let sql = `UPDATE product_fee_config
        SET rcd_end_time = now(),
        rcd_mod_user = '`+params[13]+`'
        WHERE
            productFeeId ='`+params[0]+`' and rcd_end_time = date('9999-12-31')` ;

        let rows=await global.dao.querySql(sql);
        //插入新增数据
       sql=`INSERT INTO product_fee_config(
        productFeeId,
        productchannelId,
        fromChannel,
        toChannel,
        feeType,
        platFee,
        rate,
        taxRate,
        memo,
        extend1,
        extend2,
        extend3,
        rcd_crt_user,
        rcd_mod_user,
        rcd_crt_time)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        let sqlformat =  mysql.format(sql,params);
        rows=await global.dao.querySql(sqlformat);

        if(!commons.isEmptyObject(rows)){
            return rows;
        }else{
            return null;
        }

    }catch (e){
        logger.error(e);
    }
};
exports.updateChannelProductFromDb=async function(params){
    try {
        //查询
        let sql = `SELECT
            *
            FROM
        product_channel_config t
        WHERE
        t.rcd_end_time = date('9999-12-31')
        AND t.productchannelId = '` + params[3] + `'`;

        let rows = await global.dao.querySql(sql);
        if (commons.isEmptyObject(rows) || rows.length == 0) {
            return null;
        }
        let data = rows[0];
        //插入数据
        let insertData = [data.productchannelId,
            data.saleChannelId,
            data.productId,
            params[1],
            params[2],
            data.memo,
            data.extend1,
            data.extend2,
            data.extend3,
            data.rcd_crt_user,
            data.rcd_crt_time,
            params[0]];
        //先逻辑删除，保留历史
        sql = `UPDATE product_channel_config
                SET rcd_end_time = now()
                WHERE
                    productchannelId = '` + params[3] + `'
                    AND rcd_end_time = date('9999-12-31')`;

        rows = await global.dao.querySql(sql);
        if (commons.isEmptyObject(rows)) {
            return null;
        }
        //插入新的
        sql = `INSERT INTO product_channel_config(
        productchannelId,
        saleChannelId,
        productId,
        effective_time,
        expiration_time,
        memo,
        extend1,
        extend2,
        extend3,
        rcd_crt_user,
        rcd_crt_time,
        rcd_mod_user)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        let sqlformat = mysql.format(sql, insertData);
        rows = await global.dao.querySql(sqlformat);
        if (commons.isEmptyObject(rows)) {
            return null;
        } else {
            return rows;
        }
    }catch (e){
        logger.error(e);
    }
};

exports.updateProductFeesFromDb=async function(params){
    let sql = `call proc_productfeeconfig_update(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        // `UPDATE product_fee_config SET rcd_mod_time = now(),rcd_mod_user = ?,fromChannel =?,toChannel=?,feeType=?,platFee=?,rate=?,taxRate=?,effective_time=?,expiration_time=?,memo=?,extend1=?,extend2=?,extend3=? where productFeeId = ?`;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.getProductFeeListByConditionsfromDb=async function(param){
    let sql = `SELECT
                *
            FROM
                product_fee_config t,
                product_channel_config t1
            WHERE
                t1.saleChannelId =?
            AND t1.productId =?
            AND t.fromChannel =?
            AND t.toChannel =?
            AND t.feeType =?
            AND t1.effective_time =?
            AND t1.expiration_time =?
            AND t1.rcd_end_time = date('9999-12-31')
            AND t.rcd_end_time = date('9999-12-31')
            AND t.productchannelId = t1.productchannelId`;
    let sqlformat =  mysql.format(sql,param);
    let rows=await global.dao.querySql(sqlformat);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//产品销售渠道是否存在
exports.isExistsChannelProductfromDb=async function(param){
    let sql = `SELECT
                    c.*
                FROM
                    product_channel_config c
                WHERE
                    c.saleChannelId =?
                AND c.productId =?
                AND c.effective_time =?
                AND c.expiration_time =?
                AND c.rcd_end_time=DATE('9999-12-31')`;
    let sqlformat =  mysql.format(sql,param);
    let rows=await global.dao.querySql(sqlformat);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//根据ID查询
exports.isExistsChannelProductByKeyfromDb=async function(param){
    let sql = `SELECT
            *
        FROM
            product_fee_config c
        WHERE
            c.productchannelId = ?
        AND c.rcd_end_time = DATE('9999-12-31') `;
    let sqlformat =  mysql.format(sql,param);
    let rows=await global.dao.querySql(sqlformat);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.isExitProductFeeByProductFeeIdfromDb=async function(productFeeId){
    let sql = "select * from product_fee_config where productFeeId = '"+productFeeId+"' AND rcd_end_time = date('9999-12-31')";
    let rows=await global.dao.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.ldeleteProductFeeFromDb=async function(param){
    let sql = `UPDATE product_fee_config
                SET rcd_end_time = now(),
                 rcd_mod_user =?
                WHERE
                    productFeeId = ?
                AND rcd_end_time = date('9999-12-31')`
    ;
    let sqlformat =  mysql.format(sql,param);
    let rows=await global.dao.querySql(sqlformat);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.ldeleteProductChannelFromDb=async function(param){
    let sql = `UPDATE product_channel_config
                SET rcd_end_time = now(),
                 rcd_mod_user =?
                WHERE
                    productchannelId = ?
                AND rcd_end_time = date('9999-12-31')`
    ;
    let sqlformat =  mysql.format(sql,param);
    let rows=await global.dao.querySql(sqlformat);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.getProductFeeCountDb=async function(conditions){
    let str_sql = "SELECT count(1) count  from product_fee_config p LEFT JOIN product a on p.productId = a.productId and p.rcd_end_time=a.rcd_end_time LEFT JOIN channels c1 on p.saleChannelId=c1.channelId and p.rcd_end_time=c1.rcd_end_time LEFT JOIN channels c2 on p.fromChannel=c2.channelId and p.rcd_end_time=c2.rcd_end_time LEFT JOIN channels c3 on p.toChannel=c3.channelId and p.rcd_end_time=c3.rcd_end_time where 1=1 ";
    if(conditions.saleChannelId){
        str_sql += " AND p.saleChannelId = '"+conditions.saleChannelId+"' ";
    }
    if(conditions.fromChannelId){
        str_sql += " AND p.fromChannel = '"+conditions.fromChannel+"' ";
    }
    if(conditions.toChannel){
        str_sql += " AND p.toChannel = '"+conditions.toChannel+"' ";
    }
    if(conditions.productId){
        str_sql += " AND a.productId = '"+conditions.productId+"' ";
    }
    if(conditions.productName){
        str_sql += " AND a.productName like '%"+conditions.productName+"%' ";
    }
    if(conditions.saleChannelName){
        str_sql += " AND c1.channelName like '%"+conditions.saleChannelName+"%' ";
    }
    if(conditions.fromChannelName){
        str_sql += " AND c2.channelName like '%"+conditions.fromChannelName+"%' ";
    }
    if(conditions.toChannelName){
        str_sql += " AND c3.channelName like '%"+conditions.toChannelName+"%' ";
    }
    if (conditions.expiration_time) {
        str_sql += ' AND p.expiration_time <= "' + conditions.expiration_time + ' 23:59:59"';
    }
    if (conditions.effective_time) {
        str_sql += ' AND p.effective_time >=  "' + conditions.effective_time + ' 00:00:00"';
    }
    str_sql += " AND p.rcd_end_time =date('9999-12-31')";

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getProductFeeListFromDb=async function(conditions){
    let str_sql = "SELECT p.*,p.feeType feeTypeName,a.productName,c1.channelName saleChannelName,c2.channelName fromChannelName,c3.channelName toChannelName  from product_fee_config p LEFT JOIN product a on p.productId = a.productId and p.rcd_end_time=a.rcd_end_time LEFT JOIN channels c1 on p.saleChannelId=c1.channelId and p.rcd_end_time=c1.rcd_end_time LEFT JOIN channels c2 on p.fromChannel=c2.channelId and p.rcd_end_time=c2.rcd_end_time LEFT JOIN channels c3 on p.toChannel=c3.channelId and p.rcd_end_time=c3.rcd_end_time where 1=1 ";
    if(conditions.saleChannelId){
        str_sql += " AND p.saleChannelId = '"+conditions.saleChannelId+"' ";
    }
    if(conditions.fromChannelId){
        str_sql += " AND p.fromChannel = '"+conditions.fromChannel+"' ";
    }
    if(conditions.toChannel){
        str_sql += " AND p.toChannel = '"+conditions.toChannel+"' ";
    }
    if(conditions.productId){
        str_sql += " AND a.productId = '"+conditions.productId+"' ";
    }
    if(conditions.productName){
        str_sql += " AND a.productName like '%"+conditions.productName+"%' ";
    }
    if(conditions.saleChannelName){
        str_sql += " AND c1.channelName like '%"+conditions.saleChannelName+"%' ";
    }
    if(conditions.fromChannelName){
        str_sql += " AND c2.channelName like '%"+conditions.fromChannelName+"%' ";
    }
    if(conditions.toChannelName){
        str_sql += " AND c3.channelName like '%"+conditions.toChannelName+"%' ";
    }
    if (conditions.expiration_time) {
        str_sql += ' AND p.expiration_time <= "' + conditions.expiration_time + ' 23:59:59"';
    }
    if (conditions.effective_time) {
        str_sql += ' AND p.effective_time >=  "' + conditions.effective_time + ' 00:00:00"';
    }
    str_sql += " AND p.rcd_end_time =date('9999-12-31') order by p.productId ";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getProductFeeGroupListFromDb=async function(productchannelId){
    let str_sql = `SELECT
                        t.*, c.codeCname feeTypeName,c1.channelName fromChannelName,c2.channelName toChannelName
                    FROM
                        product_fee_config t
                    LEFT JOIN channels c1 ON t.fromChannel = c1.channelId
                    AND t.rcd_end_time = c1.rcd_end_time
                    LEFT JOIN channels c2 ON t.toChannel = c2.channelId
                    AND t.rcd_end_time = c2.rcd_end_time
                    LEFT JOIN CODE c ON t.feeType = c.codeCode 
                    where t.rcd_end_time = DATE('9999-12-31')
                    AND c.codetype = 'productFeeType' AND t.productchannelId='${productchannelId}'`
    ;

    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//按照产品和销售渠道分组
exports.getProductFeeGroupFromDb=async function(conditions,userId,data){
    try {
        let str_sql = ``;//查询条数用的sql
        let str_sql2 =``;//查询具体列表信息用的qsl
        let where = '';
        let orderAndLimit = '';
        let start = 0;
        let to = 0;
        let ret = null;

        if ('admin' == userId) {
            //查询条数
            str_sql = `SELECT
               count(1) count
            FROM
                product_channel_config t,
              product p,
              channels c`;

            //查询具体列表
            str_sql2 = `SELECT
               t.*,
               p.productName,
               c.channelName saleChannelName
            FROM
                product_channel_config t,
              product p,
              channels c`;

            where = ` WHERE
                    t.productId = p.productId
                AND t.saleChannelId = c.channelId
                AND p.rcd_end_time = date('9999-12-31')
                AND t.rcd_end_time = date('9999-12-31')
                AND c.rcd_end_time = date('9999-12-31')`;
            if (conditions.saleChannelId) {
                where += " AND t.saleChannelId = '" + conditions.saleChannelId + "' ";
            }
            if (conditions.productId) {
                where += " AND t.productId = '" + conditions.productId + "' ";
            }
            if (conditions.effective_time) {
                where += " AND t.effective_time = '" + conditions.effective_time + "' ";
            }
            if (conditions.productName) {
                where += " AND t.expiration_time = '" + conditions.expiration_time + "' ";
            }
            if (conditions.productchannelId) {
                where += " AND t.productchannelId = '" + conditions.productchannelId + "' ";
            }
        } else {
            //查询调数
            str_sql = `SELECT
                count(distinct(t.productchannelId) ) as count
              FROM
                product_channel_config t,
                product p,
                channels c`;

            //查询具体列表
            str_sql2 = `SELECT
                t.*, p.productName,
                c.channelName saleChannelName
              FROM
                product_channel_config t,
                product p,
                channels c`;
            where = ` WHERE
                    t.productId = p.productId
                AND t.saleChannelId = c.channelId
                AND p.rcd_end_time = date('9999-12-31')
                AND t.rcd_end_time = date('9999-12-31')
                AND c.rcd_end_time = date('9999-12-31')
                AND EXISTS (SELECT 1
                    FROM
                        userproducts u
                    WHERE
                        u.userId = '` + userId + `'
                    AND u.productId = t.productId
                )`;

            if (conditions.saleChannelId) {
                where += " AND t.saleChannelId = '" + conditions.saleChannelId + "' ";
            }
            if (conditions.productId) {
                where += " AND t.productId = '" + conditions.productId + "' ";
            }
            if (conditions.effective_time) {
                where += " AND t.effective_time = '" + conditions.effective_time + "' ";
            }
            if (conditions.productName) {
                where += " AND t.expiration_time = '" + conditions.expiration_time + "' ";
            }
            if (conditions.productchannelId) {
                where += " AND t.productchannelId = '" + conditions.productchannelId + "' ";
            }
        }


        let rows = await this.querySql(str_sql + where);
        let count = rows[0].count;

        if (count>0) {

            data.body.conditions.totalPageCount = Math.ceil(count / data.body.conditions.pageSize);
            data.body.conditions.totalCount = count;

            start = ( data.body.conditions.currentPage - 1) * data.body.conditions.pageSize;
            to = data.body.conditions.pageSize;

            orderAndLimit = `GROUP BY t.productchannelId ORDER BY  t.productId, t.rcd_mod_time desc limit ?, ? `;


            let sqlFormat = mysql.format(str_sql2 + where + orderAndLimit, [start, to]);
            ret =await this.querySql(sqlFormat);
        }
        return ret;
    } catch (e) {
        logger(e);
    }
};
//-------------------分割线------------------后台OA管理-----------------分割线----------------------

/**
 * 项目 projects 管理
 * @param conditions
 * @returns {Promise.<*>}
 */
exports.getProjectCountFromDb=async function(conditions, userId){
    let currentTime = util.formatTime(conditions.currentTime);
    let str_sql = `select count(projectId) count from projects p where (projectLeader='${userId}' or PMId='${userId}') and  p.endDate >= date('${currentTime}')  `;
    if(conditions.projectId){
        str_sql += `and projectId = '${conditions.projectId}' `;
    }
    str_sql += `and p.rcd_end_time = date('9999-12-31')`;
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getProjectListFromDb=async function(conditions, userId, from,length ){
    let currentTime = util.formatTime(conditions.currentTime);
    let str_sql = `select * from projects p where (projectLeader='${userId}' or PMId='${userId}')  and p.endDate >= date('${currentTime}')  `;//,p.endDate desc
    if(conditions.projectId){
        str_sql += `and projectId = '${conditions.projectId}' `;
    }
    str_sql += `and p.rcd_end_time = date('9999-12-31') order by p.startDate desc limit ?, ?`;
     let sqlFormat =  mysql.format(str_sql, [from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.updateProjectFromDb=async function(params){
    let sql = `UPDATE projects set startDate=?,endDate=? where projectId=? and rcd_end_time =date('9999-12-31')`;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.updateProjectPMFromDb=async function(params){
    let sql = `UPDATE projects set PMId=?, rcd_mod_time = SYSDATE(),rcd_mod_user = ? where projectId=? and rcd_end_time =date('9999-12-31')`;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getProjectUserCountFromDb=async function(projectId){
    let str_sql = "select count(*) count from workAssignment w LEFT JOIN projects p on w.projectId=p.projectId and w.rcd_end_time=p.rcd_end_time LEFT JOIN userinfo u on w.userId=u.userId and w.rcd_end_time=u.rcd_end_time where w.projectId='"+projectId+"' ";
    str_sql += " AND w.rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getProjectUserListFromDb=async function(projectId){
    let str_sql = "select w.assignmentId,w.startDate,w.endDate,w.projectId,p.projectName,w.userId,u.username,w.jobId,w.jobId jobName from  workAssignment w LEFT JOIN projects p on w.projectId=p.projectId and w.rcd_end_time=p.rcd_end_time LEFT JOIN userinfo u on w.userId=u.userId and w.rcd_end_time=u.rcd_end_time where w.projectId='"+projectId+"' ";
    str_sql += " AND w.rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(str_sql);
    if(rows!=null){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.isExitProjectMemberFromDb=async function(params){
    let str_sql = "select * from workassignment w where w.projectId=? and w.jobId=? and w.userId=? and w.startDate=? and w.endDate=? and w.rcd_end_time=DATE('9999-12-31') ";
    let sqlFormat =  mysql.format(str_sql,params);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//项目人员删除之前判断是否有有效的报工记录
exports.isExitMemberWorkdiaryFromDb=async function(projectId, userId){
    let str_sql = `SELECT
                        count(*) count
                    FROM
                        workdiary d 
                    WHERE
                        d.workDiaryStatus = '3'
                    AND d.projectId=?
                    AND userId = ?
                    AND d.rcd_end_time = DATE('9999-12-31')`
    ;
    let sqlFormat =  mysql.format(str_sql,[projectId, userId]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
//项目人员删除
exports.deleteProjectMemberInfoFromDb=async function(assignmentId,userId){
    let sql = `update workassignment set rcd_mod_time=NOW(),rcd_mod_user='${userId}',rcd_end_time=NOW() where assignmentId='${assignmentId}' AND  rcd_end_time =date('9999-12-31')`;
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

exports.addOrUpdatProjectMemberFromDb=async function(flag,params){
    let sql;
    if('1' == flag){
        sql = `call proc_workassignment_add(?,?,?,?,?,?)`
    } else if('2' == flag) {
        sql = `update workassignment set jobId=?,startDate=?,endDate=? where assignmentId=? and rcd_end_time =date('9999-12-31')`;
    }
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.modifyProjectMembersFromDB=async function(params){
    let sql = `call proc_projectMembers_update(?,?,?,?,?,?,?)`
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
/**
 * maxTableId
 * @param param 入参：表名
 * @returns {Promise.<*>}
 */
exports.get_maxTableId = async function(tableName, columnName){
    let sql = `SELECT max(${columnName}) maxId FROM ${tableName} `;
    try{
        let maxId=await this.querySql(sql);
        if(commons.isEmptyString(maxId)){
            return maxId;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
        return null;
    }
};
/**
 * 项目 projects 已结束管理
 * @param conditions
 * @returns {Promise.<*>}
 */
exports.getProjectEndCountFromDb=async function(conditions, userId){
    let currentTime = util.formatTime(conditions.currentTime);
    let str_sql = `select count(projectId) count from projects p where (projectLeader='${userId}' or PMId='${userId}') and p.startDate < date('${currentTime}')`;
    if(conditions.projectId){
        str_sql += ` and projectId = '${conditions.projectId}' `;
    }
    str_sql += `  and p.rcd_end_time = date('9999-12-31') `;
    let rows=await this.querySql(str_sql);
    if(rows!=null){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getProjectEndListFromDb=async function(conditions, userId, from,length ){
    let currentTime = util.formatDate(conditions.currentTime);
    let str_sql = `select * from projects p where (projectLeader='${userId}' or PMId='${userId}') and p.endDate < date('${currentTime}') `;
    if(conditions.projectId){
        str_sql += ` and projectId = '${conditions.projectId}' `;
    }
    str_sql += ` and p.rcd_end_time = date('9999-12-31') order by p.endDate desc limit ?, ?`;
    let sqlFormat =  mysql.format(str_sql, [from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
//申请管理
exports.getVacationCountFromDb=async function(conditions, userId){
    let str_sql = `select count(*) count From vacationrequisition v LEFT JOIN userinfo u on v.userId = u.userId and v.rcd_end_time=u.rcd_end_time where u.userId ='${userId}' `;
    if(conditions.vacationId){
        str_sql += ` and v.vacationId ='${conditions.vacationId}'`
    }
    str_sql += `  and v.rcd_end_time = DATE('9999-12-31')`
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
exports.getVacationListFromDb=async function(conditions, userId, from,length ){
    let str_sql = `select v.*,v.vacationType vacationTypeName,v.requisitionStatus requisitionStatusName,u.userName From vacationrequisition v LEFT JOIN userinfo u on v.userId = u.userId and v.rcd_end_time=u.rcd_end_time where u.userId ='${userId}' `;
    if(conditions.vacationId){
        str_sql += ` and v.vacationId ='${conditions.vacationId}'`
    }
    str_sql += ` and v.rcd_end_time = DATE('9999-12-31') order by v.rcd_crt_time desc limit ?, ?`
    let sqlFormat =  mysql.format(str_sql, [from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getWorkDiaryEffective=async function( userId){
    let str_sql = `select d.workDiaryId,d.assignmentId,d.userId,d.workDate from workdiary d where d.userId = '${userId}' and d.workDiaryStatus<>2 and d.rcd_end_time =date('9999-12-31') ORDER BY  d.rcd_crt_time desc `;
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.getAssignmentEffictive=async function(currDate, userId){
    let str_sql = `SELECT
                    w.*, p.projectLeader,
                    p.PMId,
                    p.projectId
                FROM
                    workassignment w
                LEFT JOIN projects p ON w.projectId = p.projectId
                AND w.rcd_end_time = p.rcd_end_time
                WHERE
                    p.projectStatus = '1'
                AND w.userId = '${userId}'
                AND w.endDate > '${currDate}'
                AND w.rcd_end_time = DATE('9999-12-31')
                ORDER BY
                    w.startDate DESC `;
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};
exports.addORUpdateVacationFromDb=async function(flag,datas){
    let sql = "";
    let rsql = "";
    let rows = null;
    if('1' == flag){
        sql = "call proc_vacationRequisition_add(?,?,?,?,?,?,?,?,?)";
        rows=await this.query(sql,datas);
    } else if('2' == flag) {
        sql = "update vacationrequisition  set rcd_mod_user=?, rcd_mod_time=SYSDATE(),vacationType=?,vacationDays=? ,memo=? ,startDate=? ,endDate=? where vacationId=? and rcd_end_time =date('9999-12-31')";
        rsql = mysql.format(sql,datas);
        rows=await this.querySql(rsql);

    }
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.getUserInfoByOpenIdDb=async function(openId){
    let sql = `SELECT *  FROM userinfo where openId = '${openId}' and rcd_end_time =date('9999-12-31')`;

    let ret=await this.querySql(sql);
    if(ret==null){
        return null;
    }else{
        return ret;
    }
};
exports.getSystemUserListFromDb=async function(conditions){
    const sql = "SELECT u.*,d.departmentName,uj.jobId,j.jobCode,j.jobLevel,j.jobName,j.upJobId,j.isInCharge,j.isVirtual FROM userInfo u LEFT JOIN department d on u.departmentId=d.departmentId and u.rcd_end_time=d.rcd_end_time LEFT JOIN userjob uj on u.userId=uj.userId and u.rcd_end_time=uj.rcd_end_time LEFT JOIN jobs j on uj.jobId=j.jobId and uj.rcd_end_time=j.rcd_end_time  where u.forbiddenStatus=0 and  u.status='1' and u.type ='1' and u.userId not in ('admin') and u.rcd_end_time=DATE('9999-12-31') ORDER BY CONVERT(u.username USING gbk),CONVERT(d.departmentName USING gbk)";
    let ret=await this.querySql(sql);
    if(ret==null){
        return null;
    }else{
        return ret;
    }
};

exports.getWeekReportsFromDb = async function(params){
  let str_sql = `SELECT
                     d.*, p.projectName
                FROM
                    workassignment w,
                    workdiary d,
                    projects p
                WHERE
                    w.assignmentId = d.assignmentId
                AND w.projectId = p.projectId
                AND w.rcd_end_time = d.rcd_end_time
                AND w.rcd_end_time = p.rcd_end_time
                AND w.rcd_end_time = DATE('9999-12-31')
                AND d.userId =?
                AND d.workDate BETWEEN ? and ?`
  ;
  let sqlFormat =  mysql.format(str_sql,params);
  return await this.querySql(sqlFormat);
};

exports.getProjectsFromDb = async function (params) {
  let str_sql = `select *
                    from projects p, workassignment w
                    where(1=1) 
                    and p.projectId = w.projectId
                    and p.rcd_end_time = w.rcd_end_time 
                    and w.rcd_end_time = DATE('9999-12-31') 
                    and w.userId = ?
                    and w.endDate >= ?
                    and w.startDate < ?`
  ;
  let sqlFormat =  mysql.format(str_sql,params);
  return await this.querySql(sqlFormat);
};

exports.addWeekReportInTODb = async function (params) {
  var sql = 'call proc_workdairy_add(?,?,?,?,?,?,?,?)';
  let sqlFormat =  mysql.format(sql,params);
  return await this.query(sqlFormat);
};

//工时管理
exports.updateWorkDiaryFromDb=async function(params){
    let sql = `UPDATE workdiary set projectId=?,userId=?,workDate=?,timeInterval=?,workingDay=?,workDiaryType=?,workDiaryStatus=?,remark=? where workDiaryId=?  and rcd_end_time=DATE('9999-12-31')`;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
//工时审批通过
exports.updateWorkDiaryManageFromDb=async function(userId,keys){
    let rows = '';
    let rsql = "";
    let sql = "";
    for(let i=0; i < keys.length; i++){
        let sql = `UPDATE workdiary set workDiaryStatus='3',rcd_mod_time=NOW(),rcd_mod_user=? where workDiaryId=? and rcd_end_time=DATE('9999-12-31')`;
        rsql =  mysql.format(sql,[userId, keys[i]]);
        rows=await global.dao.querySql(rsql);
    }
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
exports.addWorkDiaryFromDb=async function(params){
    let sql = `call proc_workdairy_add(?,?,?,?,?,?,?,?,?,?)`;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.delWorkDiaryFromDb=async function(params){
    let sql = `update workdiary set rcd_mod_time = NOW(),rcd_mod_user=? ,rcd_end_time=NOW() where workDiaryId=? and rcd_end_time = date('9999-12-31')`;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
exports.queryWorkDiaryFromDb=async function(params){
    let sql = `call proc_getworkdairy_his(?,?,?) `;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.queryWorkDiaryPersonalFromDb=async function(params){
    let sql = `call proc_getworkDiary_week(?,?) `;
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);

    if(rows[0].length>0){
        return rows[0];
    }else{
        return null;
    }
};
exports.queryWorkDiaryManageFromDb=async function(params){
    let str_sql = `SELECT
                    t.*, t1.projectName,u.username,
                  c.week,
                  c.weekday
                FROM
                    workdiary t,
                    projects t1,
                  userinfo u,
                  calendar c
                WHERE
                (  t.workDiaryStatus = 1 
                OR  t.workDiaryStatus = 3 )
                AND t.projectId = t1.projectId
                AND t.rcd_end_time = date('9999-12-31')
                AND t1.rcd_end_time = date('9999-12-31')
                AND u.userId = t.userId
                AND c.date = t.workDate
                and t.approverId = '${params[0]}'
         `;

    if(params[1]){
        str_sql += ` AND t.projectId = '${params[1]}' `;
    }
    if(params[2]){ //开始时间
        str_sql += ` AND t.workDate >= '${params[2]}'  AND t.workDate <= '${params[3]}' `;
    }else{
        str_sql += ` AND t.workDate < '${params[3]}' `;
    }
    str_sql += ` ORDER BY u.username, t1.projectId,c.week desc ,c.weekday asc`;

    let rows=await global.dao.querySql(str_sql);

    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getWeekReportsApproveFromDb = async function (params) {
  let str_sql = "select d.*, p.projectName, u.username\n" +
    "from workassignment w, workdiary d, projects p, userinfo u\n" +
    "where (1=1)\n" +
    "      and w.assignmentId = d.assignmentId\n" +
    "      and u.userId = w.userId\n" +
    "      and w.projectId = p.projectId\n" +
    "      and p.PMId = ?\n" +
    "      and d.workDate between ? and ?\n" +
    "      and d.rcd_end_time = DATE('9999-12-31')\n" +
    "      and p.projectId = ?"
  let sqlFormat =  mysql.format(str_sql,params);
  return await this.querySql(sqlFormat);
};

//查询审批表
exports.getApproveList = async function (params) {
    try {
        let str_sql = ` SELECT
         t.vacationId,
            t.userId,
            t3.username,
          t.startDate,
            t.endDate,
            t.vacationDays,
            t.requisitionStatus,
            c2.codeCname as requisitionStatusName ,
            t.vacationType,
            c.codeCname as vacationTypeName,
            t.memo,
            t.rcd_mod_time,
            t2.processID
        FROM
            vacationrequisition t,
            userinfo t3,
          flowprocess t2,
            CODE c,
            CODE c2
        WHERE
            t.userId = t3.userId
        AND t.userId = t3.userId
        AND c.codetype = 'vacationType'
        AND c.codeCode = t.vacationType
        AND c2.codetype = 'requisitionStatus'
        AND c2.codeCode = t.requisitionStatus
        AND t2.eventId = t.vacationId
        AND t2.approverId = ?
        AND t.userId = t2.userId
        AND t2.processStatus ='1'`;

        let sqlFormat = mysql.format(str_sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};

//同意或者驳回
exports.updateVacationrequisitionStatus = async function (params) {
    try{
        let sql = `UPDATE vacationrequisition t
        SET t.requisitionStatus = ?,
        t.rcd_mod_user = ?
        WHERE
        t.vacationId = ?`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};

//修改审批记录
exports.updateFlowprocessStatus = async function (params) {
    try{
        let sql = `UPDATE flowprocess t
            SET t.processStatus = ?, rcd_mod_user = ?
            WHERE
                t.processID = ?;`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};


//获取下一个节点
exports.getNextNodes = async function (params) {
    try{
        let sql = `SELECT t.* FROM flownodes t ,(
            SELECT t2.serialNo,t2.flowId FROM flowprocess t ,
            flownodes t2
            where t.nodeId = t2.nodeId
            AND t2.nodeStatus =1
            AND t.processID = ?) A
            WHERE t.flowId = A.flowId
            AND A.serialNo<t.serialNo
            LIMIT 1;`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};

//获取部门主管 入参是 这个人的id userID
exports.getManager = async function (params) {
    try{
        let sql = `SELECT
            t1.userId
        FROM
            userjob t1,
            jobs t,
            department d,
            userinfo u
        WHERE
            t1.jobId = t.jobId
        AND t.isInCharge = 1
        AND t.departmentId = d.departmentId
        AND u.departmentId = d.departmentId
        AND u.userId = ?
        LIMIT 1`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};


//获取人事主管 入参是 这个人的id userID
exports.getHRManager = async function (params) {
    try{
        let sql = `SELECT
            u.userId
        FROM
            jobs t,
            userjob t1,
            userinfo u
        WHERE
            t.jobCode = 'rszg'
        AND t.departmentId = u.departmentId
        AND t1.jobId = t.jobId
        LIMIT 1;`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};

//查询一个流程
exports.getProcessByID = async function (processID) {
    try{
        let sql = `SELECT
            *
        FROM
            flowprocess t
        WHERE
            t.processID =?`;
        let sqlFormat = mysql.format(sql, processID);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};

//查询一个流程 by vacationId
exports.getProcessByVacationID = async function (vacationId) {
    try{
        let sql = `SELECT
            t.*, u.username,c.codeCname as processStatusName
        FROM
            flowprocess t,
            userinfo u,
          code c
        WHERE
            t.eventId = ?
        AND u.userId = t.approverId
        AND c.codeCode = t.processStatus
        AND c.codetype = 'processStatus';`;
        let sqlFormat = mysql.format(sql, [vacationId]);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};
exports.addFlowProcessFromDb=async function(datas){
    let sql = "";
    let rows = null;
    sql = "call proc_flowprocess_add(?,?,?,?,?,?,?,?)";
    rows=await this.query(sql,datas);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
/**
 * 根据流程节点类型获取流程ID
 */
exports.get_flowdef = async function(flowType, serialNo){
    let str_sql = `SELECT
                    d.flowType,
                    d.flowName,
                    n.*
                FROM
                    flowdef d,
                    flownodes n
                WHERE
                    d.flowId = n.flowId
                AND d.rcd_end_time = n.rcd_end_time
                AND flowType = '${flowType}' `
    ;
    if(serialNo){
        str_sql += ` AND n.serialNo = '${serialNo}' `;
    }
    try{
        let rows=await global.dao.querySql(str_sql);
        if(rows.length>0){
            return rows;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e.message);
        return null;
    }
};
//待办统计 待审批工时
exports.getStatisticsWorkCountFromDb=async function(userId){
    try{
        let sql = `select count(workDiaryId) count from workdiary where approverId = '${userId}' and workDiaryStatus = '1' and workDiaryType =1  and rcd_end_time = date('9999-12-31')`;
        let rows=await global.dao.querySql(sql);
        if(rows.length>0){
            return rows[0].count;
        }else{
            return 0;
        }
    }catch (e) {
        logger.error(e);
    }
};
//待办统计 待审批休假
exports.getStatisticsVacationCountFromDb=async function(userId){
    try{
        let sql = `select count(processID) count from flowprocess where approverId = '${userId}' and processStatus = '1'  and rcd_end_time = date('9999-12-31') `;
        let rows=await global.dao.querySql(sql);
        if(rows.length>0){
            return rows[0].count;
        }else{
            return 0;
        }
    }catch (e) {
        logger.error(e);
    }

};
exports.modifyRequisitionStatusFromDb=async function(userId, vacationId){
    try{
        let sql = "";
        let rows = null;
        sql = `UPDATE vacationrequisition
            SET requisitionStatus = '2',
             rcd_mod_time = NOW(),
             rcd_mod_user =?
            WHERE
                vacationId =?
            AND rcd_end_time = DATE('9999-12-31')`;
        let sqlFormat = mysql.format(sql, [userId, vacationId]);
        rows=await this.querySql(sqlFormat);
        if(rows.length>0){
            return rows;
        }else{
            return null;
        }
    }catch (e) {
        logger.error(e);
    }
};
//查询当天是否有报工
exports.queryWorkDairy = async function (userId,workDate) {
    try{
        let sql = `select * from workdiary w WHERE w.userId = ? and w.workDate=? and w.rcd_end_time=DATE('9999-12-31')`;
        let sqlFormat = mysql.format(sql, [userId,workDate]);
        let rows = await   this.querySql(sqlFormat);
        if(rows.length>0){
            return rows;
        }else{
            return null;
        }
    }catch (e){
        logger.error(e);
    }
};
//修改workdairy表的 工作类型 workDiaryType
exports.updateWorkDairyType = async function (params) {
    try{
        let sql = `UPDATE workdiary t
                    SET t.workDiaryType = ?,
                    t.rcd_mod_user = ?,
                    t.rcd_mod_time = now()
                    WHERE
                    t.workDiaryId = ?`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};
exports.modifyFlowProcessFromDb=async function(userId, vacationId, status){
    try{
        let sql = "";
        let rows = null;
        let query_sql = `SELECT
                            processID
                        FROM
                            flowprocess
                        WHERE
                            userId = '${userId}'
                        AND processStatus = '1'
                        AND eventId = '${vacationId}'
                        AND rcd_end_time = DATE('9999-12-31')
                        ORDER BY
                            rcd_crt_time DESC`;

        let query_row = await this.querySql(query_sql);
        let processID='';
        if(query_row.length > 0){
            processID = query_row[0]['processID'];
            sql = `update flowprocess
               set processStatus= ?,
                   rcd_mod_user= ?,
                rcd_mod_time= now()
                where processID = '${processID}'`;
            let sqlFormat = mysql.format(sql, [userId, vacationId, status]);
            rows=await this.querySql(sqlFormat);
        }
        if(query_row.length>0){
            return rows;
        }else{
            return null;
        }
    }catch (e) {
        logger.error(e);
    }
};
//查询当天是否有休假申请
exports.queryVacationrequisition = async function (params) {
    try{
        let sql = `SELECT
                        *
                    FROM
                        vacationrequisition v
                    WHERE
                        v.userId = ?
                    AND v.startDate >= ?
                    AND v.endDate <= ?
                    AND requisitionStatus IN ('1', '3')
                    AND v.rcd_end_time = DATE('9999-12-31')`;
        let sqlFormat = mysql.format(sql, params);
        let rows = await   this.querySql(sqlFormat);
        if(rows.length>0){
            return rows;
        }else{
            return null;
        }
    }catch (e){
        logger.error(e);
    }
};
//休假撤销或者驳回的时候删除这天的工时记录
exports.delWorkDairyByWorkDate = async function (params) {
    try{
        let sql = `UPDATE workdiary t
                    SET t.rcd_mod_user = ?, t.rcd_mod_time = now(),
                    t.rcd_end_time = now()
                    WHERE
                    t.userId = ?
                    AND t.workDate >=?
                    AND t.workDate <= ?`;
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};

//根据条件查询车险佣金-保司人员
exports.queryCarfeeExternalUserByCondition=async    function(params){
    try{
        let sql=`SELECT
                    insurerName,
                    cityName,
                    userName,
                    mobile,
                    role
                FROM carfee_external_user where rcd_end_time = DATE('9999-12-31') `;
        if(params[0]){
            sql+=` and insurer = '${params[0]}'`;
        }
        if(params[1]){
            sql+=` and cityCode = '${params[1]}'`;
        }
        if(params[2]){
            sql+=` and rcd_crt_time >= date('${params[2]}')`;
        }
        if(params[3]){
            sql+=` and rcd_crt_time < date('${params[3]}')+1`;
        }
        if(params[4]){
            sql+=` and role = '${params[4]}'`;
        }
        if(params[5]){
            sql+=` and (cityName like '%${params[5]}%' or userName like '%${params[5]}%' or mobile like '%${params[5]}%')`
        }

        let row = await this.querySql(sql);
        return row;

    }catch (e){
        logger.error(e);
    }
};
//根据传入的条件查询保司人员表是否有重复数据
exports.queryCarfeeExternalUserByExcelData=async function(params){
    try{
        let sql=`SELECT
                    insurerName,
                    insurer,
                    cityCode,
                    cityName,
                    userName,
                    mobile,
                    role
                FROM carfee_external_user where  insurerName = ? and cityName = ? and role  = ? 
                 AND rcd_end_time = DATE('9999-12-31')`;

        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        if(row.length>0){
            return row;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e);
    }
};

/**
 * 根据id删除附件方法
 * @param keys
 * @param userId
 * @returns {Promise<*>}
 */
exports.deleteCarfeeAttaches=async function(attacheId){
    let rows = '';
    let rsql = "";
    let sql = "";
        sql = "UPDATE carfee_attaches SET rcd_end_time = now(),rcd_mod_user=now() WHERE attache_id = ? AND rcd_end_time =date('9999-12-31')";
        rsql = mysql.format(sql,[attacheId]);
        rows=await this.querySql(rsql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

/**
 * 审核佣金配置
 * @param keys
 * @param userId
 * @returns {Promise<*>}
 */
exports.approveCarFeeConfig=async function(datas){
    let rows = '';
    let rsql = "";
    let sql = "";

        sql = "call proc_carfee_update(?,?,?,?,?)";
        rsql = mysql.format(sql,datas);
        rows=await this.querySql(rsql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};


//查询车险佣金保司用户数量
exports.getInsurerUserCount=async function(insurer,cityCode,beginDate,endDate,role,keyword){
    let str_sql = "SELECT count(1) count FROM carfee_external_user where rcd_end_time = DATE('9999-12-31') ";
    if(insurer){
        str_sql += " AND insurer = '"+insurer+"' ";
    }
    if(cityCode){
        str_sql += " AND cityCode = '"+cityCode+"' ";
    }
    if(role){
        str_sql += " AND role = '"+role+"' ";
    }
    if(beginDate)
    {
        str_sql += " AND rcd_crt_time >= date('"+beginDate+"') ";
    }
    if(endDate)
    {
        str_sql += " AND rcd_crt_time <= date('"+endDate+"')+1 ";
    }
    if(keyword){
        str_sql += " AND ( cityName like '%"+keyword+"%' ";
        str_sql += " OR userName like '%"+keyword+"%' ";
        str_sql += " OR mobile like '%"+keyword+"%')";
    }
    logger.error("getInsurerUserCount sql:"+str_sql);
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
//查询车险佣金保司用户列表
//to-do 修改时间与更新时间整合
exports.getInsurerUserList=async function(insurer,cityCode,beginDate,endDate,role,keyword,from,length){
    let str_sql = "SELECT insurer,insurerName,cityCode,cityName,userId,userName,mobile,role,rcd_crt_username as rcd_crt_user,rcd_crt_time FROM carfee_external_user  where rcd_end_time = DATE('9999-12-31')";
    if(insurer){
        str_sql += " AND insurer = '"+insurer+"' ";
    }
    if(cityCode){
        str_sql += " AND cityCode = '"+cityCode+"' ";
    }
    if(role){
        str_sql += " AND role = '"+role+"' ";
    }
    if(beginDate)
    {
        str_sql += " AND rcd_crt_time >= date('"+beginDate+"') ";
    }
    if(endDate)
    {
        str_sql += " AND rcd_crt_time < date('"+endDate+"')+1 ";
    }
    if(keyword){
        str_sql += " AND ( cityName like '%"+keyword+"%' ";
        str_sql += " OR userName like '%"+keyword+"%' ";
        str_sql += " OR mobile like '%"+keyword+"%')";
    }
    str_sql += " order by rcd_crt_time desc limit ?, ?";
    logger.error("getInsurerUserList sql:"+str_sql);
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
//通过用户ID查询用户姓名
//to-do
exports.getUserNamebyUserId=async function(params){
    try{
        let sql = "SELECT username from  userinfo where userId = ?";
        let sqlFormat = mysql.format(sql, params);
        let rows = await   this.querySql(sqlFormat);
        if(rows.length>0){
            let ret  = rows[0].username;
            return ret;
        }else{
            return null;
        }
    }catch (e){
        logger.error(e);
    }
};
//校验新增保司人员
//to-do
exports.checkAddInsurerUser=async function(params){
    try{
        let sql = "SELECT userName,mobile,role FROM carfee_external_user  where insurer= ? and  cityCode= ? and rcd_end_time = DATE('9999-12-31')";
        let sqlFormat = mysql.format(sql, params);
        let rows = await   this.querySql(sqlFormat);
        if(rows.length>0){
            return rows;
        }else{
            return null;
        }
    }catch (e){
        logger.error(e);
    }
};
//新增保司人员
//to-do
exports.addInsureUser=async function(params){
    let sql = "call proc_insureUser_add(?,?,?,?,?,?,?,?,?,?,?)";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
//校验修改保司人员
//to-do
exports.checkModInsurerUser=async function(params){
    try{
        let sql = "SELECT userName,mobile,role FROM carfee_external_user  where insurer= ? and  cityCode= ? and role <> ? and rcd_end_time = DATE('9999-12-31')";
        let sqlFormat = mysql.format(sql, params);
        let rows = await   this.querySql(sqlFormat);
        if(rows.length>0){
            return rows;
        }else{
            return null;
        }
    }catch (e){
        logger.error(e);
    }
};
//修改保司人员
//to-do
exports.modInsureUser=async function(params){
    try{
        let sql = "update carfee_external_user set userName = ?,mobile = ?  where insurer= ? and  cityCode= ? and role = ?";
        let sqlFormat = mysql.format(sql, params);
        let row = await   this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};
//删除保司人员
//to-do
exports.deleteInsureUser=async function(params){
    try{
        let sql = "update carfee_external_user set rcd_end_time = now(),rcd_mod_user = ? where userId = ? and insurer= ? and  cityCode= ? and role = ?";
        let sqlFormat = mysql.format(sql, params);
        let row = await this.querySql(sqlFormat);
        return row;
    }catch (e){
        logger.error(e);
    }
};
//批量新增保司人员
//to-do
exports.batchAddInsureUser=async function(params){
    let sql = "call proc_insureUser_batchAdd(?,?,?,?,?,?,?,?,?)";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};
//查询保险公司集合
exports.queryAllInsurerName=async function(){
    let sql=`SELECT codeCname FROM CODE WHERE codetype='autoInsurer' AND rcd_end_time=DATE('9999-12-31')`;
    let rows=await global.dao.querySql(sql);
    if(rows.length>0){
        let str="";
        for(let i=0;i<rows.length;i++){
            if(str==""){
                str+=rows[i]["codeCname"];
            }else{
                str=str+","+rows[i]["codeCname"];
            }

        }
        return str;
    }else{
        return null;
    }
}

//查询所有机构名称集合
exports.queryAllCityName=async function(){
    let sql=`SELECT fullName FROM region `;
    let rows=await global.dao.querySql(sql);
    if(rows.length>0){
        let str="";
        for(let i=0;i<rows.length;i++){
            if(str==""){
                str+=rows[i]["fullName"];
            }else{
                str=str+","+rows[i]["fullName"];
            }

        }
        return str;
    }else{
        return null;
    }
}

//根据城市名称 查询机构code
exports.queryCityCodeByFullname=async function(params){
    let sql=`SELECT regionId FROM region where fullName = ? and level = 2`;
    let sqlFormat = mysql.format(sql, params);
    let rows=await global.dao.querySql(sqlFormat);
    if(rows.length>0){
        return rows[0]["regionId"]
    }else{
        return null;
    }
}

//根据保险公司名称查询code
exports.queryInsurerCodeByName=async function(params){
    let sql=`SELECT codeCode FROM CODE WHERE codetype='autoInsurer' AND rcd_end_time=DATE('9999-12-31') and codeCname = ?`;
    let sqlFormat = mysql.format(sql, params);
    let rows=await global.dao.querySql(sqlFormat);
    if(rows.length>0){
        return rows[0]["codeCode"];
    }else{
        return null;
    }
}
//查询产品配置信息是否存在
exports.isExitProductTechCfgFromDb =async function(productId){
    let strSql = "SELECT * from producttechcfg where 1=1 ";
    if(productId){
        strSql += " And productId = '"+productId+"'";
    }
    strSql += " AND rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(strSql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//新增修改产品配置信息
exports.addOrUpdatProductTechCfgFromDb=async function(flag,params){
    let sql = '';
    if('1' == flag){
        sql = "INSERT INTO `producttechcfg` (`productId`, `payType`, `underwriteType`, `calculateTemplate`,  `underwriteTemplate`,`insuranceTemplate` ,`withdrawTemplate`,`policyDownUrlTemplate`,`invoiceTemplate`,`backTemplate`,`checks`,`checks2`,`isQuota`,`ext1`,`ext2`,`ext3` ,`rcd_crt_user`, `rct_mod_user`, `rcd_crt_time`, `rcd_mod_time`) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?, SYSDATE(), SYSDATE() )";
    }else if("2" == flag){
        sql = " update producttechcfg set rcd_mod_time = now(),rct_mod_user = ?, payType=?,underwriteType=?,calculateTemplate=?,underwriteTemplate=?,insuranceTemplate=?,withdrawTemplate=?,policyDownUrlTemplate=?,invoiceTemplate=?,backTemplate=?,checks=?,checks2=?,isQuota=?,ext1=?,ext2=?,ext3=? where  productId = ?  and rcd_end_time =date('9999-12-31') ";
    }
    sql = mysql.format(sql,params);
    let rows=await global.dao.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};
//删除产品配置信息
exports.deleteProductTechCfgFromDb=async function(productId,userId){
    let sql = "UPDATE producttechcfg SET rcd_end_time = now(),rct_mod_user='"+userId+"' WHERE productId = '"+productId+"' AND  rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

//产品配置信息统计
exports.getProductTechCfgCountDb=async function(conditions){
    let str_sql = "select count(1) count from producttechcfg c left join product p on c.productId = p.productId where 1=1 ";
    if(conditions.productId){
        str_sql += " AND c.productId like '%"+conditions.productId+"%'";
    }
    if(conditions.productName){
        str_sql += " AND p.productName like '%"+conditions.productName.toLowerCase()+"%' ";
    }
    str_sql += " AND c.rcd_end_time =date('9999-12-31')";
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};
//产品配置信息查询
exports.getProductTechCfgListFromDb=async function(conditions, from, length){
    let str_sql = "select c.productId,c.payType,c.underwriteType,c.calculateTemplate,c.underwriteTemplate,c.insuranceTemplate,c.withdrawTemplate,c.policyDownUrlTemplate,c.invoiceTemplate,c.backTemplate,c.checks,c.checks2,c.isQuota,c.ext1,c.ext2,c.ext3,c.rcd_crt_user,c.rct_mod_user,c.rcd_crt_time,c.rcd_mod_time ,c.rcd_end_time,p.productName,p.productType from producttechcfg c left join product p on c.productId = p.productId where 1=1 ";
    if(conditions.productId){
        str_sql += " AND c.productId like '%"+conditions.productId+"%' ";
    }
    if(conditions.productName){
        str_sql += " AND p.productName like '%"+conditions.productName+"%' ";
    }

    str_sql += " AND c.rcd_end_time =date('9999-12-31') order by c.rcd_crt_time  desc limit ? ,?";
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};

exports.getSystemOperationCountDb=async function(conditions){
    let str_sql = `SELECT count(*) count FROM systems where 1=1 `;
    if(conditions.systemId){
        str_sql += ` and systemId like '%${conditions.systemId}%'`;
    }
    if(conditions.systemName){
        str_sql += ` and systemName like '%${conditions.systemName}%'`;
    }
    str_sql += ` and extend2 is not null and extend2 <>  '' and port is not null and port <> '' and port <> '--' and type='本公司系统'  and rcd_end_time =date('9999-12-31')`;
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getSystemOperationListFromDb=async function(conditions, from, length){
    let str_sql = `SELECT * FROM systems where 1=1 `;
    if(conditions.systemId){
        str_sql += ` and systemId like '%${conditions.systemId}%'`;
    }
    if(conditions.systemName){
        str_sql += ` and systemName like '%${conditions.systemName}%'`;
    }
    str_sql += ` and extend2 is not null and extend2 <>  '' and port is not null and port <> '--' and port <> ''and type='本公司系统' and rcd_end_time =date('9999-12-31') order by systemId desc limit ?, ?`;
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    console.log("执行sql========"+sqlFormat)
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};

exports.getSystemLogCountDb=async function(conditions){
    let str_sql = `SELECT count(*) count FROM operateLog where 1=1 `;
    if(conditions.logId){
        str_sql += ` and logId like '%${conditions.logId}%'`;
    }
    if(conditions.userName){
        str_sql += ` and userName like '%${conditions.userName}%'`;
    }
    if(conditions.operateIp){
        str_sql += ` and operateIp like '%${conditions.operateIp}%'`;
    }
    if(conditions.operateType){
        str_sql += ` and operateType = '${conditions.operateType}'`;
    }
    str_sql += ` and rcd_end_time =date('9999-12-31')`;
    let rows=await this.querySql(str_sql);
    if(rows.length>0){
        let ret  = rows[0].count;
        return ret;
    }else{
        return null;
    }
};

exports.getSystemLogListFromDb=async function(conditions, from, length){
    let str_sql = `SELECT * FROM operateLog where 1=1 `;
    if(conditions.logId){
        str_sql += ` and logId like '%${conditions.logId}%'`;
    }
    if(conditions.userName){
        str_sql += ` and userName like '%${conditions.userName}%'`;
    }
    if(conditions.operateIp){
        str_sql += ` and operateIp like '%${conditions.operateIp}%'`;
    }
    if(conditions.operateType){
        str_sql += ` and operateType = '${conditions.operateType}'`;
    }
    str_sql += ` and rcd_end_time =date('9999-12-31') order by rcd_crt_time desc limit ?, ?`;
    let sqlFormat =  mysql.format(str_sql,[from,length]);
    console.log("执行sql======="+sqlFormat);
    let rows=await this.querySql(sqlFormat);
    if(rows.length>0){
        let ret  = rows;
        return ret;
    }else{
        return null;
    }
};

//删除操作日志信息
exports.deleteOperateLogFromDb=async function(logId,userId){
    let sql = "UPDATE operateLog SET rcd_end_time = now(),rct_mod_user='"+userId+"' WHERE logId = '"+logId+"' AND  rcd_end_time =date('9999-12-31') ";
    let rows=await this.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

//新增操作日志信息
exports.addOperateLog=async function(flag,params){
    let sql = '';
    if('1' == flag){
        sql = "INSERT INTO `operateLog` (`logId`, `userName`, `content`, `error`,  `operateIp`,`operateType` ,`extends1`,`extends2`,`extends3`,`rcd_crt_user`,`rcd_crt_time`,`rct_mod_user`,`rct_mod_time`) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?, SYSDATE(),?, SYSDATE())";
    }
    sql = mysql.format(sql,params);
    let rows=await global.dao.querySql(sql);
    if(rows!=null){
        return rows;
    }else{
        return null;
    }
};

exports.getPolicyinfoByOrderNo=async function(params){
    let str_sql = "SELECT" +
        " c.autoInsurer," +
        " (SELECT o.codeCname FROM basemanage.code o WHERE o.codetype ='autoInsurer' AND o.codeCode=c.autoInsurer) AS autoInsurerName," +
        " c.premium," +
        " c.channelId," +
        " c.rcd_crt_time," +
        " c.status," +
        " (SELECT codeCname FROM basemanage.code WHERE codetype = 'PolicyStatus' AND codeCode=c.status) AS statusName," +
        " ch.channelName," +
        " cu.channeluserId " +
        " FROM" +
        " datawarehouse.carpolicyinfo c left join basemanage.channels ch on c.channelId=ch.channelId left join basemanage.channelsuser cu on c.channelId=cu.channelId " +
        " WHERE c.orderNo=? ";

    str_sql += " and c.rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.getCarOwnerByOrderNo=async function(params){
    let str_sql = "SELECT " +
        "  t1.rcd_crt_time," +
        "  t1.orderNo," +
        "  t1.insuredtype," +
        "  t1.idName," +
        "  t1.idType," +
        "  (SELECT codeCname FROM basemanage.code WHERE codetype = 'idType' AND codeCode=t1.idType) AS idTypeName," +
        "  t1.sex," +
        "  (SELECT codeCname FROM basemanage.code WHERE codetype = 'sex' AND codeCode=t1.sex) AS sexName," +
        "  t1.idNo," +
        "  t1.birthday," +
        "  t1.mobile " +
        " FROM datawarehouse.insured  t1 " +
        " INNER JOIN datawarehouse.cartobusiness t2 ON t1.orderno=t2.orderno AND t1.serialno=1 " +
        " WHERE t1.insuredtype='4' AND t1.orderNo=?";

    str_sql += " and t1.rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.getRecognizeeByOrderNo=async function(params){
    let str_sql = "SELECT " +
        "  t1.rcd_crt_time," +
        "  t1.orderNo," +
        "  t1.insuredtype," +
        "  t1.idName," +
        "  t1.idType," +
        "  (SELECT codeCname FROM basemanage.code WHERE codetype = 'idType' AND codeCode=t1.idType) AS idTypeName," +
        "  t1.sex," +
        "  (SELECT codeCname FROM basemanage.code WHERE codetype = 'sex' AND codeCode=t1.sex) AS sexName," +
        "  t1.idNo," +
        "  t1.birthday," +
        "  t1.mobile " +
        " FROM datawarehouse.insured  t1" +
        " INNER JOIN datawarehouse.cartobusiness t2 ON t1.orderno=t2.orderno AND t1.serialno=1 " +
        "WHERE t1.insuredType IN (2, 3) AND t1.orderNo=?";

    str_sql += " and t1.rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.getPolicyByOrderNo=async function(params){
    let str_sql = "SELECT " +
        "  t1.rcd_crt_time 创建时间," +
        "  t1.orderNo," +
        "  t1.insuredtype," +
        "  t1.idName," +
        "  t1.idType," +
        "  (SELECT codeCname FROM basemanage.code WHERE codetype = 'idType' AND codeCode=t1.idType) AS idTypeName," +
        "  t1.sex," +
        "  (SELECT codeCname FROM basemanage.code WHERE codetype = 'sex' AND codeCode=t1.sex) AS sexName," +
        "  t1.idNo," +
        "  t1.birthday," +
        "  t1.mobile" +
        " FROM datawarehouse.insured  t1" +
        " INNER JOIN datawarehouse.cartobusiness t2 ON t1.orderno=t2.orderno AND t1.serialno=1 " +
        "WHERE t1.insuredType IN (1, 3) AND t1.orderNo=?";

    str_sql += " and t1.rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.getCarinfoByOrderNo=async function(params){
    let str_sql = "SELECT" +
        " licenseNo," +
        " frameNo," +
        " engineNo," +
        " modelCode," +
        " enrollDate," +
        " chgOwnerFlag," +
        " (SELECT codeCname FROM basemanage.code WHERE codetype = 'chgOwnerFlag' AND codeCode=chgOwnerFlag) AS chgOwnerFlagName," +
        " transferDate," +
        " invoiceNo," +
        " invoiceDate," +
        " carkind," +
        " useNature," +
        " seatCount," +
        " tonCount," +
        " NewfuelType," +
        " (SELECT codeCname FROM basemanage.code WHERE codetype = 'NewfuelType' AND codeCode=NewfuelType) AS NewfuelTypeName," +
        " isLoanFlag," +
        " (SELECT codeCname FROM basemanage.code WHERE codetype = 'isLoanFlag' AND codeCode=isLoanFlag) AS isLoanFlagName," +
        " firstbeneficiary" +
        " FROM" +
        " datawarehouse.carToBusiness" +
        " WHERE orderNo=?";

    str_sql += " and rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};


exports.getDispatchByOrderNo=async function(params){
    let str_sql = "SELECT " +
        " recipients," +
        " recipientsMobile," +
        " recipientsEmail," +
        " recipientsAddress," +
        " deliveryDate," +
        " isInvoice," +
        " invoiceTitle    " +
        " FROM datawarehouse.carToBusiness" +
        " WHERE orderNo=?";

    str_sql += " and rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.getInsuranceByOrderNo=async function(params){
    let str_sql = "SELECT " +
        "premium_JQ," +
        "policyno_JQ," +
        "policyno_JQ_period," +
        "carShipTaxAmount," +
        "premium_SY," +
        "policyno_SY," +
        "policyno_SY_period," +
        "carDanagePremium," +
        "carThreePremium," +
        "driverPremium," +
        "passengrePremium," +
        "glassPremium," +
        "noDeductiblesPremium," +
        "noDeductiblesCarDamangePremium," +
        "noDeductiblesCarThreePremium," +
        "noDeductiblesDriverPremium" +
        " FROM datawarehouse.carToBusiness " +
        " WHERE orderNo=? ";

    str_sql += " and rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};

exports.getPayinfoByOrderNo=async function(params){
    let str_sql = "SELECT " +
        "paytime," +
        "paymode," +
        "(SELECT codeCname FROM basemanage.code WHERE codetype = 'paymode' AND codeCode=paymode) AS paymodeName " +
        "FROM " +
        "datawarehouse.cartobusiness" +
        " WHERE orderNo=? ";

    str_sql += " and rcd_end_time =date('9999-12-31')";
    let sql = mysql.format(str_sql,params);
    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows[0];
    }else{
        return null;
    }
};



exports.addChannelAndUserDb=async function(params){
    let sql = "call proc_channel_user_add(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows[0][0].t_error;
    }else{
        return null;
    }
};
exports.modChannelAndUserDb=async function(params){
    let sql = "call proc_channel_user_update(?,?,?,?,?,?,?,?,?,?,?)";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.checkChanneluserIdDb=async function(params){
    let sql = "SELECT channeluserId FROM basemanage.channelsuser WHERE channeluserId=? ";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.checkChannelNameDb=async function(params){
    let sql = "SELECT channelId FROM channels WHERE channelName=? ";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.delChannelAndUserDb=async function(params){
    try{
        let sql1="call proc_channel_user_del(?,?,?,?)";
        let sqlformat1 =  mysql.format(sql1,params);
        let rows1=await global.dao.querySql(sqlformat1);

        if(rows1.length>0){
            return rows1[0][0].t_error;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e);
    }

};

exports.delProductChannelConfigDb=async function(params){
    try{
        let sql1="call proc_productChannelConfig_del(?,?,?)";
        let sqlformat1 =  mysql.format(sql1,[params[0],params[2],params[3]]);
        let rows1=await global.dao.querySql(sqlformat1);

        if(rows1.length>0){
            return rows1[0][0].t_error;
        }else{
            return null;
        }
    }catch(e){
        logger.error(e);
    }

};

exports.getChannelLevelById=async function(params){
    let sql = "SELECT level FROM channels WHERE channelId=? and rcd_end_time =date('9999-12-31')";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows[0].level;
    }else{
        return null;
    }
};

exports.hasBusinessDb=async function(params){
    let sql = "SELECT " +
        "  COUNT(1) count" +
        " FROM" +
        "  product_channel_config pc " +
        "   LEFT JOIN product p " +
        "    ON p.productId = pc.productId " +
        "    AND p.rcd_end_time = DATE('9999-12-31') " +
        "  LEFT JOIN product_group pg " +
        "    ON pg.productGroupId = p.productGroupId " +
        "    AND pg.rcd_end_time = DATE('9999-12-31')" +
        " WHERE pc.saleChannelId = ? AND pg.productGroupId!=?" +
        "  AND pc.rcd_end_time = DATE('9999-12-31')";
    let sqlformat =  mysql.format(sql,params);
    let rows=await global.dao.querySql(sqlformat);
    if(rows.length>0){
        return rows[0].count;
    }else{
        return null;
    }
};

exports.getBusinessTypeListDb=async function(params){
    let sql = `SELECT
                    distinct
                    pg.productGroupId,
                    pg.groupName
                FROM
                    basemanage.product_group pg
                INNER JOIN
                    basemanage.product p ON p.productGroupId=pg.productGroupId AND p.rcd_end_time=DATE('9999-12-31')
                    
                WHERE 1=1
                AND	pg.rcd_end_time=DATE('9999-12-31')`;
    if(params[0]){
        sql+=`AND     p.productId IN(
                    SELECT pc.productId FROM basemanage.product_channel_config pc INNER JOIN basemanage.channels c ON pc.saleChannelId=c.channelId  AND c.rcd_end_time=DATE('9999-12-31') 
                    WHERE 1=1 AND pc.rcd_end_time=DATE('9999-12-31') AND (c.channelId='${params[0]}' OR c.upChannelId='${params[0]}')
                
                )`;
    }
    sql+=` ORDER BY pg.productGroupId`;
    let rows=await global.dao.querySql(sql);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};

exports.getBusinessModeValueDb = async function(params){
    let sql = "select DISTINCT channelBusinessMode  from channelsextrainfo  c where c.channelId =  '"+ params +"'and  c.rcd_end_time=date('9999-12-31') ";
    let row = await  this.querySql(sql);
    if (row)
    {
        return row;
    }else
    {
        return null;
    }
}

exports.getcooperatingStateValueFromDb = async function(params){
    let sql = "select DISTINCT  cooperatingState from channelsextrainfo  c where c.channelId  =  '"+ params +"' AND  " +
        "c.rcd_end_time = date('9999-12-31');"
    let rows = await  this.querySql(sql);
    if (rows)
    {
        return rows;
    }else
    {
        return null;
    }
}




exports.getRegionListFromDb=async function(regionId, upRegionId){
    let sql = "select regionId, name, fullName, level,spell,shortSpell,CAST(hotFlag as SIGNED) as hotFlag,hotNo,licensePlatePrefiex, orderNo, orderNo2, upRegionId FROM region where 1 = 1 ";
    if(regionId){
        sql += " AND regionId ='"+ regionId +"' ";
    }
    if(upRegionId){
        sql += " AND upRegionId = '"+ upRegionId +"' ";
    }

    let rows=await this.querySql(sql);
    if(rows.length>0){
        return rows;
    }else{
        return null;
    }
};


exports.checkCarChannelRegionfromDb=async function(upchannelId,regionId){
    let sql = "select c.channelId,c.channelName  from channels c "+
        "INNER JOIN  channelsExtraInfo ce on c.channelId=ce.channelId "+
        "where 1=1 "+
        " AND c.rcd_end_time =date('9999-12-31')    AND c.rcd_end_time =date('9999-12-31') "+
        "and c.upChannelId = '"+upchannelId+"' and ce.regionId='" + regionId+"'";

    let rows=await this.querySql(sql);

    return rows;
};

exports.getInsuranceCompanyFromDb = async function(){
    let  sql = "SELECT DISTINCT channels.channelId,channels.channelName,channels.upChannelId, " +
        " channels.channelType,channels.level,channels.memo,channels.rcd_crt_user, " +
        " channels.rcd_mod_user,channels.rcd_crt_time,channels.rcd_mod_time, " +
        " channels.rcd_end_time,(select t.channelName from channels t where t.channelId = channels.upChannelId) as upChannelName "+
        " from channels,product where product.insurer = channels.channelId and  product.productType in ('P006','P007') " +
        " and product.rcd_end_time = '9999-12-31' and channels.rcd_end_time = '9999-12-31' and channels.level =1 ";
    let  rows = await  this.querySql(sql);
    return rows;
}


exports.getCarInsuranceDepartmentPeople=async function(departmentId,quarters){
    // let quartersGroup ="";
    // quartersGroup = quarters.join("'or'");
    let sql = "select c.username,c.userId,c.memo  from userinfo c "+" INNER JOIN department d on c.departmentId = d.departmentId"
    +" where 1=1"+" AND c.rcd_end_time =date('9999-12-31')  AND d.departmentID ='"+departmentId+"'and c.memo='"+quarters+"' ";
    console.info(sql)
    let rows =await this.querySql(sql);
    return rows;
}
exports.getChannelCommissionRegion=async function (fromChannel,productType) {
    // let productTypeGroup= "";

    // productTypeGroup=productType.join("'or'");

    // let sql = "select regionid from product_fee_config  p INNER JOIN product  r   on  p.productId = r.productId where 1=1 "
    // +" and    p.fromChannel =  '"+fromChannel+"'  and  r.productType = '" +productTypeGroup+"'";
    // let sql ="select re.regionid,re.name,re.fullName,re.level,re.upRegionId,re.orderNo from basemanage.product_fee_config  p  " +
    //     "INNER JOIN basemanage.product  r on  p.productId = r.productId  " +
    //     " LEFT JOIN basemanage.region re on p.regionid = re.regionid " +"where 1=1 and  p.fromChannel =  '"+fromChannel+"'   and r.productType = '" +productTypeGroup+"'";
    // let sql ="SELECT * from  region " +
    //     "where  regionId in( " +
    //     "SELECT distinct regionId from channelsExtraInfo where channelId in( " +
    //     "(SELECT  channelId from channels where upchannelId in( " +
    //     "SELECT channelId from   channels where channelId= '"+fromChannel+"'  and rcd_end_time='9999-12-31') " +
    //     "  and rcd_end_time='9999-12-31') " +
    //     ") and rcd_end_time='9999-12-31')"
        let sql = "SELECT DISTINCT pr.regionId ,region.name,region.fullName,region.level,region.spell,region.shortSpell,region.hotFlag,region.hotNo,region.licensePlatePrefiex,region.orderNo,region.orderNo2,region.upRegionId  from product_fee_config pr,channels,region,product " +
   " where pr.fromChannel=channels.channelId and channels.upChannelId = '"+fromChannel+"' and pr.regionId =region.regionId " +
    " and  date (NOW()) <= pr.feeExpirationTime  and pr.rcd_end_time='9999-12-31' and  product.productId=pr.productId and product.productType = ('p006' or 'p007');"
    console.info(sql)
    let rows =await  this.querySql(sql);
    return rows;

}
exports.checkCarChannelCommissionRegionId=async function (toChannel,regionId) {
     let regionIdGroup= "";

     regionIdGroup=regionId.join("','");
    // let sql = "select regionId from product_fee_config p " + "INNER JOIN product r on p.productId = r.productId where 1=1 "
    // +"  and  p.fromChannel =  '"+fromChannel+"'   and  p.toChannel = '"+toChannel+"'  and r.productType = '" +productTypeGroup+"'";
    let sql = "select distinct regionId from product_fee_config pfc where  pfc.toChannel = '"+toChannel+"' and pfc.rcd_end_time = '9999-12-31'  AND pfc.regionId in('" +regionIdGroup+ "')";
    let rows = await  this.querySql(sql);
    return rows;

}

exports.getChannelCommissionInsuranceCompany =async function () {
    let  sql = "SELECT distinct c.channelId,c.channelName,c.channelType,c.`level` from channels c  "
    +" join product p on c.channelId=p.insurer "+
    " where p.productType IN('P006','P007') and p.rcd_end_time = '9999-12-31' ";
    let rows = await  this.querySql(sql);
    return rows;
}

exports.getAutoInsuranceChannels = async function () {
    let sql = "select DISTINCT c.channelid,c.channelname from channels c left join "
    + " basemanage.product_fee_config  p"
    +" on p.toChannel = c.channelId "+
    " INNER join basemanage.product pr on p.productid = pr.productid "
   + " where p.fromChannel = 'CH10000008' and pr.productType in ('P006','P007') "
    + "and c.level = 1 and c.rcd_end_time ='9999-12-31' ";
        let rows = await this.querySql(sql);
    return rows;

}