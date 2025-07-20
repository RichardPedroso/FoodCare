package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Product;

public class UpdateProductDto {
    private int id;
    private String name;
    private String productType;
    private int stock;
    private boolean isActive;
    private int basketQuantity;
    private int categoryId;
    private String expirationDate;

    public Product toProduct(){
        final Product entity = new Product();
        entity.setId(id);
        entity.setName(name);
        entity.setProductType(productType);
        entity.setStock(stock);
        entity.setActive(isActive);
        entity.setBasketQuantity(basketQuantity);
        entity.setCategoryId(categoryId);
        entity.setExpirationDate(expirationDate);

        return entity;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public int getBasketQuantity() {
        return basketQuantity;
    }

    public void setBasketQuantity(int basketQuantity) {
        this.basketQuantity = basketQuantity;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }
}
