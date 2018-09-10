package com.aibao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Created by wxh on 2018/08/08.
 * 接口服务启动
 */
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
@EnableFeignClients
public class AccountServiceApplication {
	private static Logger logger = LogManager.getLogger(AccountServiceApplication.class);
	public static void main(String[] args) {
		logger.info("Start...");
		SpringApplication.run(AccountServiceApplication.class, args);
		
	
	}
}
