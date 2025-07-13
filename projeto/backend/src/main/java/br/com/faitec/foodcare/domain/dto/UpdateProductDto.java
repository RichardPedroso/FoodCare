package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Product;

public class UpdateProductDto {
    private int id;
    private String name;
    private int quantity;
    private String expirationDate;

    public Product toProduct(){
        final Product entity = new Product();
        entity.setId(id);
        entity.setName(name);
        entity.setQuantity(quantity);
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }
}
