package br.com.faitec.food_care.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private int id;
    private String nome;
    private double quantidade;
    private String dataDeValidade;
}
