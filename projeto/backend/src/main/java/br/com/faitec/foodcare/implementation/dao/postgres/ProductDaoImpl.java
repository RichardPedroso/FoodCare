package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class ProductDaoImpl implements ProductDao {

    private final List<Product> products = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(Product entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        products.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        products.removeIf(product -> product.getId() == id);
    }

    @Override
    public Product findByid(int id) {
        return products.stream()
                .filter(product -> product.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Product> findAll() {
        return new ArrayList<>(products);
    }

    @Override
    public void update(int id, Product entity) {
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getId() == id) {
                entity.setId(id);
                products.set(i, entity);
                break;
            }
        }
    }

    @Override
    public boolean updateExpirationDate(int id, String newExpirationDate) {
        Product product = findByid(id);
        if (product != null) {
            product.setExpirationDate(newExpirationDate);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateNameDao(int id, String newName) {
        Product product = findByid(id);
        if (product != null) {
            product.setName(newName);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateQuantity(int id, int newQuantity) {
        Product product = findByid(id);
        if (product != null) {
            product.setQuantity(newQuantity);
            return true;
        }
        return false;
    }
}
