package br.com.faitec.foodcare.implementation.service.product;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import br.com.faitec.foodcare.port.service.product.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductDao productDao;

    public ProductServiceImpl(ProductDao productDao) {
        this.productDao = productDao;
    }

    @Override
    public int create(Product entity) {
        int invalidResponse = -1;

        if(entity == null){
            return invalidResponse;
        }
        if(entity.getName().isEmpty()){
            return invalidResponse;
        }
        final int id = productDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if(id < 0){
            return;
        }

        productDao.delete(id);



    }



    @Override
    public Product findById(int id) {
        if(id < 0){
            return null;
        }

        Product entity = productDao.findByid(id);
        return entity;
    }

    @Override
    public List<Product> findAll() {
        final List<Product> entities = productDao.findAll();

        return entities;
    }

    @Override
    public void update(int id, Product entity) {
        if(id != entity.getId()){
            return;
        }

        Product product = findById(id);

        if(product == null){
            return;
        }

        productDao.update(id, entity);

    }

    @Override
    public boolean updateName(int id, String newName) {
        Product product = findById(id);

        if(product == null){
            return false;
        }

        product.setName(newName);
        return true;

    }

    @Override
    public boolean updateQuantity(int id, int newQuantity) {
        Product product = findById(id);

        if(product == null){
            return false;
        }

        product.setQuantity(newQuantity);
        return true;

    }

    @Override
    public boolean updateExpirationDate(int id, String newExpirationDate) {
        Product product = findById(id);

        if(product == null){
            return false;
        }

        product.setExpirationDate(newExpirationDate);
        return true;

    }
}
