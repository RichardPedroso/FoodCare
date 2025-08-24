package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.port.dao.request.RequestDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class RequestDaoImpl implements RequestDao {

    private final Connection connection;

    public RequestDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int create(Request entity) {
        String sql = "INSERT INTO request(request_date, request_type, status, user_id) VALUES (?, ?, ?, ?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getRequestDate());
            preparedStatement.setString(2, entity.getRequestType().name());
            preparedStatement.setString(3, entity.getStatus().name());
            preparedStatement.setInt(4, entity.getUserId());
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
        String sql = "DELETE FROM request WHERE id = ?";
        
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
    public Request findByid(int id) {
        String sql = "SELECT * FROM request WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                Request request = new Request();
                request.setId(resultSet.getInt("id"));
                request.setRequestDate(resultSet.getString("request_date"));
                request.setRequestType(Request.RequestType.valueOf(resultSet.getString("request_type")));
                request.setStatus(Request.RequestStatus.valueOf(resultSet.getString("status")));
                request.setUserId(resultSet.getInt("user_id"));
                
                resultSet.close();
                preparedStatement.close();
                return request;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Request> findAll() {
        String sql = "SELECT * FROM request";
        List<Request> requests = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Request request = new Request();
                request.setId(resultSet.getInt("id"));
                request.setRequestDate(resultSet.getString("request_date"));
                request.setRequestType(Request.RequestType.valueOf(resultSet.getString("request_type")));
                request.setStatus(Request.RequestStatus.valueOf(resultSet.getString("status")));
                request.setUserId(resultSet.getInt("user_id"));
                requests.add(request);
            }
            
            resultSet.close();
            preparedStatement.close();
            return requests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(int id, Request entity) {
        String sql = "UPDATE request SET request_date = ?, request_type = ?, status = ?, user_id = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, entity.getRequestDate());
            preparedStatement.setString(2, entity.getRequestType().name());
            preparedStatement.setString(3, entity.getStatus().name());
            preparedStatement.setInt(4, entity.getUserId());
            preparedStatement.setInt(5, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Request> findByUserId(int userId) {
        String sql = "SELECT * FROM request WHERE user_id = ?";
        List<Request> requests = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, userId);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Request request = new Request();
                request.setId(resultSet.getInt("id"));
                request.setRequestDate(resultSet.getString("request_date"));
                request.setRequestType(Request.RequestType.valueOf(resultSet.getString("request_type")));
                request.setStatus(Request.RequestStatus.valueOf(resultSet.getString("status")));
                request.setUserId(resultSet.getInt("user_id"));
                requests.add(request);
            }
            
            resultSet.close();
            preparedStatement.close();
            return requests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Request> findByStatus(Request.RequestStatus status) {
        String sql = "SELECT * FROM request WHERE status = ?";
        List<Request> requests = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, status.name());
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Request request = new Request();
                request.setId(resultSet.getInt("id"));
                request.setRequestDate(resultSet.getString("request_date"));
                request.setRequestType(Request.RequestType.valueOf(resultSet.getString("request_type")));
                request.setStatus(Request.RequestStatus.valueOf(resultSet.getString("status")));
                request.setUserId(resultSet.getInt("user_id"));
                requests.add(request);
            }
            
            resultSet.close();
            preparedStatement.close();
            return requests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Request> findByRequestType(Request.RequestType requestType) {
        String sql = "SELECT * FROM request WHERE request_type = ?";
        List<Request> requests = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, requestType.name());
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                Request request = new Request();
                request.setId(resultSet.getInt("id"));
                request.setRequestDate(resultSet.getString("request_date"));
                request.setRequestType(Request.RequestType.valueOf(resultSet.getString("request_type")));
                request.setStatus(Request.RequestStatus.valueOf(resultSet.getString("status")));
                request.setUserId(resultSet.getInt("user_id"));
                requests.add(request);
            }
            
            resultSet.close();
            preparedStatement.close();
            return requests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean updateStatus(int id, Request.RequestStatus newStatus) {
        String sql = "UPDATE request SET status = ? WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, newStatus.name());
            preparedStatement.setInt(2, id);
            int rowsAffected = preparedStatement.executeUpdate();
            preparedStatement.close();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}