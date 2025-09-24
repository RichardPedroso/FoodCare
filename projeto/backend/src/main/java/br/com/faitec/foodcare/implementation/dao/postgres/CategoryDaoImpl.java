package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.dao.category.CategoryDao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementação PostgreSQL do DAO para categorias de produtos.
 * Gerencia operações CRUD na tabela category.
 */
public class CategoryDaoImpl implements CategoryDao {

    private final Connection connection;

    /** Construtor que recebe a conexão com o banco PostgreSQL */
    public CategoryDaoImpl(Connection connection) {
        this.connection = connection;
    }

    /** 
     * Cria uma nova categoria no banco.
     * Retorna o ID gerado automaticamente.
     */
    @Override
    public int create(Category entity) {
        String sql = "INSERT INTO category(name) VALUES (?)";
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, entity.getDescription());
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

    /** Remove uma categoria pelo ID */
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

    /** Busca uma categoria pelo ID */
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
            return null;  // Retorna null se não encontrar
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    /** Busca todas as categorias cadastradas */
    @Override
    public List<Category> findAll() {
        String sql = "SELECT * FROM category";
        List<Category> categories = new ArrayList<>();
        
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            
            // Mapeia cada linha do resultado para um objeto Category
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

    /** Atualiza uma categoria existente */
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


}