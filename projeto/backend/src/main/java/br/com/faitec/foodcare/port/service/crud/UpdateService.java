package br.com.faitec.foodcare.port.service.crud;

public interface UpdateService<T> {
    void update(final int id, final T entity);
}
