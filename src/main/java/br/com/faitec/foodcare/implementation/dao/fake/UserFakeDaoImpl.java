package br.com.faitec.foodcare.implementation.dao.fake;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;

import java.util.ArrayList;
import java.util.List;

public class UserFakeDaoImpl implements UserDao {
    private static List<UserModel> entities = new ArrayList<>();
    private static int ID = 0;

    public UserFakeDaoImpl(){
        UserModel entity1 = new UserModel(getNextID(), "adm@foodcare.com", "123", "Tiago", UserModel.UserRole.Administrador);

        UserModel entity2 = new UserModel(getNextID(), "usuario1@foodcare.com", "456", "Rogerio Ceni", UserModel.UserRole.User);

        UserModel entity3 = new UserModel(getNextID(), "adm2@foodcare.com", "789", "Eugenio biroba", UserModel.UserRole.Administrador );

        UserModel entity4 = new UserModel(getNextID(),"adm3@foodcare.com", "10101", "Richard mastergay", UserModel.UserRole.Administrador);


    }

    private int getNextID(){
        ID += 1;
        return ID;
    }

    @Override
    public int create(UserModel entity) {
        final int id = getNextID();
        entity.setId(id);
        entities.add(entity);
        return id;
    }


    @Override
    public void delete(int id) {
        int itemIndex = -1;

        for (int i = 0; i < entities.size(); i++) {

            UserModel entity = entities.get(i);
            if (entity.getId() == id) {
                itemIndex = i;
                break;
            }
        }

        if (itemIndex == -1) {
            return;
        }
        UserModel removeEntity = entities.remove(itemIndex);
        System.out.println("A entidade: " + removeEntity.getFullname() + " foi removida com sucesso");

    }

    @Override
    public UserModel findByid(int id) {
        for (UserModel entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    @Override
    public List<UserModel> findAll() {
        return entities;
    }

    @Override
    public void update(int id, UserModel entity) {
        for (UserModel data : entities) {
            if (data.getId() == id) {
                data.setFullname(entity.getFullname());
                break;
            }
        }
    }

    @Override
    public UserModel findByEmail(String email) {

        for (UserModel entity : entities) {
            if (entity.getEmail().equalsIgnoreCase(email)) {
                return entity;
            }
        }

        return null;
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        boolean response = false;
        for (UserModel entity : entities) {
            if (entity.getId() == id) {
                entity.setPassword(newPassword);
                response = true;
                break;
            }
        }

        return response;
    }

}
