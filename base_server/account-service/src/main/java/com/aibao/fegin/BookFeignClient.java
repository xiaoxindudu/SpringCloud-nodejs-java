package com.aibao.fegin;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.aibao.bean.User;

import java.util.List;

/**
 * Created by wxh on 2018/08/08.
 */

@FeignClient(name = "sidecar-server")
public interface BookFeignClient {
	
	 @RequestMapping(value="/demoService" ,method = RequestMethod.POST)
    public List<User> findByUid(@RequestBody User user);
}
