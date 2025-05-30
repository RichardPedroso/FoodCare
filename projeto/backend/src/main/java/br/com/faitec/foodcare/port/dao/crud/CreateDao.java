package br.com.faitec.foodcare.port.dao.crud;

public interface CreateDao<T> {
    int create(final T entity);
}
