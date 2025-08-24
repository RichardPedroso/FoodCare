package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.dao.municipality.MunicipalityDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MunicipalityDaoImpl implements MunicipalityDao {

    private final Connection connection;

    public MunicipalityDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Municipality entity) {
        String sql = "INSERT INTO municipality(name) VALUES (?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getCity());
            preparedStatement.execute();
            
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
                municipality.setCity(resultSet.getString("name"));
                
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
                municipality.setCity(resultSet.getString("name"));
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
        String sql = "UPDATE municipality SET name = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getCity());
            preparedStatement.setInt(2, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Municipality> findByCity(String city) {
        String sql = "SELECT * FROM municipality WHERE LOWER(name) LIKE LOWER(?)";
        List<Municipality> municipalities = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, "%" + city + "%");
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Municipality municipality = new Municipality();
                municipality.setId(resultSet.getInt("id"));
                municipality.setCity(resultSet.getString("name"));
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