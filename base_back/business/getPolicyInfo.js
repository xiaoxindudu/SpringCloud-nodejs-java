/**
 * 根据输入的内容获得保单信息
 */
let D=require('date-utils');

isIncludeNumber=function(str){
    let number=[0,1,2,3,4,5,6,7,8,9];
    for(let i=0;i<number.length;i++){
        if(str.indexOf(number[i])>0){
            return true;
        }
    }
    return false;
}

exports.getPolicyInfo=async function(keyword){
    logger.error('=====收到请求:  '+keyword);
    let ret_json={
        'head':{
            'error_code':0,
            'error_msg':''
        },
        'body':[]
    };
    try{
        // let sql='select y.*,p.subType,p.premium from datawarehouse.ywabstract y, datawarehouse.product p where y.productId=p.productId '
        let sql=` SELECT  
                    d.policyNo AS policyNo,  
                        i.serialNo,  
                        d.startDate AS startDate,  
                        d.\`subject\` AS \`subject\`,  
                        i.idName AS idName,  
                        i.idNo AS idNo,  
                        c.codeCname AS \`status\`,  
                        d.extend1 AS extend1,  
                        d.productId AS productId,  
                        d.endorseNo AS endorseNo,  
                        d.rcd_crt_time AS rcd_crt_time,  
                        d.rcd_mod_time AS rcd_mod_time,d.premium,p.productName  
                    FROM  
                    (  
                        (  
                            ods.orderdetail d  
                    JOIN ods.insured i  
                ) JOIN product p  
                ),code c  
                    WHERE  
                    (  
                        (d.orderNo = i.orderNo)  
										AND (d.serialNo = i.serialNo)
                    AND (p.productId = d.productId)  
                    AND (i.insuredType = 2)  
                    AND c.codeCode = d.\`status\`  
                    AND c.codetype = "PolicyStatus"  
                    AND d.policyNo is NOT NULL  
                ) `;
        /*SELECT
        d.policyNo AS policyNo,
            i.serialNo,
            d.startDate AS startDate,
            d.`subject` AS `subject`,
            i.idName AS idName,
            i.idNo AS idNo,
            c.codeCname AS `status`,
            d.extend1 AS extend1,
            d.productId AS productId,
            d.endorseNo AS endorseNo,
            d.rcd_crt_time AS rcd_crt_time,
            d.rcd_mod_time AS rcd_mod_time
        FROM
        (
            (
                datawarehouse.orderdetail d
        JOIN datawarehouse.insured i
    ) JOIN product p
    ),code c
        WHERE
        (
            (d.orderNo = i.orderNo)
        AND (p.productId = d.productId)
        AND (i.insuredType = 2)
        AND c.codeCode = d.`status`
        AND c.codetype = 'PolicyStatus'
        AND d.policyNo is NOT NULL
    );*/
        if(keyword.length>18){
            sql=sql+"and policyNo = '"+keyword+"'";
        }else{
            if(isIncludeNumber(keyword)){
                sql=sql+"and idNo = '"+keyword+"'";
            }else{
                // sql=sql+"and idName like '"+keyword+"'";
                sql=sql+"and idName = '"+keyword+"'";
            }
        }
        sql=sql+"order by startDate";
        
        let policys=await global.dao.querySql(sql);

        if(policys.length>0){
            //存在保单信息，有可能是多条
            for(let i=0;i<policys.length;i++){
                let ret={
                    'policyInfo':null,
                    'claim':null
                }
                ret.policyInfo=policys[i];
                sql="select * from ods.claim where policyNo ='"+policys[i].policyNo+"'";
                sql=sql+"order by claimDate";
                let claim=await global.dao.querySql(sql);
                if(claim.length>0){
                    ret.claim=claim;
                }
                ret_json.body.push(ret);
            }
        }else{
            ret_json.head.error_code=1;
            ret_json.head.error_msg='无相关信息';
        }
        logger.error('=====返回结果 ');
        logger.error(ret_json);
        return ret_json;
    }catch(e){
        ret_json.head.error_code=10;
        ret_json.head.error_msg='发生内部错误:'+e.message;
        logger.error('=====出错结果 ');
        logger.error(ret_json);
        return ret_json;
    }

    
}
