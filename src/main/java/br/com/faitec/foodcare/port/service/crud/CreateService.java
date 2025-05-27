package br.com.faitec.foodcare.port.service.crud;

public interface CreateService<T> {
    int create(final T entity);
}
