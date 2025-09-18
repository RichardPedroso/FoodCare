package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {
    private int id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private UserType userType;
    private double familyIncome;
    private int peopleQuantity;
    private int municipalityId;
    private boolean hasChildren;
    private int numberOfChildren;
    private List<String> documents;
    private List<String> images;
    private Boolean able;
    
    public enum UserType {
        donor,
        beneficiary,
        admin
    }
}
