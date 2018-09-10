package com.aibao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;  
  
@Configuration
@EnableSwagger2
@ConditionalOnClass(name = { "javax.servlet.ServletContext" }) // 适配Spring Cloud Api Gateway，不装载Swagger
public class SwaggerConfig { 
	 @Value("${spring.application.name}")
	    private String serviceName;

	    @Value("${swagger.service.base.package:com.aibao.controller}")
	    private String basePackage;

	    @Value("${swagger.service.description:核算中心API}")
	    private String description;

	    @Value("${swagger.service.version:1.0.0}")
	    private String version;

	    @Value("${swagger.service.license.name:Apache License 2.0}")
	    private String license;

	    @Value("${swagger.service.license.url:http://www.apache.org/licenses/LICENSE-2.0}")
	    private String licenseUrl;

	    @Value("${swagger.service.contact.name:wxh}")
	    private String contactName;

	    @Value("${swagger.service.contact.url:}")
	    private String contactUrl;

	    @Value("${swagger.service.contact.email:28782979@qq.com}")
	    private String contactEmail;
	@Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage(basePackage)) // 扫描该包下的所有需要在Swagger中展示的API，@ApiIgnore注解标注的除外
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title(serviceName)
                .description(description)
                .version(version)
                .license(license)
                .licenseUrl(licenseUrl)
                .contact(new Contact(contactName, contactUrl, contactEmail))
                .build();
    }

    // 解决跨域问题
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders("*")
                .allowedMethods("*")
                .allowedOrigins("*");
    }
  
}