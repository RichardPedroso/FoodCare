package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.AuthenticationDto;
import br.com.faitec.foodcare.domain.dto.UserResponseDto;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller REST para autenticação de usuários.
 * Gerencia o processo de login validando credenciais.
 */
@RestController
@RequestMapping("/authenticate")
public class AuthenticationRestController {

    private final AuthenticationService authenticationService;

    /** Construtor com injeção do serviço de autenticação */
    public AuthenticationRestController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    /**
     * Autentica um usuário com email e senha.
     * Retorna os dados do usuário se as credenciais forem válidas.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> authenticate(@RequestBody final AuthenticationDto authenticationDto) {

        // Valida as credenciais do usuário
        UserModel authenticatedUser = authenticationService.authenticate(
                authenticationDto.getEmail(),
                authenticationDto.getPassword());

        // Retorna erro 401 se as credenciais forem inválidas
        if(authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Monta resposta com dados do usuário autenticado
        Map<String, Object> response = new HashMap<>();
        response.put("user", UserResponseDto.fromUserModel(authenticatedUser));
        
        return ResponseEntity.ok(response);
    }
}