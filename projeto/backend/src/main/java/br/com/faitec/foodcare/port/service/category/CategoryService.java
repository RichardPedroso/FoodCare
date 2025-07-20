package br.com.faitec.foodcare.port.service.category;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface CategoryService extends CrudService<Category> {
    List<Category> findByActiveStatus(boolean isActive);
    boolean updateActiveStatus(int id, boolean isActive);
}