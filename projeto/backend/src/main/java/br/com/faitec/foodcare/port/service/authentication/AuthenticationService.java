package br.com.faitec.foodcare.port.service.authentication;

import br.com.faitec.foodcare.domain.UserModel;

public interface AuthenticationService {
    UserModel authenticate (final String email, final String password);
}
