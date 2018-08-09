
insert into aibaoxian.sevicemap (port,servicemode,detail,interfacemode) values ('8905','basemanage','业务管理系统','0') ;

-- 添加视图
CREATE ALGORITHM = UNDEFINED DEFINER = `aibaoxian`@`%` SQL SECURITY DEFINER VIEW `sumproducttotal` AS SELECT
	`yp`.`productId` AS `productId`,
	sum(`yp`.`countPolicy`) AS `countPolicy`,
	sum(`yp`.`sumPrem`) AS `sumPrem`,
	sum(`yp`.`countWithdraw`) AS `countWithdraw`,
	(
		sum(`yp`.`sumPrem`) - sum(`yp`.`countWithdraw`)
	) AS `sumPreimTotal`,
	sum(`yp`.`sumWithdrawPrem`) AS `sumWithdrawprem`,
	sum(`yp`.`sumOutcome`) AS `sumOutcome`,
	sum(`yp`.`sumIncome`) AS `sumIncome`,
	sum(`yp`.`sumClaimPrem`) AS `sumClaimPrem`
FROM
	`ods`.`ywcountreport` `yp`
WHERE
	(
		date_format(`yp`.`dataDate`, '%y') = date_format(now(), '%y')
	)
GROUP BY
	`yp`.`productId` ;


insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('01','待提交','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('02','待验收','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('03','待发布','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('04','待上线','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('05','已上线','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('06','已下线','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('07','终止','channelStatus','渠道状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('08','全部','channelStatus','渠道状态');


insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('01','待提交','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('02','待验收','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('03','待发布','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('04','待上线','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('05','已上线','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('06','已下线','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('07','终止','providerStatus','落地机构状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('08','全部','providerStatus','落地机构状态');


insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('01','草稿','productStatus','产品状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('02','开发中','productStatus','产品状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('03','已上线','productStatus','产品状态');
insert into basemanage.code (codeCode,codeCname,codetype,codeTypeName) values('04','已下线','productStatus','产品状态');


/*
渠道与落地机构
01:待提交(提交开发)
02:待验收（验收） 
03：待发布（发布）
04：待上线（上线）
05：已上线（下线）
06：已下线 
07：终止
*/

INSERT INTO `code` VALUES ('01', NULL, '待提交(提交开发)', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:15', '2017-12-26 22:57:15', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('02', NULL, '待验收（验收） ', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:15', '2017-12-26 22:57:15', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('03', NULL, '待发布（发布）', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('04', NULL, '待上线（上线）', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('05', NULL, '已上线（下线）', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('06', NULL, '已下线 ', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('07', NULL, '终止', 'channelOperateStatus', '渠道操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');

INSERT INTO `code` VALUES ('01', NULL, '待提交(提交开发)', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:15', '2017-12-26 22:57:15', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('02', NULL, '待验收（验收） ', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:15', '2017-12-26 22:57:15', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('03', NULL, '待发布（发布）', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('04', NULL, '待上线（上线）', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('05', NULL, '已上线（下线）', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('06', NULL, '已下线 ', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
INSERT INTO `code` VALUES ('07', NULL, '终止', 'providerOperateStatus', '落地机构操作状态', NULL, NULL, NULL, NULL, '2017-12-26 22:57:16', '2017-12-26 22:57:16', '9999-12-31 00:00:00');
