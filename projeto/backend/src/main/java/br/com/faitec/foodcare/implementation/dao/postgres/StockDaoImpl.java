package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.dao.stock.StockDao;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class StockDaoImpl implements StockDao {

    private final Connection connection;

    public StockDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Stock entity) {
        String sql = "INSERT INTO stock(product_id, donation_option, actual_stock) VALUES (?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setInt(1, entity.getProductId());
            preparedStatement.setDouble(2, entity.getDonationOption());
            preparedStatement.setInt(3, entity.getActualStock());
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
        String sql = "DELETE FROM stock WHERE id = ?";
        
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
    public Stock findByid(int id) {
        String sql = "SELECT * FROM stock WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                Stock stock = new Stock();
                stock.setId(resultSet.getInt("id"));
                stock.setProductId(resultSet.getInt("product_id"));
                stock.setDonationOption(resultSet.getDouble("donation_option"));
                stock.setActualStock(resultSet.getInt("actual_stock"));
                
                resultSet.close();
                preparedStatement.close();
                return stock;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Stock> findAll() {
        String sql = "SELECT * FROM stock";
        List<Stock> stocks = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Stock stock = new Stock();
                stock.setId(resultSet.getInt("id"));
                stock.setProductId(resultSet.getInt("product_id"));
                stock.setDonationOption(resultSet.getDouble("donation_option"));
                stock.setActualStock(resultSet.getInt("actual_stock"));
                stocks.add(stock);
            }
            
            resultSet.close();
            preparedStatement.close();
            return stocks;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, Stock entity) {
        String sql = "UPDATE stock SET product_id = ?, donation_option = ?, actual_stock = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, entity.getProductId());
            preparedStatement.setDouble(2, entity.getDonationOption());
            preparedStatement.setInt(3, entity.getActualStock());
            preparedStatement.setInt(4, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Stock> findByProductId(int productId) {
        String sql = "SELECT * FROM stock WHERE product_id = ?";
        List<Stock> stocks = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, productId);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Stock stock = new Stock();
                stock.setId(resultSet.getInt("id"));
                stock.setProductId(resultSet.getInt("product_id"));
                stock.setDonationOption(resultSet.getDouble("donation_option"));
                stock.setActualStock(resultSet.getInt("actual_stock"));
                stocks.add(stock);
            }
            
            resultSet.close();
            preparedStatement.close();
            return stocks;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}