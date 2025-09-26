package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.UserModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private int id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String userType;
    private double familyIncome;
    private int peopleQuantity;
    private int municipalityId;
    private boolean hasChildren;
    private int numberOfChildren;
    private List<String> documents;
    private List<String> images;
    private Boolean able;
    
    public static UserResponseDto fromUserModel(UserModel user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setPhone(user.getPhone());
        dto.setUserType(user.getUserType().name());
        dto.setFamilyIncome(user.getFamilyIncome());
        dto.setPeopleQuantity(user.getPeopleQuantity());
        dto.setMunicipalityId(user.getMunicipalityId());
        dto.setHasChildren(user.isHasChildren());
        dto.setNumberOfChildren(user.getNumberOfChildren());
        dto.setDocuments(user.getDocuments());
        dto.setImages(user.getImages());
        dto.setAble(user.getAble());
        return dto;
    }
}