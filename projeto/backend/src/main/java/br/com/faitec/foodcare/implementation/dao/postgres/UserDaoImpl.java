package br.com.faitec.foodcare.implementation.dao.postgres;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class UserDaoImpl implements UserDao {

    private final List<UserModel> users = new ArrayList<>();
    private final AtomicInteger idGenerator = new AtomicInteger(1);

    @Override
    public int create(UserModel entity) {
        int id = idGenerator.getAndIncrement();
        entity.setId(id);
        users.add(entity);
        return id;
    }

    @Override
    public void delete(int id) {
        users.removeIf(user -> user.getId() == id);
    }

    @Override
    public UserModel findByid(int id) {
        return users.stream()
                .filter(user -> user.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<UserModel> findAll() {
        return new ArrayList<>(users);
    }

    @Override
    public void update(int id, UserModel entity) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId() == id) {
                entity.setId(id);
                users.set(i, entity);
                break;
            }
        }
    }

    @Override
    public UserModel findByEmail(String email) {
        return users.stream()
                .filter(user -> user.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        UserModel user = findByid(id);
        if (user != null) {
            user.setPassword(newPassword);
            return true;
        }
        return false;
    }
}
