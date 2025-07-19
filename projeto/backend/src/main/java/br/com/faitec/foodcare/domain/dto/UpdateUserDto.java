package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.UserModel;

public class UpdateUserDto {
    private int id;
    private String name;
    private String email;
    private String phone;
    private UserModel.UserType userType;
    private boolean isAdmin;
    private double familyIncome;
    private int peopleQuantity;
    private int municipalityId;

    public UserModel toUserModel(){
        final UserModel entity = new UserModel();
        entity.setId(id);
        entity.setName(name);
        entity.setEmail(email);
        entity.setPhone(phone);
        entity.setUserType(userType);
        entity.setAdmin(isAdmin);
        entity.setFamilyIncome(familyIncome);
        entity.setPeopleQuantity(peopleQuantity);
        entity.setMunicipalityId(municipalityId);
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public UserModel.UserType getUserType() {
        return userType;
    }
    
    public void setUserType(UserModel.UserType userType) {
        this.userType = userType;
    }
    
    public boolean isAdmin() {
        return isAdmin;
    }
    
    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
    
    public double getFamilyIncome() {
        return familyIncome;
    }
    
    public void setFamilyIncome(double familyIncome) {
        this.familyIncome = familyIncome;
    }
    
    public int getPeopleQuantity() {
        return peopleQuantity;
    }
    
    public void setPeopleQuantity(int peopleQuantity) {
        this.peopleQuantity = peopleQuantity;
    }
    
    public int getMunicipalityId() {
        return municipalityId;
    }
    
    public void setMunicipalityId(int municipalityId) {
        this.municipalityId = municipalityId;
    }
}
