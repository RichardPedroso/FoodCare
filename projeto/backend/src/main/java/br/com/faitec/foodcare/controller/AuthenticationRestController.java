package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.AuthenticationDto;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authenticate")
public class AuthenticationRestController {

    private final AuthenticationService authenticationService;

    public AuthenticationRestController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping
    public ResponseEntity<UserModel> authenticate(@RequestBody final AuthenticationDto authenticationDto) {

        UserModel authenticatedUser = authenticationService.authenticate(
                authenticationDto.getEmail(),
                authenticationDto.getPassword());

        if(authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(authenticatedUser);
    }

}