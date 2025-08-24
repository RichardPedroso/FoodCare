package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProductDaoImpl implements ProductDao {

    private final Connection connection;

    public ProductDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Product entity) {
        String sql = "INSERT INTO product(name, product_type, stock, is_active, basket_quantity, category_id) VALUES (?, ?, ?, ?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getProductType());
            preparedStatement.setInt(3, entity.getStock());
            preparedStatement.setBoolean(4, entity.isActive());
            preparedStatement.setInt(5, entity.getBasketQuantity());
            preparedStatement.setInt(6, entity.getCategoryId());
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
        String sql = "DELETE FROM product WHERE id = ?";
        
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
    public Product findByid(int id) {
        String sql = "SELECT * FROM product WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                Product product = new Product();
                product.setId(resultSet.getInt("id"));
                product.setName(resultSet.getString("name"));
                product.setProductType(resultSet.getString("product_type"));
                product.setStock(resultSet.getInt("stock"));
                product.setActive(resultSet.getBoolean("is_active"));
                product.setBasketQuantity(resultSet.getInt("basket_quantity"));
                product.setCategoryId(resultSet.getInt("category_id"));
                
                resultSet.close();
                preparedStatement.close();
                return product;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Product> findAll() {
        String sql = "SELECT * FROM product";
        List<Product> products = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Product product = new Product();
                product.setId(resultSet.getInt("id"));
                product.setName(resultSet.getString("name"));
                product.setProductType(resultSet.getString("product_type"));
                product.setStock(resultSet.getInt("stock"));
                product.setActive(resultSet.getBoolean("is_active"));
                product.setBasketQuantity(resultSet.getInt("basket_quantity"));
                product.setCategoryId(resultSet.getInt("category_id"));
                products.add(product);
            }
            
            resultSet.close();
            preparedStatement.close();
            return products;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, Product entity) {
        String sql = "UPDATE product SET name = ?, product_type = ?, stock = ?, is_active = ?, basket_quantity = ?, category_id = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getProductType());
            preparedStatement.setInt(3, entity.getStock());
            preparedStatement.setBoolean(4, entity.isActive());
            preparedStatement.setInt(5, entity.getBasketQuantity());
            preparedStatement.setInt(6, entity.getCategoryId());
            preparedStatement.setInt(7, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updateNameDao(int id, String newName) {
        String sql = "UPDATE product SET name = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, newName);
            preparedStatement.setInt(2, id);
            int rowsAffected = preparedStatement.executeUpdate();
            preparedStatement.close();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updateQuantity(int id, int newStock) {
        String sql = "UPDATE product SET stock = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, newStock);
            preparedStatement.setInt(2, id);
            int rowsAffected = preparedStatement.executeUpdate();
            preparedStatement.close();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
