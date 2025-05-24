package br.com.faitec.food_care.port.service.crud;

import java.util.List;

public interface ReadService<T> {
    T findByid(final int id);

    List<T> findAll();
}
