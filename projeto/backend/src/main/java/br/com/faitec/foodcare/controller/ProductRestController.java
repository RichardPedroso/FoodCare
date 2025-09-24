package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.domain.dto.UpdateProductDto;
import br.com.faitec.foodcare.port.service.category.CategoryService;
import br.com.faitec.foodcare.port.service.product.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Controller REST para gerenciamento de produtos.
 * Permite CRUD completo de produtos e atualizações específicas de nome e quantidade.
 */
@RestController
@RequestMapping("/api/product")
public class ProductRestController {
    private final ProductService productService;
    private final CategoryService categoryService;

    /** Construtor com injeção dos serviços de produto e categoria */
    public ProductRestController(ProductService productService, CategoryService categoryService){
        this.productService = productService;
        this.categoryService = categoryService;
    }

    /** Lista todos os produtos cadastrados */
    @GetMapping
    public ResponseEntity<List<Product>> getEntites(){
        List<Product> entities = productService.findAll();
        return ResponseEntity.ok(entities);
    }

    /** Busca um produto específico pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getEntityById(@PathVariable final int id){
        Product entity = productService.findById(id);

        if(entity == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id){
        productService.delete(id);
        return ResponseEntity.noContent().build();
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

    /** Atualiza apenas o nome de um produto */
    @PutMapping("/{id}/name")
    public ResponseEntity<Void> updateName(@PathVariable final int id, @RequestBody final String newName){
        boolean updated = productService.updateName(id, newName);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /** Atualiza apenas a quantidade em estoque de um produto */
    @PutMapping("/{id}/quantity")
    public ResponseEntity<Void> updateQuantity(@PathVariable final int id, @RequestBody final Integer newStock){
        boolean updated = productService.updateQuantity(id, newStock);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    /** Busca a categoria de um produto específico */
    @GetMapping("/{id}/category")
    public ResponseEntity<Category> getProductCategory(@PathVariable final int id) {
        Product product = productService.findById(id);
        
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        
        Category category = categoryService.findById(product.getCategoryId());
        
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(category);
    }


}
