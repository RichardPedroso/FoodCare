package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Municipality {
    private int id;
    private String street;
    private String number;
    private String neighborhood;
    private String city;
    private String zipCode;
}