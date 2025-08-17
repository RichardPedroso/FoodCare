package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class UserPostgresDaoImpl implements UserDao {

    private final Connection connection;

    public UserPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(UserModel entity) {
        String sql = "INSERT INTO user_model(password, name, email, user_type) VALUES (?, ?, ?, ?)";

        try {
            connection.setAutoCommit(false);
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setString(1, entity.getPassword());
            preparedStatement.setString(2, entity.getName());
            preparedStatement.setString(3, entity.getEmail());
            preparedStatement.setString(4, entity.getUserType().name());

            preparedStatement.execute();
            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            int id = 0;
            if(resultSet.next()){
                id = resultSet.getInt(1);
            }

            connection.commit();
            resultSet.close();
            preparedStatement.close();

            return id;

        } catch (SQLException e) {
            try {
                connection.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public UserModel findByid(int id) {
        return null;
    }

    @Override
    public List<UserModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, UserModel entity) {

    }

    @Override
    public UserModel findByEmail(String email) {
        String sql = "SELECT id, name, email, password, phone, user_type, is_admin, family_income, people_quantity, municipality_id FROM user_model WHERE email = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, email);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if(resultSet.next()) {
                UserModel user = new UserModel();
                user.setId(resultSet.getInt("id"));
                user.setName(resultSet.getString("name"));
                user.setEmail(resultSet.getString("email"));
                user.setPassword(resultSet.getString("password"));
                user.setPhone(resultSet.getString("phone"));
                user.setUserType(UserModel.UserType.valueOf(resultSet.getString("user_type")));
                user.setAdmin(resultSet.getBoolean("is_admin"));
                user.setFamilyIncome(resultSet.getDouble("family_income"));
                user.setPeopleQuantity(resultSet.getInt("people_quantity"));
                user.setMunicipalityId(resultSet.getInt("municipality_id"));
                
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
        return false;
    }
}