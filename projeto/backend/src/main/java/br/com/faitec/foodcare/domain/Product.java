package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private int id;
    private String name;
    private String productType;
    private int categoryId;
    private double unitQuantity;
    private String unitType;
    private List<Double> optionsDonation;
    
    public enum UnitType {
        KG,
        G,
        L,
        ML
    }
}
