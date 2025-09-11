package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Product;
import lombok.Data;

@Data
public class UpdateProductDto {
    private int id;
    private String name;
    private String productType;
    private int categoryId;
    private double unitQuantity;
    private String unitType;

    public Product toProduct(){
        final Product entity = new Product();
        entity.setId(id);
        entity.setName(name);
        entity.setProductType(productType);
        entity.setCategoryId(categoryId);
        entity.setUnitQuantity(unitQuantity);
        entity.setUnitType(unitType);

        return entity;
    }


}
