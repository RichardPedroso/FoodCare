package br.com.faitec.food_care.implementation.service.user;

import br.com.faitec.food_care.domain.UserModel;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;

    public UserServiceImpl(UserDao userDao){
        this.userDao = userDao;
    }

    @Override
    public int create(UserModel entity) {
        int invalidResponse = -1;
        if (entity == null) {
            return invalidResponse;
        }

        if (entity.getFullname().isEmpty() || entity.getEmail().isEmpty() || isPassWordInvalid(entity.getPassword())) {
            return invalidResponse;
        }
        final int id = userDao.create(entity);
        return id;
    }

    private boolean isPassWordInvalid(final String password) {

        if (password.isEmpty()) {
            return true;
        }

        if (password.length() < 3) {
            return true;
        }
        return false;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }
        userDao.delete(id);
    }

    @Override
    public UserModel findByid(int id) {
        if (id < 0) {
            return null;
        }
        UserModel entity = userDao.findByid(id);
        return entity;
    }

    @Override
    public List<UserModel> findAll() {
        final List<UserModel> entities = userDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, UserModel entity) {
        if (id != entity.getId()) {
            return;
        }

        UserModel userModel = findByid(id);
        if (userModel == null) {
            return;
        }

        userDao.update(id, entity);
    }

    @Override
    public UserModel findByEmail(String email) {

        if (email.isEmpty()) {
            return null;
        }

        UserModel user = userDao.findByEmail(email);

        return user;
    }

    @Override
    public boolean updatePassword(int id, String oldPassword, String newPassword) {

        UserModel user = findByid(id);
        if (user == null) {
            return false;
        }

        if (!user.getPassword().equals(oldPassword)) {
            return false;
        }

        boolean response = userDao.updatePassword(id, newPassword);

        return true;
    }

}
