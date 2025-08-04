package br.com.faitec.foodcare.domain.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdatePasswordDto {
    private int id;
    private String oldPassword;
    private String newPassword;


}
