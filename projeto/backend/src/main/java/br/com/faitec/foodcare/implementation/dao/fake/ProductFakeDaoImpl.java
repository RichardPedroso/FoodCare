package br.com.faitec.foodcare.implementation.dao.fake;

import br.com.faitec.foodcare.domain.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductFakeDaoImpl implements ProductDao {
    private static List<Product> entities = new ArrayList<>();
    private static int ID = 0;

    public ProductFakeDaoImpl(){
        Product entity1 = new Product(
                getNextId(),
                "Arroz",
                10,
                "25/10/25"
        );

        Product entity2 = new Product(
                getNextId(),
                "Feijao",
                20,
                "31/11/26"
        );

        Product entity3 = new Product(
                getNextId(),
                "Macarrão",
                13,
                "25/09/26"
        );

        entities.add(entity1);
        entities.add(entity2);
        entities.add(entity3);


    }





    private int getNextId() {
        ID += 1;

        return ID;

    }


    @Override
    public int add(Product entity) {
        final int id = getNextId();
        entity.setId(id);
        entities.add(entity);
        return id;
    }

    @Override
    public void remove(int id) {
        int itemIndex = -1;

        for(int i = 0 ; i < entities.size(); i++){
            Product entity = entities.get(i);

            if(entity.getId() == id){
                itemIndex = i;
                break;
            }
        }

        if(itemIndex == -1){
            return;
        }

        Product removedEntity = entities.remove(itemIndex);

        System.out.println("A entidade " + removedEntity.getName() + "foi removida com sucesso.");
    }

    @Override
    public Product readById(int id) {
        for(Product entity : entities) {
            if (entity.getId() == id) {
                return entity;
            }
        }

        return null;
    }

    @Override
    public List<Product> readAll() {
        return entities;
    }

    @Override
    public void updateInformation(int id, Product entity) {
        for(Product data : entities){
            if(data.getId() == id){
                data.setName(entity.getName());
                break;
            }
        }

    }

    @Override
    public boolean updateName(int id, String newName) {
        for(Product data : entities){
            if(data.getId() == id){
                data.setName(newName);
                return true;
            }
        }

        return false;
    }


    @Override
    public boolean updateQuantity(int id, int newQuantity) {
        for (Product data : entities) {
            if (data.getId() == id) {
                data.setQuantity(newQuantity);
                return true;
            }
        }

        return false;
    }

    @Override
    public boolean updateExpirationDate(int id, String newExpirationDate) {
        for (Product data : entities) {
            if (data.getId() == id) {
                data.setExpirationDate(newExpirationDate);
                return true;
            }
        }

        return false;

}
