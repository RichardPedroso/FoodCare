package br.com.faitec.food_care.port.dao.user;

import br.com.faitec.food_care.domain.UserModel;

public interface ReadByEmailDao {
    UserModel findByEmail(final String email);
}
