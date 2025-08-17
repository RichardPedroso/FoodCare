package br.com.faitec.foodcare.configuration;


import br.com.faitec.foodcare.implementation.dao.postgres.UserPostgresDaoImpl;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.sql.Connection;
import java.util.Arrays;

@Configuration
public class AppConfiguration {
    private final Environment environment;

    public AppConfiguration(Environment environment) {
        this.environment = environment;

        System.out.println("------");
        System.out.println(Arrays.toString(environment.getActiveProfiles()));
        System.out.println("------");
    }

    @Bean
    public UserDao getUserFakeDao(final Connection connection) {
        //return new UserFakeDaoImpl();
        return new UserPostgresDaoImpl(connection);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

}



