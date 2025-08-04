package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.domain.DonationProduct;
import br.com.faitec.foodcare.domain.dto.UpdateDonationDto;
import br.com.faitec.foodcare.port.service.donation.DonationService;
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

    public DonationRestController(DonationService donationService, DonationProductService donationProductService) {
        this.donationService = donationService;
        this.donationProductService = donationProductService;
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

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donation> update(@PathVariable final int id, @RequestBody final UpdateDonationDto data) {
        Donation entity = data.toDonation();
        donationService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}