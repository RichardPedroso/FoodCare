package br.com.faitec.foodcare.port.service.basket;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.domain.UserModel;

import java.util.List;

public interface BasketCalculationService {
    List<BasketItem> calculateBasicBasket(UserModel user);
    List<BasketItem> calculateHygieneBasket(UserModel user);
}