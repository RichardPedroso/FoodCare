package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.UserModel;
import lombok.Data;

@Data
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

}
