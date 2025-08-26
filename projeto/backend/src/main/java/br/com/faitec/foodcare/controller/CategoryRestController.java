package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Category;
import br.com.faitec.foodcare.domain.Product;
import br.com.faitec.foodcare.domain.dto.UpdateCategoryDto;
import br.com.faitec.foodcare.port.service.category.CategoryService;
import br.com.faitec.foodcare.port.service.product.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/category")
public class CategoryRestController {
    private final CategoryService categoryService;
    private final ProductService productService;

    public CategoryRestController(CategoryService categoryService, ProductService productService) {
        this.categoryService = categoryService;
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getEntities() {
        List<Category> entities = categoryService.findAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getEntityById(@PathVariable final int id) {
        Category entity = categoryService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<Product>> getCategoryProducts(@PathVariable final int id) {
        Category category = categoryService.findById(id);

        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        List<Product> products = productService.findAll().stream()
                .filter(product -> product.getCategoryId() == id)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(products);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody final Category data) {
        final int id = categoryService.create(data);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable final int id, @RequestBody final UpdateCategoryDto data) {
        Category entity = data.toCategory();
        categoryService.update(id, entity);

        return ResponseEntity.noContent().build();
    }


}