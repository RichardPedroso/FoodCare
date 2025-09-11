package br.com.faitec.foodcare.port.dao.stock;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

import java.util.List;

public interface StockDao extends CrudDao<Stock> {
    List<Stock> findByProductId(int productId);
}