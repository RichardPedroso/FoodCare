package br.com.faitec.foodcare.implementation.service.product;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import br.com.faitec.foodcare.port.service.product.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do serviço de produtos.
 * Gerencia catálogo de produtos com validações e atualizações específicas.
 */
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductDao productDao;

    /** Construtor com injeção do DAO de produtos */
    public ProductServiceImpl(ProductDao productDao) {
        this.productDao = productDao;
    }

    /** 
     * Cria um novo produto com validações básicas.
     * Verifica se o nome do produto é válido.
     */
    @Override
    public int create(Product entity) {
        int invalidResponse = -1;

        // Validações de negócio
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

    /** Atualiza apenas o nome de um produto existente */
    @Override
    public boolean updateName(int id, String newName) {
        Product product = findById(id);

        if(product == null){
            return false;
        }

        return productDao.updateNameDao(id, newName);
    }

    /** Atualiza apenas a quantidade em estoque de um produto */
    @Override
    public boolean updateQuantity(int id, double newStock) {
        Product product = findById(id);

        if(product == null){
            return false;
        }

        return productDao.updateQuantity(id, newStock);
    }


}
