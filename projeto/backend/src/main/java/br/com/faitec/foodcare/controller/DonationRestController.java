package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.domain.dto.CreateCompleteDonationDto;
import br.com.faitec.foodcare.domain.dto.UpdateDonationDto;
import br.com.faitec.foodcare.port.service.donation.DonationService;
import br.com.faitec.foodcare.port.service.donation.DonationStockIntegrationService;
import br.com.faitec.foodcare.port.service.donationproduct.DonationProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/donation")

public class DonationRestController {
    private final DonationService donationService;
    private final DonationProductService donationProductService;
    private final DonationStockIntegrationService donationStockIntegrationService;

    public DonationRestController(DonationService donationService, 
                                DonationProductService donationProductService,
                                DonationStockIntegrationService donationStockIntegrationService) {
        this.donationService = donationService;
        this.donationProductService = donationProductService;
        this.donationStockIntegrationService = donationStockIntegrationService;
    }

    @GetMapping
    public ResponseEntity<List<Donation>> getEntities() {
        List<Donation> entities = donationService.findAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donation> getEntityById(@PathVariable final int id) {
        Donation entity = donationService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<DonationProduct>> getDonationProducts(@PathVariable final int id) {
        Donation entity = donationService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        List<DonationProduct> products = donationProductService.findByDonationId(id);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Donation>> getEntitiesByUserId(@PathVariable final int userId) {
        List<Donation> entities = donationService.findByUserId(userId);
        return ResponseEntity.ok(entities);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        donationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Donation> create(@RequestBody final Donation data) {
        final int id = donationService.create(data);
        
        if (id <= 0) {
            return ResponseEntity.badRequest().build();
        }
        
        // Buscar a doação criada para retornar com o ID
        Donation createdDonation = donationService.findById(id);
        
        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).body(createdDonation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donation> update(@PathVariable final int id, @RequestBody final UpdateDonationDto data) {
        Donation entity = data.toDonation();
        donationService.update(id, entity);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/confirm-receipt")
    public ResponseEntity<Boolean> confirmDonationReceipt(@PathVariable final int id) {
        boolean success = donationStockIntegrationService.confirmDonationReceipt(id);
        return ResponseEntity.ok(success);
    }

    @PostMapping("/{id}/process-to-stock")
    public ResponseEntity<Boolean> processDonationToStock(@PathVariable final int id, @RequestBody(required = false) java.util.Map<String, Object> body) {
        int units = 1; // padrão
        if (body != null && body.containsKey("units")) {
            units = (Integer) body.get("units");
        }
        boolean success = donationStockIntegrationService.processDonationToStockWithUnits(id, units);
        return ResponseEntity.ok(success);
    }

    @PostMapping("/create-and-process")
    public ResponseEntity<Boolean> createDonationAndProcessToStock(@RequestBody final Donation data) {
        final int donationId = donationService.create(data);
        
        if (donationId > 0) {
            // Automaticamente processar para estoque após criar a doação
            boolean processed = donationStockIntegrationService.processDonationToStock(donationId);
            return ResponseEntity.ok(processed);
        }
        
        return ResponseEntity.badRequest().body(false);
    }

    @PostMapping("/complete")
    public ResponseEntity<Boolean> createCompleteDonation(@RequestBody final CreateCompleteDonationDto data) {
        try {
            // 1. Criar a doação
            Donation donation = data.toDonation();
            final int donationId = donationService.create(donation);
            
            if (donationId <= 0) {
                return ResponseEntity.badRequest().body(false);
            }
            
            // 2. Criar os produtos da doação
            for (CreateCompleteDonationDto.DonationProductDto productDto : data.getProducts()) {
                DonationProduct donationProduct = productDto.toDonationProduct(donationId);
                donationProductService.create(donationProduct);
            }
            
            // 3. Processar automaticamente para estoque
            boolean processed = donationStockIntegrationService.processDonationToStock(donationId);
            
            return ResponseEntity.ok(processed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(false);
        }
    }
}