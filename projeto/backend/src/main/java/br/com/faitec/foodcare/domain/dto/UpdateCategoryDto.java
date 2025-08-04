package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Category;
import lombok.Data;

@Data
public class UpdateCategoryDto {
    private int id;
    private String description;
    private boolean isActive;

    public Category toCategory() {
        final Category entity = new Category();
        entity.setId(id);
        entity.setDescription(description);
        entity.setActive(isActive);
        return entity;
    }
}