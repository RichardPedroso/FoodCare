package br.com.faitec.foodcare.port.service.product;

import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.service.crud.CrudService;

public interface ProductService extends CrudService<Product>, UpdateNameService, UpdateQuantityService, UpdateExpirationDateService {
}
