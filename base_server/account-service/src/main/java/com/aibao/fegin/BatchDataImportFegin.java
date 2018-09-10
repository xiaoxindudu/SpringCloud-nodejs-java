package com.aibao.fegin;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import com.aibao.entity.BatchDataImportEntity;

/**
 * Created by wxh on 2018/08/08.
 */

@FeignClient(name = "sidecar-server")
public interface BatchDataImportFegin {
	
	@RequestMapping(value="/acc_batchDataImportService" ,method = RequestMethod.POST)
    public BatchDataImportEntity batchDataImport(@RequestBody BatchDataImportEntity batchDataImportBean);

}
