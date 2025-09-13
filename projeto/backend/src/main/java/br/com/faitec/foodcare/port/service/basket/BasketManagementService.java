package br.com.faitec.foodcare.port.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.domain.Stock;

import java.util.List;

public interface BasketManagementService {
    boolean validateBasketItem(int productId, double quantity, String unit);
    List<BasketItem> calculateBasket(int userId, int peopleQuantity, boolean hasChildren);
    List<BasketItem> calculateBasket(int userId, int peopleQuantity, boolean hasChildren, int numberOfChildren);
    List<BasketItem> getBasketForFamily(int peopleQuantity, boolean hasChildren);
    List<Stock> getStockOptions(int productId);
    List<Stock> optimizeStockSelection(int productId, double requiredQuantity);
    boolean checkStockAvailability(int userId, int peopleQuantity, boolean hasChildren, int numberOfChildren);
}