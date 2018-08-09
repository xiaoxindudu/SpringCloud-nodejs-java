

目录
0 起动文件  baseManage.js
1 服务库端口配置   8905
2 使用数据库 配置



0 起动文件  baseManage.js

    这个设置在起动文件里面
    let port=process.argv[2];

    起动读取 环境文件
    \base\env.js



1 服务库端口配置   8905
    \base\conf\dev.js
    insert into aibaoxian.sevicemap (port,servicemode,detail,interfacemode) values ('8905','basemanage','业务管理系统','0') ;

2 使用数据库 配置
    

