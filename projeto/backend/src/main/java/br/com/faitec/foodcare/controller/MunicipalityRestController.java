package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.UpdateMunicipalityDto;
import br.com.faitec.foodcare.port.service.municipality.MunicipalityService;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller REST para gerenciamento de municípios.
 * Permite CRUD de municípios e consulta de usuários por município.
 */
@RestController
@RequestMapping("/api/municipality")
public class MunicipalityRestController {
    private final MunicipalityService municipalityService;
    private final UserService userService;

    /** Construtor com injeção dos serviços de município e usuário */
    public MunicipalityRestController(MunicipalityService municipalityService, UserService userService) {
        this.municipalityService = municipalityService;
        this.userService = userService;
    }

    /** Lista todos os municípios cadastrados */
    @GetMapping
    public ResponseEntity<List<Municipality>> getEntities() {
        List<Municipality> entities = municipalityService.findAll();
        return ResponseEntity.ok(entities);
    }

    /** Busca um município específico pelo ID */
    @GetMapping("/{id}")
    public ResponseEntity<Municipality> getEntityById(@PathVariable final int id) {
        Municipality entity = municipalityService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    /** Lista todos os usuários de um município específico */
    @GetMapping("/{id}/users")
    public ResponseEntity<List<UserModel>> getUsersByMunicipalityId(@PathVariable final int id) {
        Municipality entity = municipalityService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        // Filtra usuários pelo município
        List<UserModel> users = userService.findAll().stream()
                .filter(user -> user.getMunicipalityId() == id)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(users);
    }

    /** Busca municípios por nome da cidade */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<Municipality>> getEntitiesByCity(@PathVariable final String city) {
        List<Municipality> entities = municipalityService.findByCity(city);
        return ResponseEntity.ok(entities);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        municipalityService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Municipality> create(@RequestBody final Municipality data) {
        final int id = municipalityService.create(data);
        data.setId(id);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).body(data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Municipality> update(@PathVariable final int id, @RequestBody final UpdateMunicipalityDto data) {
        Municipality entity = data.toMunicipality();
        municipalityService.update(id, entity);

        return ResponseEntity.noContent().build();
    }
}