package br.com.faitec.foodcare.port.dao.crud;

public interface UpdateDao<T> {
    void update(final int id, final T entity);
}
