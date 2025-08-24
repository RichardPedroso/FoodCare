package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.port.dao.donationproduct.DonationProductDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DonationProductDaoImpl implements DonationProductDao {

    private final Connection connection;

    public DonationProductDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(DonationProduct entity) {
        String sql = "INSERT INTO donation_product(quantity, donation_id, product_id) VALUES (?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setDouble(1, entity.getQuantity());
            preparedStatement.setInt(2, entity.getDonationId());
            preparedStatement.setInt(3, entity.getProductId());
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
        String sql = "DELETE FROM donation_product WHERE id = ?";
        
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
    public DonationProduct findByid(int id) {
        String sql = "SELECT * FROM donation_product WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                DonationProduct donationProduct = new DonationProduct();
                donationProduct.setId(resultSet.getInt("id"));
                donationProduct.setQuantity(resultSet.getDouble("quantity"));
                donationProduct.setDonationId(resultSet.getInt("donation_id"));
                donationProduct.setProductId(resultSet.getInt("product_id"));
                
                resultSet.close();
                preparedStatement.close();
                return donationProduct;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DonationProduct> findAll() {
        String sql = "SELECT * FROM donation_product";
        List<DonationProduct> donationProducts = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                DonationProduct donationProduct = new DonationProduct();
                donationProduct.setId(resultSet.getInt("id"));
                donationProduct.setQuantity(resultSet.getDouble("quantity"));
                donationProduct.setDonationId(resultSet.getInt("donation_id"));
                donationProduct.setProductId(resultSet.getInt("product_id"));
                donationProducts.add(donationProduct);
            }
            
            resultSet.close();
            preparedStatement.close();
            return donationProducts;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, DonationProduct entity) {
        String sql = "UPDATE donation_product SET quantity = ?, donation_id = ?, product_id = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setDouble(1, entity.getQuantity());
            preparedStatement.setInt(2, entity.getDonationId());
            preparedStatement.setInt(3, entity.getProductId());
            preparedStatement.setInt(4, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DonationProduct> findByDonationId(int donationId) {
        String sql = "SELECT * FROM donation_product WHERE donation_id = ?";
        List<DonationProduct> donationProducts = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, donationId);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                DonationProduct donationProduct = new DonationProduct();
                donationProduct.setId(resultSet.getInt("id"));
                donationProduct.setQuantity(resultSet.getDouble("quantity"));
                donationProduct.setDonationId(resultSet.getInt("donation_id"));
                donationProduct.setProductId(resultSet.getInt("product_id"));
                donationProducts.add(donationProduct);
            }
            
            resultSet.close();
            preparedStatement.close();
            return donationProducts;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DonationProduct> findByProductId(int productId) {
        String sql = "SELECT * FROM donation_product WHERE product_id = ?";
        List<DonationProduct> donationProducts = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, productId);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                DonationProduct donationProduct = new DonationProduct();
                donationProduct.setId(resultSet.getInt("id"));
                donationProduct.setQuantity(resultSet.getDouble("quantity"));
                donationProduct.setDonationId(resultSet.getInt("donation_id"));
                donationProduct.setProductId(resultSet.getInt("product_id"));
                donationProducts.add(donationProduct);
            }
            
            resultSet.close();
            preparedStatement.close();
            return donationProducts;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}