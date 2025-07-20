package br.com.faitec.foodcare.implementation.service.category;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.dao.category.CategoryDao;
import br.com.faitec.foodcare.port.service.category.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryDao categoryDao;

    public CategoryServiceImpl(CategoryDao categoryDao) {
        this.categoryDao = categoryDao;
    }

    @Override
    public int create(Category entity) {
        int invalidResponse = -1;

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

    @Override
    public void update(int id, Category entity) {
        if (id != entity.getId()) {
            return;
        }

        Category category = findById(id);

        if (category == null) {
            return;
        }

        categoryDao.update(id, entity);
    }

    @Override
    public List<Category> findByActiveStatus(boolean isActive) {
        return categoryDao.findByActiveStatus(isActive);
    }

    @Override
    public boolean updateActiveStatus(int id, boolean isActive) {
        if (id < 0) {
            return false;
        }
        
        Category category = findById(id);
        if (category == null) {
            return false;
        }
        
        return categoryDao.updateActiveStatus(id, isActive);
    }
}