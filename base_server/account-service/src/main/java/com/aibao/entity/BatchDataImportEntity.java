package com.aibao.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
@ApiModel(value="BatchDataImportBean对象",description="数据导入对象")
public class BatchDataImportEntity extends BaseEntity {

	@ApiModelProperty(value="上传成功条数",name="uplodaNum",example="100")
	private String uplodaNum;
	 
	@ApiModelProperty(value = "上传文件",name="file",required = true)
	private String file;
	
	@ApiModelProperty(value = "上传文件类型",name="selectType",required = true,example="1")
	private String selectType;

	public String getUplodaNum() {
		return uplodaNum;
	}

	public void setUplodaNum(String uplodaNum) {
		this.uplodaNum = uplodaNum;
	}

	public String getFile() {
		return file;
	}

	public void setFile(String file) {
		this.file = file;
	}

	public String getSelectType() {
		return selectType;
	}

	public void setSelectType(String selectType) {
		this.selectType = selectType;
	}

}
