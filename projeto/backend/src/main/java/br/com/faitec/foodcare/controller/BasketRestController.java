package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/basket")
public class BasketRestController {

    private final BasketManagementService basketManagementService;

    public BasketRestController(BasketManagementService basketManagementService) {
        this.basketManagementService = basketManagementService;
    }

    @PostMapping("/add")
    public ResponseEntity<Boolean> addToBasket(@RequestBody Map<String, Object> request) {
        int productId = (Integer) request.get("productId");
        double quantity = ((Number) request.get("quantity")).doubleValue();
        String unit = (String) request.get("unit");
        String expirationDate = (String) request.get("expirationDate");
        
        boolean success = basketManagementService.addToBasket(productId, quantity, unit, expirationDate);
        return ResponseEntity.ok(success);
    }

    @PostMapping("/remove")
    public ResponseEntity<Boolean> removeFromBasket(@RequestBody Map<String, Object> request) {
        int productId = (Integer) request.get("productId");
        double quantity = ((Number) request.get("quantity")).doubleValue();
        
        boolean success = basketManagementService.removeFromBasket(productId, quantity);
        return ResponseEntity.ok(success);
    }

    @GetMapping("/items/{donationId}")
    public ResponseEntity<List<BasketItem>> getBasketItems(@PathVariable int donationId) {
        List<BasketItem> items = basketManagementService.getBasketItems(donationId);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateBasketItem(@RequestBody Map<String, Object> request) {
        int productId = (Integer) request.get("productId");
        double quantity = ((Number) request.get("quantity")).doubleValue();
        String unit = (String) request.get("unit");
        
        boolean valid = basketManagementService.validateBasketItem(productId, quantity, unit);
        return ResponseEntity.ok(valid);
    }
}