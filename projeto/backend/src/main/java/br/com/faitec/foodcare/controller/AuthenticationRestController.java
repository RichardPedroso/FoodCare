package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.configuration.security.JwtService;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.AuthenticationDto;
import br.com.faitec.foodcare.domain.dto.AuthenticationResponseDto;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authenticate")
public class AuthenticationRestController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public AuthenticationRestController(AuthenticationService authenticationService, JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<AuthenticationResponseDto> authenticate(@RequestBody final AuthenticationDto authenticationDto) {

        UserModel authenticatedUser = authenticationService.authenticate(
                authenticationDto.getEmail(),
                authenticationDto.getPassword());

        if(authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtService.generateToken(
                authenticatedUser.getEmail(),
                authenticatedUser.getUserType().name(),
                authenticatedUser.getId()
        );

        AuthenticationResponseDto response = new AuthenticationResponseDto(token, authenticatedUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtService.extractEmail(token);
                boolean isValid = jwtService.validateToken(token, email);
                return ResponseEntity.ok(isValid);
            }
            return ResponseEntity.ok(false);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

}