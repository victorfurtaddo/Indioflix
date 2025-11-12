package org.Indioflix.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Habilita a segurança web do Spring Security
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desativa a proteção CSRF, que é necessária para requisições POST/PUT sem tokens
            .csrf(AbstractHttpConfigurer::disable) 
            
            // Configura a autorização de requisições
            .authorizeHttpRequests(authorize -> authorize
                // Permite acesso irrestrito a TODOS os endpoints sob /api/
                .requestMatchers("/api/**").permitAll() 
                // Qualquer outra requisição requer autenticação
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}