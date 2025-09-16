package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Stock;
import br.com.faitec.foodcare.port.service.stock.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/stock")

public class StockRestController {
    private final StockService stockService;

    public StockRestController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getEntities() {
        List<Stock> entities = stockService.findAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getEntityById(@PathVariable final int id) {
        Stock entity = stockService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Stock>> getStockByProductId(@PathVariable final int productId) {
        List<Stock> stocks = stockService.findByProductId(productId);
        return ResponseEntity.ok(stocks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        stockService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Stock> create(@RequestBody final Stock data) {
        final int id = stockService.create(data);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> update(@PathVariable final int id, @RequestBody final Stock data) {
        data.setId(id);
        stockService.update(id, data);

        return ResponseEntity.noContent().build();
    }
}