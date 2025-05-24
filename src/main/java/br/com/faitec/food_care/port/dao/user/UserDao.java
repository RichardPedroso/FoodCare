package br.com.faitec.food_care.port.dao.user;

import br.com.faitec.food_care.domain.UserModel;
import br.com.faitec.food_care.port.dao.crud.CrudDao;

public interface UserDao extends CrudDao<UserModel>, ReadByEmailDao, UpdatePasswordDao {
}
