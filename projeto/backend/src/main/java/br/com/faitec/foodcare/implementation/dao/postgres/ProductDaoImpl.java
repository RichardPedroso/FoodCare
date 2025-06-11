package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductDaoImpl implements ProductDao {
    @Override
    public int create(Product entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public Product findByid(int id) {
        return null;
    }

    @Override
    public List<Product> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, Product entity) {

    }

    @Override
    public boolean updateExpirationDate(int id, String newExpirationDate) {
        return false;
    }

    @Override
    public boolean updateNameDao(int id, String newName) {
        return false;
    }

    @Override
    public boolean updateQuantity(int id, int newQuantity) {
        return false;
    }
}
