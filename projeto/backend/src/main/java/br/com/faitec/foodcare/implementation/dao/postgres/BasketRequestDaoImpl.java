package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.BasketRequest;
import br.com.faitec.foodcare.port.dao.basketrequest.BasketRequestDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementação PostgreSQL do DAO para solicitações de cestas.
 * Gerencia operações CRUD na tabela basket_request.
 */
public class BasketRequestDaoImpl implements BasketRequestDao {

    private final Connection connection;

    /** Construtor que recebe a conexão com o banco PostgreSQL */
    public BasketRequestDaoImpl(Connection connection) {
        this.connection = connection;
    }

    /** Busca todas as solicitações de cesta cadastradas */
    @Override
    public List<BasketRequest> findAll() {
        String sql = "SELECT * FROM basket_request";
        List<BasketRequest> basketRequests = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            // Mapeia cada linha do resultado para um objeto BasketRequest
            while (resultSet.next()) {
                BasketRequest basketRequest = new BasketRequest();
                basketRequest.setId(resultSet.getInt("id"));
                basketRequest.setUserId(resultSet.getInt("user_id"));
                basketRequest.setRequestDate(resultSet.getString("request_date"));
                basketRequest.setBasketType(resultSet.getString("basket_type"));
                basketRequest.setStatus(resultSet.getString("status"));
                basketRequest.setPeopleQuantity(resultSet.getObject("people_quantity", Integer.class));
                basketRequest.setHasChildren(resultSet.getObject("has_children", Boolean.class));
                basketRequest.setCalculatedItems(resultSet.getString("calculated_items"));
                basketRequests.add(basketRequest);
            }
            
            resultSet.close();
            preparedStatement.close();
            return basketRequests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** Busca uma solicitação de cesta pelo ID */
    @Override
    public BasketRequest findByid(int id) {
        String sql = "SELECT * FROM basket_request WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            if (resultSet.next()) {
                BasketRequest basketRequest = new BasketRequest();
                basketRequest.setId(resultSet.getInt("id"));
                basketRequest.setUserId(resultSet.getInt("user_id"));
                basketRequest.setRequestDate(resultSet.getString("request_date"));
                basketRequest.setBasketType(resultSet.getString("basket_type"));
                basketRequest.setStatus(resultSet.getString("status"));
                basketRequest.setPeopleQuantity(resultSet.getObject("people_quantity", Integer.class));
                basketRequest.setHasChildren(resultSet.getObject("has_children", Boolean.class));
                basketRequest.setCalculatedItems(resultSet.getString("calculated_items"));
                
                resultSet.close();
                preparedStatement.close();
                return basketRequest;
            }
            
            resultSet.close();
            preparedStatement.close();
            return null;  // Retorna null se não encontrar
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** Busca todas as solicitações de cesta de um usuário específico */
    @Override
    public List<BasketRequest> findByUserId(int userId) {
        String sql = "SELECT * FROM basket_request WHERE user_id = ?";
        List<BasketRequest> basketRequests = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, userId);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                BasketRequest basketRequest = new BasketRequest();
                basketRequest.setId(resultSet.getInt("id"));
                basketRequest.setUserId(resultSet.getInt("user_id"));
                basketRequest.setRequestDate(resultSet.getString("request_date"));
                basketRequest.setBasketType(resultSet.getString("basket_type"));
                basketRequest.setStatus(resultSet.getString("status"));
                basketRequest.setPeopleQuantity(resultSet.getObject("people_quantity", Integer.class));
                basketRequest.setHasChildren(resultSet.getObject("has_children", Boolean.class));
                basketRequest.setCalculatedItems(resultSet.getString("calculated_items"));
                basketRequests.add(basketRequest);
            }
            
            resultSet.close();
            preparedStatement.close();
            return basketRequests;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** 
     * Cria uma nova solicitação de cesta no banco.
     * Retorna o ID gerado automaticamente.
     */
    @Override
    public int create(BasketRequest entity) {
        String sql = "INSERT INTO basket_request(user_id, request_date, basket_type, status, people_quantity, has_children, calculated_items) VALUES (?, ?, ?, ?, ?, ?, ?::jsonb)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setInt(1, entity.getUserId());
            preparedStatement.setString(2, entity.getRequestDate());
            preparedStatement.setString(3, entity.getBasketType());
            preparedStatement.setString(4, entity.getStatus());
            preparedStatement.setObject(5, entity.getPeopleQuantity());
            preparedStatement.setObject(6, entity.getHasChildren());
            preparedStatement.setString(7, entity.getCalculatedItems());  // JSON dos itens calculados
            preparedStatement.execute();
            
            // Recupera o ID gerado automaticamente
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
    public void update(int id, BasketRequest entity) {
        String sql = "UPDATE basket_request SET user_id = ?, request_date = ?, basket_type = ?, status = ?, people_quantity = ?, has_children = ?, calculated_items = ?::jsonb WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, entity.getUserId());
            preparedStatement.setString(2, entity.getRequestDate());
            preparedStatement.setString(3, entity.getBasketType());
            preparedStatement.setString(4, entity.getStatus());
            preparedStatement.setObject(5, entity.getPeopleQuantity());
            preparedStatement.setObject(6, entity.getHasChildren());
            preparedStatement.setString(7, entity.getCalculatedItems());
            preparedStatement.setInt(8, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void delete(int id) {
        String sql = "DELETE FROM basket_request WHERE id = ?";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            preparedStatement.execute();
            preparedStatement.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}