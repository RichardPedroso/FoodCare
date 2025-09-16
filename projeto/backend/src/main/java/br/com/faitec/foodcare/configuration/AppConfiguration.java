package br.com.faitec.foodcare.configuration;

import br.com.faitec.foodcare.implementation.dao.postgres.UserPostgresDaoImpl;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;


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
    public UserDao userDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.UserPostgresDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao municipalityDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.MunicipalityDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.category.CategoryDao categoryDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.CategoryDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.product.ProductDao productDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.ProductDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.donation.DonationDao donationDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.DonationDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.request.RequestDao requestDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.RequestDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao donationProductDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.DonationProductDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.service.basket.BasketManagementService basketManagementService(
            final br.com.faitec.foodcare.port.dao.product.ProductDao productDao,
            final br.com.faitec.foodcare.port.service.stock.StockService stockService,
            final br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao donationProductDao) {
        return new br.com.faitec.foodcare.implementation.service.basket.BasketManagementServiceImpl(productDao, stockService, donationProductDao);
    }

    @Bean
    public br.com.faitec.foodcare.port.dao.stock.StockDao stockDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.StockDaoImpl(connection);
    }

    @Bean
    public br.com.faitec.foodcare.port.service.stock.StockService stockService(final br.com.faitec.foodcare.port.dao.stock.StockDao stockDao) {
        return new br.com.faitec.foodcare.implementation.service.stock.StockServiceImpl(stockDao);
    }



    @Bean
    public OpenAPI customOpenApi(){
        return new OpenAPI().info(new Info().title("FoodCare API").version("0.0.1").description("API para gerenciamento de doação de alimentos"));
    }

}



