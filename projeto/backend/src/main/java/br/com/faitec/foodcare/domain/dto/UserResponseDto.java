package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.UserModel;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    
    // Campos em camelCase para compatibilidade com frontend
    private String userType;
    private double familyIncome;
    private int peopleQuantity;
    private int municipalityId;
    private boolean hasChildren;
    private int numberOfChildren;
    private List<String> documents;
    private List<String> images;
    private Boolean able;
    
    // Campos em snake_case para compatibilidade com código legado do frontend
    @JsonProperty("user_type")
    private String userTypeSnake;
    
    @JsonProperty("family_income")
    private String familyIncomeSnake;
    
    @JsonProperty("people_quantity")
    private String peopleQuantitySnake;
    
    @JsonProperty("municipality_id")
    private String municipalityIdSnake;
    
    @JsonProperty("has_children")
    private boolean hasChildrenSnake;
    
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
        
        // Campos snake_case para compatibilidade
        dto.setUserTypeSnake(user.getUserType().name());
        dto.setFamilyIncomeSnake(String.valueOf(user.getFamilyIncome()));
        dto.setPeopleQuantitySnake(String.valueOf(user.getPeopleQuantity()));
        dto.setMunicipalityIdSnake(String.valueOf(user.getMunicipalityId()));
        dto.setHasChildrenSnake(user.isHasChildren());
        
        return dto;
    }
}