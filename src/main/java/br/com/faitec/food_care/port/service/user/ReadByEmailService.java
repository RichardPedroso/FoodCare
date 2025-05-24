package br.com.faitec.food_care.port.service.user;

import br.com.faitec.food_care.domain.UserModel;

public interface ReadByEmailService {
    UserModel findByEmail(final String email);
}
