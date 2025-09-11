package br.com.faitec.foodcare.implementation.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.port.dao.product.ProductDao;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BasketManagementServiceImpl implements BasketManagementService {

    private final ProductDao productDao;

    public BasketManagementServiceImpl(ProductDao productDao) {
        this.productDao = productDao;
    }

    @Override
    public boolean addToBasket(int productId, double quantity, String unit, String expirationDate) {
        if (!validateBasketItem(productId, quantity, unit)) {
            return false;
        }
        
        double availableStock = productDao.getAvailableStock(productId);
        if (availableStock < quantity) {
            return false;
        }
        
        return productDao.updateStock(productId, -quantity);
    }

    @Override
    public boolean removeFromBasket(int productId, double quantity) {
        return productDao.updateStock(productId, quantity);
    }

    @Override
    public List<BasketItem> getBasketItems(int donationId) {
        List<Product> products = productDao.findAll();
        return products.stream()
                .map(product -> new BasketItem(
                        product.getId(),
                        product.getName(),
                        product.getStock(),
                        product.getUnitQuantity(),
                        product.getUnitType()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public boolean validateBasketItem(int productId, double quantity, String unit) {
        if (quantity <= 0) {
            return false;
        }
        
        Product product = productDao.findByid(productId);
        if (product == null) {
            return false;
        }
        
        return unit != null && (unit.equals("KG") || unit.equals("G") || unit.equals("L") || unit.equals("ML"));
    }
}