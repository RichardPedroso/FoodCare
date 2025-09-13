package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.UserModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponseDto {
    private String token;
    private UserModel user;
}