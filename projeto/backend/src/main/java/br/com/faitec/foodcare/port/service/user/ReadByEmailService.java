package br.com.faitec.foodcare.port.service.user;

import br.com.faitec.foodcare.domain.UserModel;

public interface ReadByEmailService {
    UserModel findByEmail(final String email);
}
