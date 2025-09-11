package br.com.faitec.foodcare.port.service.stock;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface StockService extends CrudService<Stock> {
    List<Stock> findByProductId(int productId);
}