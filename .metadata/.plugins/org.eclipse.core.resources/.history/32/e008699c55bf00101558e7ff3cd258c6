package org.Indioflix.Config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Indioflix API - Catálogo Pessoal de Filmes")
                .version("v1.0")
                .description("API RESTful para gerenciar um catálogo pessoal de filmes e séries assistidos.")
                .license(new License().name("Apache 2.0").url("http://springdoc.org"))
            );
    }
}
