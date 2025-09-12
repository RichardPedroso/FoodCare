package br.com.faitec.foodcare.port.dao.user;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface UserDao extends CrudDao<UserModel>, ReadByEmailDao, UpdatePasswordDao {
    List<UserModel> findByUserType(UserModel.UserType userType);
    List<UserModel> findByAbleStatus(Boolean able);
    boolean updateAbleStatus(int userId, Boolean able);
    List<UserModel> searchByName(String name);
}
