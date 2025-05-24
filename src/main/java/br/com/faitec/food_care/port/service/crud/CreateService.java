package br.com.faitec.food_care.port.service.crud;

public interface CreateService<T> {
    int create(final T entity);
}
