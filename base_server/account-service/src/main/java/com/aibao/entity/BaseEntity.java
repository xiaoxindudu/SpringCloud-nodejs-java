package com.aibao.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by wxh on 2018/08/08.
 */
@ApiModel(value = "Base", description = "系统基础参数对象")
public class BaseEntity {
	// 操作用户ID
	@ApiModelProperty(value = "操作用户userId", name = "userId", example = "sunwukong")
	private String userId;
	// 请求标识
	@ApiModelProperty(value = "请求标识", name = "flag", example = "1")
	private String flag;
	// 请求业务系统
	@ApiModelProperty(value = "请求业务系统", name = "businessId", example = "BX00001")
	private String businessId;
	// 请求功能模块
	@ApiModelProperty(value = "请求功能模块", name = "uplodaNum", example = "BXTK0001")
	private String moduleId;
	// 请求时间
	@ApiModelProperty(value = "请求时间", name = "requestTime", example = "2018-08-08 12:12:12 666 ")
	private String requestTime;
	// 请求返回码
	@ApiModelProperty(value = "请求返回码", name = "errorCode", example = "0000")
	private String errorCode;
	// 请求返回消息
	@ApiModelProperty(value = "请求返回消息", name = "errorMessage", example = "成功")
	private String errorMessage;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getBusinessId() {
		return businessId;
	}

	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}

	public String getModuleId() {
		return moduleId;
	}

	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}

	public String getRequestTime() {
		return requestTime;
	}

	public void setRequestTime(String requestTime) {
		this.requestTime = requestTime;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

}
