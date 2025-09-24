package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.domain.dto.UpdateDonationProductDto;
import br.com.faitec.foodcare.port.service.donationproduct.DonationProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Controller REST para gerenciamento de produtos em doações.
 * Permite associar produtos às doações com quantidades específicas.
 */
@RestController
@RequestMapping("/api/donation-product")
public class DonationProductRestController {
    private final DonationProductService donationProductService;

    /** Construtor com injeção do serviço de produtos de doação */
    public DonationProductRestController(DonationProductService donationProductService) {
        this.donationProductService = donationProductService;
    }

    /** Lista todos os produtos de doação cadastrados */
    @GetMapping
    public ResponseEntity<List<DonationProduct>> getEntities() {
        List<DonationProduct> entities = donationProductService.findAll();
        return ResponseEntity.ok(entities);
    }

    /** Busca um produto de doação específico pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<DonationProduct> getEntityById(@PathVariable final int id) {
        DonationProduct entity = donationProductService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    /** Lista todos os produtos associados a uma doação específica */
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<DonationProduct>> getEntitiesByDonationId(@PathVariable final int donationId) {
        List<DonationProduct> entities = donationProductService.findByDonationId(donationId);
        return ResponseEntity.ok(entities);
    }

    /** Lista todas as doações que contêm um produto específico */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<DonationProduct>> getEntitiesByProductId(@PathVariable final int productId) {
        List<DonationProduct> entities = donationProductService.findByProductId(productId);
        return ResponseEntity.ok(entities);
    }

    /** Remove um produto de doação pelo ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        donationProductService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Cria uma nova associação produto-doação */
    @PostMapping
    public ResponseEntity<DonationProduct> create(@RequestBody final DonationProduct data) {
        final int id = donationProductService.create(data);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    /** Atualiza uma associação produto-doação existente */
    @PutMapping("/{id}")
    public ResponseEntity<DonationProduct> update(@PathVariable final int id, @RequestBody final UpdateDonationProductDto data) {
        DonationProduct entity = data.toDonationProduct();
        donationProductService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}