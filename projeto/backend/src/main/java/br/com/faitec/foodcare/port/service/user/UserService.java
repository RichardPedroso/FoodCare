package br.com.faitec.foodcare.port.service.user;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.crud.CrudService;

public interface UserService extends CrudService<UserModel>, ReadByEmailService, UpdatePasswordService {
}
