package com.aibao.controller;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aibao.entity.BatchDataImportEntity;
import com.aibao.fegin.BatchDataImportFegin;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

/**
 * Created by wxh on 2018/08/08.
 */
@CrossOrigin
@RestController
@Api(value = "excel数据导入",tags={"保司和渠道excel数据导入接口"})
public class BatchDataImportController {
	private Logger logger = LogManager.getLogger(this.getClass());

	@Autowired
	private BatchDataImportFegin batchDataImportFegin;

	/**
	 * Created by wxh on 2018/08/08. 批量导入
	 */
	@ResponseBody
	@RequestMapping(value = "/acc_batchDataImportService", method = RequestMethod.POST)
	@ApiOperation(value = "数据批量导入", notes = "根据selectType 1：渠道数据导入 2：保险公司数据导入")
	@ApiImplicitParam(name = "BatchDataImportBean", value = "批量导入对象", required = true, dataType = "User")
	public BatchDataImportEntity getAuthor(@RequestParam("file") MultipartFile file, String selectType, String userId) {
		logger.info("/acc_batchDataImportService请求++++++++++++++++++++++调用开始");

		BatchDataImportEntity batchDataImportBean = new BatchDataImportEntity();
		BatchDataImportEntity batchDataImport=null;
		String fileName = file.getOriginalFilename();
		// 获取文件后缀
		String prefix = fileName.substring(fileName.lastIndexOf("."));
		File excelFile = null;
		String filePath = null;
		try {
			// 文件先暂时保存在 服务器上，以时间为文件名称
			File file2 = new File("C:\\temp");
			//File file2 = new File("/opt/project/workspace/temp");
			excelFile = File.createTempFile(String.valueOf(new Date().getTime()), prefix,file2);
			// 获取文件路径
			filePath = excelFile.getPath();
			file.transferTo(excelFile);			
			batchDataImportBean.setFile(filePath);
			batchDataImportBean.setUserId(userId);
			batchDataImportBean.setSelectType(selectType);
			batchDataImport= batchDataImportFegin.batchDataImport(batchDataImportBean);
			logger.info("/acc_batchDataImportService请求++++++++++++++++++++++调用结束");
			// 程序结束时，删除临时文件
			deleteFile(excelFile);
			return batchDataImport;
		} catch (IOException e) {
			e.printStackTrace();
			return batchDataImport;
		} catch (IllegalStateException e) {
			e.printStackTrace();
			return batchDataImport;
		}
	}

	/**
	 * 删除
	 * 
	 * @param files
	 */
	private void deleteFile(File... files) {
		for (File file : files) {
			if (file.exists()) {
				file.delete();
			}
		}
	}

}
