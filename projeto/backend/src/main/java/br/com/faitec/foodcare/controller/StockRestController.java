package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Controller REST para gerenciamento de estoque.
 * Permite CRUD completo de itens em estoque e consultas por produto.
 */
@RestController
@RequestMapping("/api/stock")
public class StockRestController {
    private final StockService stockService;

    /** Construtor com injeção do serviço de estoque */
    public StockRestController(StockService stockService) {
        this.stockService = stockService;
    }

    /** Lista todos os itens em estoque */
    @GetMapping
    public ResponseEntity<List<Stock>> getEntities() {
        List<Stock> entities = stockService.findAll();
        return ResponseEntity.ok(entities);
    }

    /** Busca um item de estoque específico pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getEntityById(@PathVariable final int id) {
        Stock entity = stockService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    /** Lista todos os itens em estoque de um produto específico */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Stock>> getStockByProductId(@PathVariable final int productId) {
        List<Stock> stocks = stockService.findByProductId(productId);
        return ResponseEntity.ok(stocks);
    }

    /** Remove um item do estoque pelo ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        stockService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Adiciona um novo item ao estoque */
    @PostMapping
    public ResponseEntity<Stock> create(@RequestBody final Stock data) {
        final int id = stockService.create(data);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    /** Atualiza um item de estoque existente */
    @PutMapping("/{id}")
    public ResponseEntity<Stock> update(@PathVariable final int id, @RequestBody final Stock data) {
        data.setId(id);
        stockService.update(id, data);

        return ResponseEntity.noContent().build();
    }
}