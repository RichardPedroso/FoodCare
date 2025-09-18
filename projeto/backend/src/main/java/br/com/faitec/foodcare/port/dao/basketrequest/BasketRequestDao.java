package br.com.faitec.foodcare.port.dao.basketrequest;

import br.com.faitec.foodcare.domain.BasketRequest;

import java.util.List;

public interface BasketRequestDao {
    List<BasketRequest> findAll();
    BasketRequest findByid(int id);
    List<BasketRequest> findByUserId(int userId);
    int create(BasketRequest entity);
    void update(int id, BasketRequest entity);
    void delete(int id);
}