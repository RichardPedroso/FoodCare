package br.com.faitec.food_care.port.dao.crud;

public interface UpdateDao<T> {
    void update(final int id, final T entity);
}
