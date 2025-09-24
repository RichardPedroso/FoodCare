package br.com.faitec.foodcare.implementation.service.category;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.dao.category.CategoryDao;
import br.com.faitec.foodcare.port.service.category.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementação do serviço de categorias.
 * Aplica regras de negócio e validações para operações CRUD de categorias.
 */
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryDao categoryDao;

    /** Construtor com injeção do DAO de categorias */
    public CategoryServiceImpl(CategoryDao categoryDao) {
        this.categoryDao = categoryDao;
    }

    /** 
     * Cria uma nova categoria com validações de negócio.
     * Verifica se a entidade e descrição são válidas.
     */
    @Override
    public int create(Category entity) {
        int invalidResponse = -1;

        // Validações de negócio
        if (entity == null) {
            return invalidResponse;
        }
        if (entity.getDescription() == null || entity.getDescription().isEmpty()) {
            return invalidResponse;
        }
        
        final int id = categoryDao.create(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }

        categoryDao.delete(id);
    }

    @Override
    public Category findById(int id) {
        if (id < 0) {
            return null;
        }

        Category entity = categoryDao.findByid(id);
        return entity;
    }

    @Override
    public List<Category> findAll() {
        final List<Category> entities = categoryDao.findAll();
        return entities;
    }

    /** 
     * Atualiza uma categoria existente.
     * Verifica consistência de ID e existência da categoria.
     */
    @Override
    public void update(int id, Category entity) {
        // Verifica consistência do ID
        if (id != entity.getId()) {
            return;
        }

        // Verifica se a categoria existe
        Category category = findById(id);
        if (category == null) {
            return;
        }

        categoryDao.update(id, entity);
    }


}