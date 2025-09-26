package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Product;
import lombok.Data;

@Data
public class UpdateProductDto {
    private int id;
    private String name;
    private Product.ProductType productType;
    private int categoryId;
    private Product.MeasureType measureType;

    public Product toProduct(){
        final Product entity = new Product();
        entity.setId(id);
        entity.setName(name);
        entity.setProductType(productType);
        entity.setCategoryId(categoryId);
        entity.setMeasureType(measureType);
        return entity;
    }
}
