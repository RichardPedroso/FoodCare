package br.com.faitec.foodcare.port.service.user;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface UserService extends CrudService<UserModel>, ReadByEmailService, UpdatePasswordService {
    List<UserModel> findByUserType(UserModel.UserType userType);
    List<UserModel> findByAbleStatus(Boolean able);
    boolean updateAbleStatus(int userId, Boolean able);
    List<UserModel> searchByName(String name);
}
