package br.com.faitec.food_care.port.service.crud;

public interface CrudService<T> extends CreateService<T>, DeleteService, UpdateService<T>, ReadService<T> {
}
