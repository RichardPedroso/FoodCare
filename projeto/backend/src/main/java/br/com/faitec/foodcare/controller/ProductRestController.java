package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

public class ProductRestController {
    private final ProductService productService;

    public ProductRestController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getEntites(){
        List<Product> entities = productService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getEntityById(@PathVariable final int id){
        Product entity = productService.findById(id);

        if(entity == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id){
        productService.delete(id);

        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody final Product data){
        final int id = productService.create(data);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable final int id, @RequestBody final UpdateProductDto data){
        Product entity = data.toProduct();
        productService.update(id, entity);


        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateName(@PathVariable final int id, @RequestBody final UpdateProductDto data){
        Product entity = data.toProduct();
        productService.update(id, entity);


        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updatePrice(@PathVariable final int id, @RequestBody final UpdateProductDto data){
        Product entity = data.toProduct();
        productService.update(id, entity);


        return ResponseEntity.noContent().build();
    }
}

