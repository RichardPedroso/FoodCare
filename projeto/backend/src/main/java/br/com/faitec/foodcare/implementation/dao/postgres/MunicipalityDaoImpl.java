package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementação PostgreSQL do DAO para municípios.
 * Gerencia informações de endereço e localização na tabela municipality.
 */
public class MunicipalityDaoImpl implements MunicipalityDao {

    private final Connection connection;

    /** Construtor que recebe a conexão com o banco PostgreSQL */
    public MunicipalityDaoImpl(Connection connection) {
        this.connection = connection;
    }

    /** 
     * Cria um novo município com informações completas de endereço.
     * Inclui rua, número, bairro, cidade e CEP.
     */
    @Override
    public int create(Municipality entity) {
        String sql = "INSERT INTO municipality(street, number, neighborhood, city, zip_code) VALUES (?, ?, ?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getStreet());
            preparedStatement.setString(2, entity.getNumber());
            preparedStatement.setString(3, entity.getNeighborhood());
            preparedStatement.setString(4, entity.getCity());
            preparedStatement.setString(5, entity.getZipCode());
            preparedStatement.execute();
            
            // Recupera o ID gerado automaticamente
            ResultSet resultSet = preparedStatement.getGeneratedKeys();
            int id = 0;
            if (resultSet.next()) {
                id = resultSet.getInt(1);
            }
            
            resultSet.close();
            preparedStatement.close();
            return id;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {
        String sql = "DELETE FROM municipality WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Municipality findByid(int id) {
        String sql = "SELECT * FROM municipality WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                Municipality municipality = new Municipality();
                municipality.setId(resultSet.getInt("id"));
                municipality.setStreet(resultSet.getString("street"));
                municipality.setNumber(resultSet.getString("number"));
                municipality.setNeighborhood(resultSet.getString("neighborhood"));
                municipality.setCity(resultSet.getString("city"));
                municipality.setZipCode(resultSet.getString("zip_code"));
                
                resultSet.close();
                preparedStatement.close();
                return municipality;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Municipality> findAll() {
        String sql = "SELECT * FROM municipality";
        List<Municipality> municipalities = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Municipality municipality = new Municipality();
                municipality.setId(resultSet.getInt("id"));
                municipality.setStreet(resultSet.getString("street"));
                municipality.setNumber(resultSet.getString("number"));
                municipality.setNeighborhood(resultSet.getString("neighborhood"));
                municipality.setCity(resultSet.getString("city"));
                municipality.setZipCode(resultSet.getString("zip_code"));
                municipalities.add(municipality);
            }
            
            resultSet.close();
            preparedStatement.close();
            return municipalities;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, Municipality entity) {
        String sql = "UPDATE municipality SET street = ?, number = ?, neighborhood = ?, city = ?, zip_code = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getStreet());
            preparedStatement.setString(2, entity.getNumber());
            preparedStatement.setString(3, entity.getNeighborhood());
            preparedStatement.setString(4, entity.getCity());
            preparedStatement.setString(5, entity.getZipCode());
            preparedStatement.setInt(6, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** 
     * Busca municípios por nome da cidade (busca parcial, case-insensitive).
     * Permite encontrar cidades mesmo com digitação parcial.
     */
    @Override
    public List<Municipality> findByCity(String city) {
        String sql = "SELECT * FROM municipality WHERE LOWER(city) LIKE LOWER(?)";
        List<Municipality> municipalities = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, "%" + city + "%");  // Busca parcial
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Municipality municipality = new Municipality();
                municipality.setId(resultSet.getInt("id"));
                municipality.setStreet(resultSet.getString("street"));
                municipality.setNumber(resultSet.getString("number"));
                municipality.setNeighborhood(resultSet.getString("neighborhood"));
                municipality.setCity(resultSet.getString("city"));
                municipality.setZipCode(resultSet.getString("zip_code"));
                municipalities.add(municipality);
            }
            
            resultSet.close();
            preparedStatement.close();
            return municipalities;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}