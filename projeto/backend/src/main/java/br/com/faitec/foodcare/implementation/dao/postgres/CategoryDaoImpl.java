package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.dao.category.CategoryDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Repository
public class CategoryDaoImpl implements CategoryDao {

    private final List<Category> categories = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(Category entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        categories.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        categories.removeIf(category -> category.getId() == id);
    }

    @Override
    public Category findByid(int id) {
        return categories.stream()
                .filter(category -> category.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Category> findAll() {
        return new ArrayList<>(categories);
    }

    @Override
    public void update(int id, Category entity) {
        for (int i = 0; i < categories.size(); i++) {
            if (categories.get(i).getId() == id) {
                entity.setId(id);
                categories.set(i, entity);
                break;
            }
        }
    }

    @Override
    public List<Category> findByActiveStatus(boolean isActive) {
        return categories.stream()
                .filter(category -> category.isActive() == isActive)
                .collect(Collectors.toList());
    }

    @Override
    public boolean updateActiveStatus(int id, boolean isActive) {
        Category category = findByid(id);
        if (category != null) {
            category.setActive(isActive);
            return true;
        }
        return false;
    }
}