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
    private ProductType productType;
    private int categoryId;
    private MeasureType measureType;
    private List<Double> optionsDonation;
    
    public enum ProductType {
        basic,
        hygiene,
        infant
    }
    
    public enum MeasureType {
        kg,
        g,
        l,
        ml,
        un
    }
}
