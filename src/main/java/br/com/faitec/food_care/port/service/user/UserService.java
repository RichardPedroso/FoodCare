package br.com.faitec.food_care.port.service.user;

import br.com.faitec.food_care.domain.UserModel;
import br.com.faitec.food_care.port.service.crud.CrudService;

public interface UserService extends CrudService<UserModel>, ReadByEmailService, UpdatePasswordService {
}
