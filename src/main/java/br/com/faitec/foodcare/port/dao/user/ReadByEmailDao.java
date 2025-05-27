package br.com.faitec.foodcare.port.dao.user;

import br.com.faitec.foodcare.domain.UserModel;

public interface ReadByEmailDao {
    UserModel findByEmail(final String email);
}
