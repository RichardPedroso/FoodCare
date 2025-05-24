package br.com.faitec.food_care.port.dao.crud;

public interface CreateDao<T> {
    int create(final T entity);
}
