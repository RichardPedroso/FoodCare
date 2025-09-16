package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import br.com.faitec.foodcare.domain.Stock;

@RestController
@RequestMapping("/api/basket")

public class BasketRestController {

    private final BasketManagementService basketManagementService;

    public BasketRestController(BasketManagementService basketManagementService) {
        this.basketManagementService = basketManagementService;
    }



    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateBasketItem(@RequestBody Map<String, Object> request) {
        int productId = (Integer) request.get("productId");
        double quantity = ((Number) request.get("quantity")).doubleValue();
        String unit = (String) request.get("unit");
        
        boolean valid = basketManagementService.validateBasketItem(productId, quantity, unit);
        return ResponseEntity.ok(valid);
    }

    @GetMapping("/calculate")
    public ResponseEntity<List<BasketItem>> calculateBasket(
            @RequestParam int userId,
            @RequestParam int peopleQuantity,
            @RequestParam boolean hasChildren,
            @RequestParam(defaultValue = "0") int numberOfChildren) {
        List<BasketItem> basketItems = basketManagementService.calculateBasket(userId, peopleQuantity, hasChildren, numberOfChildren);
        return ResponseEntity.ok(basketItems);
    }

    @GetMapping("/family")
    public ResponseEntity<List<BasketItem>> getBasketForFamily(
            @RequestParam int peopleQuantity,
            @RequestParam boolean hasChildren) {
        List<BasketItem> basketItems = basketManagementService.getBasketForFamily(peopleQuantity, hasChildren);
        return ResponseEntity.ok(basketItems);
    }

    @GetMapping("/stock-options/{productId}")
    public ResponseEntity<List<Stock>> getStockOptions(@PathVariable int productId) {
        List<Stock> stockOptions = basketManagementService.getStockOptions(productId);
        return ResponseEntity.ok(stockOptions);
    }
    
    @GetMapping("/optimize/{productId}")
    public ResponseEntity<List<Stock>> optimizeStockSelection(
            @PathVariable int productId,
            @RequestParam double requiredQuantity) {
        List<Stock> optimizedOptions = basketManagementService.optimizeStockSelection(productId, requiredQuantity);
        return ResponseEntity.ok(optimizedOptions);
    }
    
}