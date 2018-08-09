package com.aibao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.sidecar.EnableSidecar;

/**
 * Created by wxh on 2018/08/08.
 * Sidecar服务启动
 */
@SpringBootApplication
@EnableSidecar
public class SidecarApplication {

	public static void main(String[] args) {
		SpringApplication.run(SidecarApplication.class, args);
	}
}
