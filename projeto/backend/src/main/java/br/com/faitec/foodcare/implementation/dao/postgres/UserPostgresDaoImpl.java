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
        String sql = "INSERT INTO user_model(name, email, password, phone, user_type, family_income, people_quantity, municipality_id, has_children, documents, images, able) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
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
            
            if (entity.getDocuments() != null) {
                preparedStatement.setArray(10, connection.createArrayOf("text", entity.getDocuments().toArray()));
            } else {
                preparedStatement.setNull(10, java.sql.Types.ARRAY);
            }
            
            if (entity.getImages() != null) {
                preparedStatement.setArray(11, connection.createArrayOf("text", entity.getImages().toArray()));
            } else {
                preparedStatement.setNull(11, java.sql.Types.ARRAY);
            }
            
            if (entity.getAble() != null) {
                preparedStatement.setBoolean(12, entity.getAble());
            } else {
                preparedStatement.setNull(12, java.sql.Types.BOOLEAN);
            }
            
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
                UserModel user = mapResultSetToUser(resultSet);
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
                UserModel user = mapResultSetToUser(resultSet);
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
        String sql = "UPDATE user_model SET name = ?, email = ?, password = ?, phone = ?, user_type = ?, family_income = ?, people_quantity = ?, municipality_id = ?, has_children = ?, documents = ?, images = ?, able = ? WHERE id = ?";
        
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
            
            if (entity.getDocuments() != null) {
                preparedStatement.setArray(10, connection.createArrayOf("text", entity.getDocuments().toArray()));
            } else {
                preparedStatement.setNull(10, java.sql.Types.ARRAY);
            }
            
            if (entity.getImages() != null) {
                preparedStatement.setArray(11, connection.createArrayOf("text", entity.getImages().toArray()));
            } else {
                preparedStatement.setNull(11, java.sql.Types.ARRAY);
            }
            
            if (entity.getAble() != null) {
                preparedStatement.setBoolean(12, entity.getAble());
            } else {
                preparedStatement.setNull(12, java.sql.Types.BOOLEAN);
            }
            
            preparedStatement.setInt(13, id);
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
                UserModel user = mapResultSetToUser(resultSet);
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

    @Override
    public List<UserModel> findByUserType(UserModel.UserType userType) {
        String sql = "SELECT * FROM user_model WHERE user_type = ?";
        List<UserModel> users = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, userType.name());
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                UserModel user = mapResultSetToUser(resultSet);
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
    public List<UserModel> findByAbleStatus(Boolean able) {
        String sql = "SELECT * FROM user_model WHERE able = ? OR (able IS NULL AND ? IS NULL)";
        List<UserModel> users = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            if (able != null) {
                preparedStatement.setBoolean(1, able);
                preparedStatement.setBoolean(2, false);
            } else {
                preparedStatement.setNull(1, java.sql.Types.BOOLEAN);
                preparedStatement.setBoolean(2, true);
            }
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                UserModel user = mapResultSetToUser(resultSet);
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
    public boolean updateAbleStatus(int userId, Boolean able) {
        String sql = "UPDATE user_model SET able = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            if (able != null) {
                preparedStatement.setBoolean(1, able);
            } else {
                preparedStatement.setNull(1, java.sql.Types.BOOLEAN);
            }
            preparedStatement.setInt(2, userId);
            int rowsAffected = preparedStatement.executeUpdate();
            preparedStatement.close();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<UserModel> searchByName(String name) {
        String sql = "SELECT * FROM user_model WHERE LOWER(name) LIKE LOWER(?)";
        List<UserModel> users = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, "%" + name + "%");
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                UserModel user = mapResultSetToUser(resultSet);
                users.add(user);
            }
            
            resultSet.close();
            preparedStatement.close();
            return users;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private UserModel mapResultSetToUser(ResultSet resultSet) throws SQLException {
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
        
        // Mapear arrays
        java.sql.Array documentsArray = resultSet.getArray("documents");
        if (documentsArray != null) {
            String[] docs = (String[]) documentsArray.getArray();
            user.setDocuments(java.util.Arrays.asList(docs));
        }
        
        java.sql.Array imagesArray = resultSet.getArray("images");
        if (imagesArray != null) {
            String[] imgs = (String[]) imagesArray.getArray();
            user.setImages(java.util.Arrays.asList(imgs));
        }
        
        Boolean able = resultSet.getObject("able", Boolean.class);
        user.setAble(able);
        
        return user;
    }
}