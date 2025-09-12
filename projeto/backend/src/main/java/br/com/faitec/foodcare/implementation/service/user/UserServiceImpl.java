package br.com.faitec.foodcare.implementation.service.user;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.stereotype.Service;
import java.util.List;

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

        if (entity.getName().isEmpty() || entity.getEmail().isEmpty() || isPassWordInvalid(entity.getPassword())) {
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
    public UserModel findById(int id) {
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

        UserModel userModel = findById(id);
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

        UserModel user = findById(id);
        if (user == null) {
            return false;
        }

        if (!user.getPassword().equals(oldPassword)) {
            return false;
        }

        boolean response = userDao.updatePassword(id, newPassword);

        return response;
    }

    @Override
    public List<UserModel> findByUserType(UserModel.UserType userType) {
        return userDao.findByUserType(userType);
    }

    @Override
    public List<UserModel> findByAbleStatus(Boolean able) {
        return userDao.findByAbleStatus(able);
    }

    @Override
    public boolean updateAbleStatus(int userId, Boolean able) {
        UserModel user = findById(userId);
        if (user == null || user.getUserType() != UserModel.UserType.BENEFICIARY) {
            return false;
        }
        return userDao.updateAbleStatus(userId, able);
    }

    @Override
    public List<UserModel> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return findAll();
        }
        return userDao.searchByName(name.trim());
    }

}
