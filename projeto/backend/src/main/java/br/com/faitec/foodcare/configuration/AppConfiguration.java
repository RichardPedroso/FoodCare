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

/**
 * Classe de configuração do Spring que define os beans da aplicação.
 * Implementa o padrão de Injeção de Dependência para DAOs e Services.
 */
@Configuration
public class AppConfiguration {
    private final Environment environment;

    /**
     * Construtor que injeta o Environment do Spring.
     * Exibe os perfis ativos da aplicação para debug.
     */
    public AppConfiguration(Environment environment) {
        this.environment = environment;

        // Debug: exibe os perfis ativos (dev, prod, test, etc.)
        System.out.println("------");
        System.out.println(Arrays.toString(environment.getActiveProfiles()));
        System.out.println("------");
    }

    // ===== CONFIGURAÇÃO DOS DAOs (Data Access Objects) =====
    
    /** Bean para acesso aos dados de usuários no PostgreSQL */
    @Bean
    public UserDao userDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.UserPostgresDaoImpl(connection);
    }

    /** Bean para acesso aos dados de municípios no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao municipalityDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.MunicipalityDaoImpl(connection);
    }

    /** Bean para acesso aos dados de categorias no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.category.CategoryDao categoryDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.CategoryDaoImpl(connection);
    }

    /** Bean para acesso aos dados de produtos no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.product.ProductDao productDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.ProductDaoImpl(connection);
    }

    /** Bean para acesso aos dados de doações no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.donation.DonationDao donationDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.DonationDaoImpl(connection);
    }

    /** Bean para acesso aos dados de solicitações no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.request.RequestDao requestDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.RequestDaoImpl(connection);
    }

    /** Bean para acesso aos dados de produtos de doação no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao donationProductDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.DonationProductDaoImpl(connection);
    }

    /** Bean para acesso aos dados de estoque no PostgreSQL */
    @Bean
    public br.com.faitec.foodcare.port.dao.stock.StockDao stockDao(final Connection connection) {
        return new br.com.faitec.foodcare.implementation.dao.postgres.StockDaoImpl(connection);
    }

    // ===== CONFIGURAÇÃO DOS SERVICES (Serviços de Negócio) =====
    
    /** 
     * Bean para gerenciamento de estoque.
     * Depende do StockDao para operações de banco de dados.
     */
    @Bean
    public br.com.faitec.foodcare.port.service.stock.StockService stockService(final br.com.faitec.foodcare.port.dao.stock.StockDao stockDao) {
        return new br.com.faitec.foodcare.implementation.service.stock.StockServiceImpl(stockDao);
    }

    /** 
     * Bean para gerenciamento de cestas de produtos.
     * Depende de ProductDao, StockService e DonationProductDao.
     */
    @Bean
    public br.com.faitec.foodcare.port.service.basket.BasketManagementService basketManagementService(
            final br.com.faitec.foodcare.port.dao.product.ProductDao productDao,
            final br.com.faitec.foodcare.port.service.stock.StockService stockService,
            final br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao donationProductDao) {
        return new br.com.faitec.foodcare.implementation.service.basket.BasketManagementServiceImpl(productDao, stockService, donationProductDao);
    }


    // ===== CONFIGURAÇÃO DA DOCUMENTAÇÃO API =====
    
    /** 
     * Bean para configuração da documentação Swagger/OpenAPI.
     * Define título, versão e descrição da API FoodCare.
     */
    @Bean
    public OpenAPI customOpenApi(){
        return new OpenAPI().info(new Info().title("FoodCare API").version("0.0.1").description("API para gerenciamento de doação de alimentos"));
    }

}



