package br.com.faitec.food_care.domain.dto;

import br.com.faitec.food_care.domain.UserModel;

public class UpdateUserDto {
    private int id;
    private String fullName;

    public UserModel toUserModel(){
        final UserModel entity = new UserModel();
        entity.setId(id);
        entity.setFullname(fullName);
        return entity;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
