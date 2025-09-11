package br.com.faitec.foodcare.port.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.DonationProduct;

import java.util.List;

public interface BasketManagementService {
    boolean addToBasket(int productId, double quantity, String unit, String expirationDate);
    boolean removeFromBasket(int productId, double quantity);
    List<BasketItem> getBasketItems(int donationId);
    boolean validateBasketItem(int productId, double quantity, String unit);
}