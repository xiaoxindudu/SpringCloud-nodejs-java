package com.aibao.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.aibao.bean.User;
import com.aibao.fegin.BookFeignClient;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import java.util.HashMap;
import java.util.List;

/**
 * Created by wxh on 2018/08/08.
 */
@RestController
@Api(value="demo的class说明")
public class UserController {

	private Logger logger =  LogManager.getLogger(this.getClass());
	
    @Autowired
    private DiscoveryClient discoveryClient;

    @Autowired
    private  BookFeignClient bookFeignClient;

    private HashMap<String, User> users;

    public UserController() {
    	users = new HashMap<String, User>();
        int count = 100;
        while (count > 0) {
            User user = new User();
            user.setId(String.valueOf(count));
            user.setAge(String.valueOf(10 + (int)(Math.random()*10))); //10 - 20
            user.setUsername("user"+ count);
            users.put(String.valueOf(count), user);
            count--;
        }
    }
   
    //{"id":"1","username":"name","age":"18","uid":"11",	"userid":"yanyan","errcode":"0000","errmessage":"成功","flag":"1" }
    /**
     * Created by wxh on 2018/08/08.
     * 用户信息查询
     */
    @ResponseBody 
    @RequestMapping(value="/author", method=RequestMethod.POST,consumes = "application/json")
	@ApiOperation(value="demo服务", notes="demo接口的说明")
	@ApiImplicitParam(name = "User", value = "用户详细实体User", required = true, dataType = "User")
    public User getAuthor(@RequestBody User user) {
		logger.info("/author请求++++++++++++++++++++++调用开始");
    	List<User> users = bookFeignClient.findByUid(user);       
        if(users.size()>0) {
        	logger.info("/author请求++++++++++++++++++++++调用结束");
        	return users.get(0);
        }else {
        	logger.info("/author请求++++++++++++++++++++++调用失败");
        	return null;
        }
    }

    /**
     * 本地服务实例的信息
     * @return
     */
    @GetMapping("/info")
    public ServiceInstance showInfo() {
        ServiceInstance localServiceInstance = this.discoveryClient.getLocalServiceInstance();
        return localServiceInstance;
    }
}

