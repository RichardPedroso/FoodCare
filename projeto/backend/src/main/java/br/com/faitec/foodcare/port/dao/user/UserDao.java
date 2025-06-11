package br.com.faitec.foodcare.port.dao.user;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;
import org.springframework.stereotype.Repository;


public interface UserDao extends CrudDao<UserModel>, ReadByEmailDao, UpdatePasswordDao {
}
