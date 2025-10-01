package br.com.faitec.foodcare.implementation.dao.postgres.configuration;

import br.com.faitec.foodcare.port.service.tools.ResourceFileService;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.Arrays;

/**
 * Configuração do gerenciador de conexões PostgreSQL.
 * Responsável por criar o banco de dados, configurar conexões e executar scripts de inicialização.
 */
@Configuration
public class PostgresConnectionManagerConfiguration {

    // Configurações do banco de dados injetadas do application.properties
    @Value("${spring.datasource.base.url}")
    private String databaseBaseUrl;  // URL base do PostgreSQL (sem nome do banco)
    @Value("${spring.datasource.name}")
    private String databaseName;     // Nome do banco de dados
    @Value("${spring.datasource.username}")
    private String databaseUsername; // Usuário do banco
    @Value("${spring.datasource.password}")
    private String databasePassword; // Senha do banco
    @Value("${spring.datasource.url}")
    private String databaseUrl;      // URL completa com nome do banco

    @Autowired
    private ResourceFileService resourceFileService;

    private final Environment environment;

    public PostgresConnectionManagerConfiguration(Environment environment) {
        this.environment = environment;
    }

    /**
     * Cria o DataSource principal da aplicação.
     * Conecta na URL base e cria o banco de dados se não existir.
     */
    @Bean
    public DataSource dataSource() throws SQLException {
        final DataSource build = DataSourceBuilder.create()
                .url(databaseBaseUrl)
                .username(databaseUsername)
                .password(databasePassword)
                .build();

        final Connection connection = build.getConnection();
        createDataBaseIfNotExist(connection);  // Cria o banco se não existir
        return build;
    }

    /**
     * Verifica se o banco de dados existe e o cria caso não exista.
     * Consulta o catálogo do PostgreSQL para verificar a existência.
     */
    private void createDataBaseIfNotExist(Connection connection) throws SQLException {
        final Statement statement = connection.createStatement();

        // Consulta para verificar se o banco existe
        String sql = "SELECT COUNT(*) AS dbs ";
        sql += " FROM pg_catalog.pg_database ";
        sql += " WHERE lower(datname) = '" + databaseName.toLowerCase() + "' ;";

        ResultSet resultSet = statement.executeQuery(sql);

        // Se o banco não existir, cria um novo
        boolean dbExists = resultSet.next();
        if (!dbExists || resultSet.getInt("dbs") == 0) {
            String createDbSql = " CREATE DATABASE " + databaseName + " WITH ";
            createDbSql += " OWNER = postgres ENCODING = 'UTF8' ";
            createDbSql += " CONNECTION LIMIT = -1; ";

            PreparedStatement preparedStatement = connection.prepareStatement(createDbSql);
            preparedStatement.execute();
            preparedStatement.close();
        }
        
        resultSet.close();
        statement.close();
    }

    /**
     * Cria uma conexão otimizada usando HikariCP.
     * Conecta diretamente no banco de dados específico (não na URL base).
     */
    @Bean
    @DependsOn("dataSource")
    public Connection getConnection() throws SQLException {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(databaseUrl);      // URL completa com nome do banco
        hikariConfig.setUsername(databaseUsername);
        hikariConfig.setPassword(databasePassword);

        return new HikariDataSource(hikariConfig).getConnection();
    }

    /**
     * Executa os scripts de inicialização do banco de dados.
     * Cria as tabelas e insere dados iniciais a partir de arquivos SQL.
     */
    @Bean
    @DependsOn("getConnection")
    public boolean createTableAndInsertData() throws SQLException, IOException {
        Connection connection = getConnection();

        final String basePath = "foodcare-db-scripts";

        // Executa script de criação de tabelas
        final String createTableSql = resourceFileService.read(basePath + "/create-tables-postgres.sql");
        PreparedStatement createStatement = connection.prepareStatement(createTableSql);
        createStatement.executeUpdate();
        createStatement.close();

        // Executa script de inserção de dados iniciais baseado no perfil
        final String insertDataSql = resourceFileService.read(basePath + getInsertScript());
        final PreparedStatement insertStatement = connection.prepareStatement(insertDataSql);
        insertStatement.execute();
        insertStatement.close();

        return true;
    }

    /**
     * Retorna o script de inserção baseado no perfil ativo.
     * Perfil "basic" usa dados básicos, outros perfis usam dados com JWT.
     */
    public String getInsertScript() {
        boolean isBasicProfile = Arrays.asList(
                environment.getActiveProfiles()
        ).contains("basic");
        
        if (isBasicProfile) {
            return "/insert-data-postgres-basic.sql";
        }
        return "/insert-data-postgres-jwt.sql";
    }

}