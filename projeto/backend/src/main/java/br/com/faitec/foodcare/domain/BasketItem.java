package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasketItem {
    private int productId;
    private String productName;
    private int quantity;
    private double unitQuantity;
    private String unitType;
}