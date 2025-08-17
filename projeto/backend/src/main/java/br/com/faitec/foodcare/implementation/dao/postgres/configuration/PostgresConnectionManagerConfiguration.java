package br.com.faitec.foodcare.implementation.dao.postgres.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.sql.DataSource;
import java.sql.*;

@Configuration
public class PostgresConnectionManagerConfiguration {

    @Value("${spring.datasource.base.url}")
    private String databaseBaseUrl;
    @Value("${spring.datasource.name}")
    private String databaseName;
    @Value("${spring.datasource.username}")
    private String databaseUsername;
    @Value("${spring.datasource.password}")
    private String databasePassword;
    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Bean
    public DataSource dataSource() throws SQLException {

        final DataSource build = DataSourceBuilder.create()
                .url(databaseBaseUrl)
                .username(databaseUsername)
                .password(databasePassword)
                .build();

        final Connection connection = build.getConnection();

        createDataBaseIfNotExist(connection);

        return build;
    }

    private void createDataBaseIfNotExist(Connection connection) throws SQLException {
        final Statement statement = connection.createStatement();

        String sql = "SELECT COUNT(*) AS dbs ";
        sql += " FROM pg_catalog.pg_database ";
        sql += " WHERE lower(datname) = '" + databaseName +"' ;";

        ResultSet resultSet = statement.executeQuery(sql);

        if (resultSet.next() && resultSet.getInt("dbs") == 0){
            String createDbsql = "CREATE DATABASE " + databaseName + " WITH ";
            createDbsql += " OWNER = postgres ENCODING = 'UTF8' ";
            createDbsql += " CONNECTION LIMIT = -1";

            PreparedStatement preparedStatement = connection.prepareStatement(createDbsql);
            preparedStatement.execute();
            preparedStatement.close();
        }
        
        resultSet.close();
        statement.close();
    }

    @Bean
    @DependsOn("dataSource")
    public Connection getConnection() throws SQLException {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setJdbcUrl(databaseUrl);
        hikariConfig.setUsername(databaseUsername);
        hikariConfig.setPassword(databasePassword);

        return new HikariDataSource(hikariConfig).getConnection();
    }

}