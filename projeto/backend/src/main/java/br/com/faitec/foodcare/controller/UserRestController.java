package br.com.faitec.foodcare.controller;


import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.UpdatePasswordDto;
import br.com.faitec.foodcare.domain.dto.UpdateUserDto;
import br.com.faitec.foodcare.port.service.municipality.MunicipalityService;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserRestController {
    private final UserService userService;
    private final MunicipalityService municipalityService;

    public UserRestController(UserService userService, MunicipalityService municipalityService){
        this.userService = userService;
        this.municipalityService = municipalityService;
    }

    @GetMapping()
    public ResponseEntity<List<UserModel>> getEntities() {
        List<UserModel> entities = userService.findAll();

        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserModel> getEntityById(@PathVariable final int id) {
        UserModel entity = userService.findById(id);

        return entity == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(entity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<UserModel> create(@RequestBody final UserModel data) {
        final int id = userService.create(data);

        final URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserModel> update(@PathVariable final int id, @RequestBody final UpdateUserDto data) {

        UserModel entity = data.toUserModel();
        userService.update(id, entity);

        return ResponseEntity.noContent().build();


    }

    @PutMapping("/update-password")
    public ResponseEntity<Void> updatePassword(@RequestBody final UpdatePasswordDto data) {

        final boolean response = userService.updatePassword(data.getId(), data.getOldPassword(), data.getNewPassword());

        return response ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserModel> getEntityByEmail(@PathVariable final String email) {

        final UserModel entity = userService.findByEmail(email);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    @GetMapping("/{id}/municipality")
    public ResponseEntity<Municipality> getUserMunicipality(@PathVariable final int id) {
        UserModel user = userService.findById(id);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        Municipality municipality = municipalityService.findById(user.getMunicipalityId());
        
        if (municipality == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(municipality);
    }
}
