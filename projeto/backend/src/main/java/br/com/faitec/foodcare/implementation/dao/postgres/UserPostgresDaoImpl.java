package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserPostgresDaoImpl implements UserDao {

    private static final Logger logger = Logger.getLogger(UserPostgresDaoImpl.class.getName());

    private final Connection connection;

    public UserPostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(UserModel entity) {
        logger.log(Level.INFO, "Preparando para adicionar o usuario no banco de dados");

        String sql = "INSERT INTO user_model(password, name, email, user_type, phone, is_admin, family_income, people_quantity, municipality_id) ";
        sql += " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            logger.log(Level.CONFIG, "Auto commit: OFF");
            connection.setAutoCommit(false);

            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);

            preparedStatement.setString(1, entity.getPassword());
            preparedStatement.setString(2, entity.getName());
            preparedStatement.setString(3, entity.getEmail());
            preparedStatement.setString(4, entity.getUserType().name());
            preparedStatement.setString(5, entity.getPhone());
            preparedStatement.setBoolean(6, entity.isAdmin());
            preparedStatement.setDouble(7, entity.getFamilyIncome());
            preparedStatement.setInt(8, entity.getPeopleQuantity());
            preparedStatement.setInt(9, entity.getMunicipalityId());

            preparedStatement.execute();
            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            int id = 0;
            if (resultSet.next()) {
                id = resultSet.getInt(1);
            }

            connection.commit();
            resultSet.close();
            preparedStatement.close();

            logger.log(Level.INFO, "Usuario adicionado com sucesso.");
            return id;

        } catch (SQLException e) {
            try {
                logger.log(Level.SEVERE, "Problema ao adicionar o usuario no banco de dados. Realizando Rollback");
                connection.rollback();
            } catch (SQLException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {
        logger.log(Level.INFO, "Preparando para remover o usuario.");

        String sql = "DELETE FROM user_model ";
        sql += " WHERE id = ? ;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            preparedStatement.execute();
            preparedStatement.close();

            logger.log(Level.INFO, "Usuario removido com sucesso.");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserModel findByid(int id) {
        final String sql = "SELECT * FROM user_model WHERE id = ? ;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                final int entityId = resultSet.getInt("id");
                final String name = resultSet.getString("name");
                final String email = resultSet.getString("email");
                final String password = resultSet.getString("password");
                final String phone = resultSet.getString("phone");
                final String auxUserType = resultSet.getString("user_type");
                final UserModel.UserType userType = UserModel.UserType.valueOf(auxUserType);
                final boolean isAdmin = resultSet.getBoolean("is_admin");
                final double familyIncome = resultSet.getDouble("family_income");
                final int peopleQuantity = resultSet.getInt("people_quantity");
                final int municipalityId = resultSet.getInt("municipality_id");

                final UserModel user = new UserModel();
                user.setId(entityId);
                user.setName(name);
                user.setEmail(email);
                user.setPassword(password);
                user.setPhone(phone);
                user.setUserType(userType);
                user.setAdmin(isAdmin);
                user.setFamilyIncome(familyIncome);
                user.setPeopleQuantity(peopleQuantity);
                user.setMunicipalityId(municipalityId);

                preparedStatement.close();
                resultSet.close();
                return user;
            }

            preparedStatement.close();
            resultSet.close();
            return null;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<UserModel> findAll() {
        final String sql = "SELECT * FROM user_model;";
        List<UserModel> users = new ArrayList<>();

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                final int id = resultSet.getInt("id");
                final String name = resultSet.getString("name");
                final String email = resultSet.getString("email");
                final String password = resultSet.getString("password");
                final String phone = resultSet.getString("phone");
                final String auxUserType = resultSet.getString("user_type");
                final UserModel.UserType userType = UserModel.UserType.valueOf(auxUserType);
                final boolean isAdmin = resultSet.getBoolean("is_admin");
                final double familyIncome = resultSet.getDouble("family_income");
                final int peopleQuantity = resultSet.getInt("people_quantity");
                final int municipalityId = resultSet.getInt("municipality_id");

                final UserModel user = new UserModel();
                user.setId(id);
                user.setName(name);
                user.setEmail(email);
                user.setPassword(password);
                user.setPhone(phone);
                user.setUserType(userType);
                user.setAdmin(isAdmin);
                user.setFamilyIncome(familyIncome);
                user.setPeopleQuantity(peopleQuantity);
                user.setMunicipalityId(municipalityId);

                users.add(user);
            }

            preparedStatement.close();
            resultSet.close();
            return users;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, UserModel entity) {
        String sql = "UPDATE user_model SET name = ?, phone = ?, family_income = ?, people_quantity = ?, municipality_id = ? ";
        sql += " WHERE id = ? ; ";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getPhone());
            preparedStatement.setDouble(3, entity.getFamilyIncome());
            preparedStatement.setInt(4, entity.getPeopleQuantity());
            preparedStatement.setInt(5, entity.getMunicipalityId());
            preparedStatement.setInt(6, id);

            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
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
        String sql = "UPDATE user_model SET password = ? ";
        sql += " WHERE id = ? ;";

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, newPassword);
            preparedStatement.setInt(2, id);

            preparedStatement.execute();
            preparedStatement.close();
            return true;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}