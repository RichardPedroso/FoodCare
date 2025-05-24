package br.com.faitec.food_care.port.dao.crud;

public interface CrudDao<T> extends CreateDao<T>, DeleteDao, UpdateDao<T>, ReadDao<T>{
}
