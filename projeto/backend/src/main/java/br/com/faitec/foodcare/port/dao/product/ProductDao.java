package br.com.faitec.foodcare.port.dao.product;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

public interface ProductDao extends CrudDao<Product>, UpdateNameDao, UpdateQuantityDao, UpdateExpirationDateDao  {
}
