package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.port.dao.donation.DonationDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DonationDaoImpl implements DonationDao {

    private final Connection connection;

    public DonationDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Donation entity) {
        String sql = "INSERT INTO donation(donation_date, user_id, donation_status) VALUES (?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getDonationDate());
            preparedStatement.setInt(2, entity.getUserId());
            preparedStatement.setBoolean(3, entity.isDonationStatus());
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
        try {
            // Primeiro deletar donation_products relacionados
            String deleteDonationProductsSql = "DELETE FROM donation_product WHERE donation_id = ?";
            PreparedStatement deleteProductsStmt = connection.prepareStatement(deleteDonationProductsSql);
            deleteProductsStmt.setInt(1, id);
            deleteProductsStmt.execute();
            deleteProductsStmt.close();
            
            // Depois deletar a donation
            String deleteDonationSql = "DELETE FROM donation WHERE id = ?";
            PreparedStatement deleteDonationStmt = connection.prepareStatement(deleteDonationSql);
            deleteDonationStmt.setInt(1, id);
            deleteDonationStmt.execute();
            deleteDonationStmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Donation findByid(int id) {
        String sql = "SELECT * FROM donation WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                Donation donation = new Donation();
                donation.setId(resultSet.getInt("id"));
                donation.setDonationDate(resultSet.getString("donation_date"));
                donation.setUserId(resultSet.getInt("user_id"));
                donation.setDonationStatus(resultSet.getBoolean("donation_status"));
                
                resultSet.close();
                preparedStatement.close();
                return donation;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Donation> findAll() {
        String sql = "SELECT * FROM donation";
        List<Donation> donations = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Donation donation = new Donation();
                donation.setId(resultSet.getInt("id"));
                donation.setDonationDate(resultSet.getString("donation_date"));
                donation.setUserId(resultSet.getInt("user_id"));
                donation.setDonationStatus(resultSet.getBoolean("donation_status"));
                donations.add(donation);
            }
            
            resultSet.close();
            preparedStatement.close();
            return donations;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, Donation entity) {
        String sql = "UPDATE donation SET donation_date = ?, user_id = ?, donation_status = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getDonationDate());
            preparedStatement.setInt(2, entity.getUserId());
            preparedStatement.setBoolean(3, entity.isDonationStatus());
            preparedStatement.setInt(4, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Donation> findByUserId(int userId) {
        String sql = "SELECT * FROM donation WHERE user_id = ?";
        List<Donation> donations = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, userId);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Donation donation = new Donation();
                donation.setId(resultSet.getInt("id"));
                donation.setDonationDate(resultSet.getString("donation_date"));
                donation.setUserId(resultSet.getInt("user_id"));
                donation.setDonationStatus(resultSet.getBoolean("donation_status"));
                donations.add(donation);
            }
            
            resultSet.close();
            preparedStatement.close();
            return donations;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}