package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasketRequest {
    private int id;
    private int userId;
    private String requestDate;
    private String basketType;
    private String status;
    private Integer peopleQuantity;
    private Boolean hasChildren;
    private String calculatedItems;
}