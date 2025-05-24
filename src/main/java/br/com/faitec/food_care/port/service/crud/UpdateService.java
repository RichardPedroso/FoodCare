package br.com.faitec.food_care.port.service.crud;

public interface UpdateService<T> {
    void update(final int id, final T entity);
}
