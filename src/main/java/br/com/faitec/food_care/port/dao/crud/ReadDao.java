package br.com.faitec.food_care.port.dao.crud;

import java.util.List;

public interface ReadDao<T> {
    T findByid(final int id);

    List<T> findAll();
}
