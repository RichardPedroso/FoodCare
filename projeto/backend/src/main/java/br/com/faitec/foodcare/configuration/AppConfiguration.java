package br.com.faitec.foodcare.configuration;


import br.com.faitec.foodcare.port.dao.user.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@Configuration
public class AppConfiguration {
    private final Environment environment;

    public AppConfiguration(Environment environment) {

        this.environment = environment;

        System.out.println("---------");
        System.out.println(Arrays.toString(environment.getActiveProfiles()));
        System.out.println("---------");
    }



}



