package br.com.faitec.food_care.domain.dto;

public class UpdatePasswordDto {
    private int id;
    private String oldPassword;
    private String newPassword;

    public UpdatePasswordDto(){

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOldPassword(){
        return oldPassword;
    }

    public void setOldPassword(String oldPassword){
        this.oldPassword = oldPassword;
    }

    public String getNewPassword(){
        return newPassword;
    }

    public void setNewPassword(String newPassword){
        this.newPassword = newPassword;
    }
}
