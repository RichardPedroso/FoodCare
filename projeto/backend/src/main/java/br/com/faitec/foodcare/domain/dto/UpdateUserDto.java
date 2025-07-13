package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.UserModel;

public class UpdateUserDto {
    private int id;
    private String fullName;
    private String email;

    public UserModel toUserModel(){
        final UserModel entity = new UserModel();
        entity.setId(id);
        entity.setFullname(fullName);
        entity.setEmail(email);
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
