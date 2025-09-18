package br.com.faitec.foodcare.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasketRequest {
    private int id;
    
    @JsonProperty("user_id")
    private int userId;
    
    @JsonProperty("request_date")
    private String requestDate;
    
    @JsonProperty("basket_type")
    private String basketType;
    
    private String status;
    
    @JsonProperty("people_quantity")
    private Integer peopleQuantity;
    
    @JsonProperty("has_children")
    private Boolean hasChildren;
    
    @JsonProperty("calculated_items")
    private String calculatedItems;
}