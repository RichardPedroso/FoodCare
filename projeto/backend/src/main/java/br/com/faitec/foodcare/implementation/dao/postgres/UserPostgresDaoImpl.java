package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserPostgresDaoImpl implements UserDao {

    private final Connection connection;

    public UserPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(UserModel entity) {
        String sql = "INSERT INTO user_model(name, email, password, phone, user_type, family_income, people_quantity, municipality_id, has_children) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getEmail());
            preparedStatement.setString(3, entity.getPassword());
            preparedStatement.setString(4, entity.getPhone());
            preparedStatement.setString(5, entity.getUserType().name());
            preparedStatement.setDouble(6, entity.getFamilyIncome());
            preparedStatement.setInt(7, entity.getPeopleQuantity());
            preparedStatement.setInt(8, entity.getMunicipalityId());
            preparedStatement.setBoolean(9, entity.isHasChildren());
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
        String sql = "DELETE FROM user_model WHERE id = ?";
        
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
    public UserModel findByid(int id) {
        String sql = "SELECT * FROM user_model WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                UserModel user = new UserModel();
                user.setId(resultSet.getInt("id"));
                user.setName(resultSet.getString("name"));
                user.setEmail(resultSet.getString("email"));
                user.setPassword(resultSet.getString("password"));
                user.setPhone(resultSet.getString("phone"));
                user.setUserType(UserModel.UserType.valueOf(resultSet.getString("user_type")));
                user.setFamilyIncome(resultSet.getDouble("family_income"));
                user.setPeopleQuantity(resultSet.getInt("people_quantity"));
                user.setMunicipalityId(resultSet.getInt("municipality_id"));
                user.setHasChildren(resultSet.getBoolean("has_children"));
                
                resultSet.close();
                preparedStatement.close();
                return user;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<UserModel> findAll() {
        String sql = "SELECT * FROM user_model";
        List<UserModel> users = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                UserModel user = new UserModel();
                user.setId(resultSet.getInt("id"));
                user.setName(resultSet.getString("name"));
                user.setEmail(resultSet.getString("email"));
                user.setPassword(resultSet.getString("password"));
                user.setPhone(resultSet.getString("phone"));
                user.setUserType(UserModel.UserType.valueOf(resultSet.getString("user_type")));
                user.setFamilyIncome(resultSet.getDouble("family_income"));
                user.setPeopleQuantity(resultSet.getInt("people_quantity"));
                user.setMunicipalityId(resultSet.getInt("municipality_id"));
                user.setHasChildren(resultSet.getBoolean("has_children"));
                users.add(user);
            }
            
            resultSet.close();
            preparedStatement.close();
            return users;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, UserModel entity) {
        String sql = "UPDATE user_model SET name = ?, email = ?, password = ?, phone = ?, user_type = ?, family_income = ?, people_quantity = ?, municipality_id = ?, has_children = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getEmail());
            preparedStatement.setString(3, entity.getPassword());
            preparedStatement.setString(4, entity.getPhone());
            preparedStatement.setString(5, entity.getUserType().name());
            preparedStatement.setDouble(6, entity.getFamilyIncome());
            preparedStatement.setInt(7, entity.getPeopleQuantity());
            preparedStatement.setInt(8, entity.getMunicipalityId());
            preparedStatement.setBoolean(9, entity.isHasChildren());
            preparedStatement.setInt(10, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserModel findByEmail(String email) {
        String sql = "SELECT * FROM user_model WHERE email = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, email);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                UserModel user = new UserModel();
                user.setId(resultSet.getInt("id"));
                user.setName(resultSet.getString("name"));
                user.setEmail(resultSet.getString("email"));
                user.setPassword(resultSet.getString("password"));
                user.setPhone(resultSet.getString("phone"));
                user.setUserType(UserModel.UserType.valueOf(resultSet.getString("user_type")));
                user.setFamilyIncome(resultSet.getDouble("family_income"));
                user.setPeopleQuantity(resultSet.getInt("people_quantity"));
                user.setMunicipalityId(resultSet.getInt("municipality_id"));
                user.setHasChildren(resultSet.getBoolean("has_children"));
                
                resultSet.close();
                preparedStatement.close();
                return user;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        String sql = "UPDATE user_model SET password = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, newPassword);
            preparedStatement.setInt(2, id);
            int rowsAffected = preparedStatement.executeUpdate();
            preparedStatement.close();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}