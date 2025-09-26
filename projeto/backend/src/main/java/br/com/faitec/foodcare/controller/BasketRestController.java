package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.BasketItem;
import br.com.faitec.foodcare.port.service.basket.BasketManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import br.com.faitec.foodcare.domain.Stock;

/**
 * Controller REST para gerenciamento de cestas básicas.
 * Calcula cestas personalizadas, valida itens e otimiza seleção de estoque.
 */
@RestController
@RequestMapping("/api/basket")
public class BasketRestController {

    private final BasketManagementService basketManagementService;

    /** Construtor com injeção do serviço de gerenciamento de cestas */
    public BasketRestController(BasketManagementService basketManagementService) {
        this.basketManagementService = basketManagementService;
    }



    /** Valida se um item pode ser adicionado à cesta com a quantidade especificada */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateBasketItem(@RequestBody Map<String, Object> request) {
        int productId = (Integer) request.get("productId");
        double quantity = ((Number) request.get("quantity")).doubleValue();
        String unitStr = (String) request.get("unit");
        
        try {
            br.com.faitec.foodcare.domain.Product.MeasureType unit = br.com.faitec.foodcare.domain.Product.MeasureType.valueOf(unitStr);
            boolean valid = basketManagementService.validateBasketItem(productId, quantity, unit);
            return ResponseEntity.ok(valid);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(false);
        }
    }

    /** 
     * Calcula uma cesta personalizada baseada no perfil familiar.
     * Considera quantidade de pessoas, presença e número de crianças.
     */
    @GetMapping("/calculate")
    public ResponseEntity<List<BasketItem>> calculateBasket(
            @RequestParam int userId,
            @RequestParam int peopleQuantity,
            @RequestParam boolean hasChildren,
            @RequestParam(defaultValue = "0") int numberOfChildren) {
        List<BasketItem> basketItems = basketManagementService.calculateBasket(userId, peopleQuantity, hasChildren, numberOfChildren);
        return ResponseEntity.ok(basketItems);
    }

    /** Gera uma cesta padrão para uma família com base no número de pessoas */
    @GetMapping("/family")
    public ResponseEntity<List<BasketItem>> getBasketForFamily(
            @RequestParam int peopleQuantity,
            @RequestParam boolean hasChildren) {
        List<BasketItem> basketItems = basketManagementService.getBasketForFamily(peopleQuantity, hasChildren);
        return ResponseEntity.ok(basketItems);
    }

    /** Busca todas as opções de estoque disponíveis para um produto */
    @GetMapping("/stock-options/{productId}")
    public ResponseEntity<List<Stock>> getStockOptions(@PathVariable int productId) {
        List<Stock> stockOptions = basketManagementService.getStockOptions(productId);
        return ResponseEntity.ok(stockOptions);
    }
    
    /** 
     * Otimiza a seleção de estoque para atender uma quantidade específica.
     * Prioriza itens com data de vencimento mais próxima.
     */
    @GetMapping("/optimize/{productId}")
    public ResponseEntity<List<Stock>> optimizeStockSelection(
            @PathVariable int productId,
            @RequestParam double requiredQuantity) {
        List<Stock> optimizedOptions = basketManagementService.optimizeStockSelection(productId, requiredQuantity);
        return ResponseEntity.ok(optimizedOptions);
    }
    
}