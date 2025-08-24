package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.dao.category.CategoryDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CategoryDaoImpl implements CategoryDao {

    private final Connection connection;

    public CategoryDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Category entity) {
        String sql = "INSERT INTO category(name) VALUES (?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getDescription());
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
        String sql = "DELETE FROM category WHERE id = ?";
        
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
    public Category findByid(int id) {
        String sql = "SELECT * FROM category WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                Category category = new Category();
                category.setId(resultSet.getInt("id"));
                category.setDescription(resultSet.getString("name"));
                
                resultSet.close();
                preparedStatement.close();
                return category;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Category> findAll() {
        String sql = "SELECT * FROM category";
        List<Category> categories = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Category category = new Category();
                category.setId(resultSet.getInt("id"));
                category.setDescription(resultSet.getString("name"));
                categories.add(category);
            }
            
            resultSet.close();
            preparedStatement.close();
            return categories;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, Category entity) {
        String sql = "UPDATE category SET name = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getDescription());
            preparedStatement.setInt(2, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Category> findByActiveStatus(boolean isActive) {
        return findAll();
    }

    @Override
    public boolean updateActiveStatus(int id, boolean isActive) {
        return true;
    }
}