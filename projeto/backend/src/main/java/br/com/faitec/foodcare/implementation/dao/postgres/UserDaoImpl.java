package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    @Override
    public int create(UserModel entity) {
        return 0;
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public UserModel findByid(int id) {
        return null;
    }

    @Override
    public List<UserModel> findAll() {
        return List.of();
    }

    @Override
    public void update(int id, UserModel entity) {

    }

    @Override
    public UserModel findByEmail(String email) {
        return null;
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        return false;
    }
}
