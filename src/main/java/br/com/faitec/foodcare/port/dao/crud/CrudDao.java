package br.com.faitec.foodcare.port.dao.crud;

public interface CrudDao<T> extends CreateDao<T>, DeleteDao, UpdateDao<T>, ReadDao<T>{
}
