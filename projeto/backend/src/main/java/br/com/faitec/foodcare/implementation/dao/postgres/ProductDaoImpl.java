package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Implementação PostgreSQL do DAO para produtos.
 * Gerencia informações de produtos incluindo opções de doação e unidades de medida.
 */
public class ProductDaoImpl implements ProductDao {

    private final Connection connection;

    /** Construtor que recebe a conexão com o banco PostgreSQL */
    public ProductDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Product entity) {
        String sql = "INSERT INTO product(name, product_type, category_id, measure_type) VALUES (?, ?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getProductType().name());
            preparedStatement.setInt(3, entity.getCategoryId());
            preparedStatement.setString(4, entity.getMeasureType().name());
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

    /** Busca um produto pelo ID, incluindo opções de doação */
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
                product.setProductType(Product.ProductType.valueOf(resultSet.getString("product_type")));
                product.setCategoryId(resultSet.getInt("category_id"));
                product.setMeasureType(Product.MeasureType.valueOf(resultSet.getString("measure_type")));
                
                // Processa array de opções de doação do PostgreSQL
                Array optionsArray = resultSet.getArray("options_donation");
                if (optionsArray != null) {
                    Double[] options = (Double[]) optionsArray.getArray();
                    product.setOptionsDonation(Arrays.asList(options));
                }
                
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
                product.setProductType(Product.ProductType.valueOf(resultSet.getString("product_type")));
                product.setCategoryId(resultSet.getInt("category_id"));
                product.setMeasureType(Product.MeasureType.valueOf(resultSet.getString("measure_type")));
                
                Array optionsArray = resultSet.getArray("options_donation");
                if (optionsArray != null) {
                    Double[] options = (Double[]) optionsArray.getArray();
                    product.setOptionsDonation(Arrays.asList(options));
                }
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
        String sql = "UPDATE product SET name = ?, product_type = ?, category_id = ?, measure_type = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getName());
            preparedStatement.setString(2, entity.getProductType().name());
            preparedStatement.setInt(3, entity.getCategoryId());
            preparedStatement.setString(4, entity.getMeasureType().name());
            preparedStatement.setInt(5, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** Atualiza apenas o nome de um produto */
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

    /** Atualiza apenas a quantidade em estoque de um produto */
    @Override
    public boolean updateQuantity(int id, double newStock) {
        String sql = "UPDATE product SET stock = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setDouble(1, newStock);
            preparedStatement.setInt(2, id);
            int rowsAffected = preparedStatement.executeUpdate();
            preparedStatement.close();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}