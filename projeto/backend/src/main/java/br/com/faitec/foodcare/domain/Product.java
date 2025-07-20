package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private int id;
    private String name;
    private String productType;
    private int stock;
    private boolean isActive;
    private int basketQuantity;
    private int categoryId;
    private String expirationDate;
}
