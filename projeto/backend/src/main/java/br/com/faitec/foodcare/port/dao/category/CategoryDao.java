package br.com.faitec.foodcare.port.dao.category;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

import java.util.List;

public interface CategoryDao extends CrudDao<Category> {
    List<Category> findByActiveStatus(boolean isActive);
    boolean updateActiveStatus(int id, boolean isActive);
}