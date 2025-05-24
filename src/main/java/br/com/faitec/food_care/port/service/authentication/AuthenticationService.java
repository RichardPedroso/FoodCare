package br.com.faitec.food_care.port.service.authentication;

import br.com.faitec.food_care.domain.UserModel;

public interface AuthenticationService {
    UserModel authenticate (final String email, final String password);
}
