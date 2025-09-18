package br.com.faitec.foodcare.controller;


import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.UpdatePasswordDto;
import br.com.faitec.foodcare.domain.dto.UpdateUserDto;
import br.com.faitec.foodcare.domain.dto.UserResponseDto;
import br.com.faitec.foodcare.port.service.municipality.MunicipalityService;
import br.com.faitec.foodcare.port.service.request.RequestService;
import br.com.faitec.foodcare.port.service.user.UserService;
import br.com.faitec.foodcare.port.service.authorization.AuthorizationService;
import br.com.faitec.foodcare.port.service.file.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/user")

public class UserRestController {
    private final UserService userService;
    private final MunicipalityService municipalityService;
    private final RequestService requestService;
    private final AuthorizationService authorizationService;
    private final FileStorageService fileStorageService;

    public UserRestController(UserService userService, MunicipalityService municipalityService, RequestService requestService, AuthorizationService authorizationService, FileStorageService fileStorageService){
        this.userService = userService;
        this.municipalityService = municipalityService;
        this.requestService = requestService;
        this.authorizationService = authorizationService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping()
    public ResponseEntity<List<UserResponseDto>> getEntities() {
        List<UserModel> entities = userService.findAll();
        List<UserResponseDto> response = entities.stream()
                .map(UserResponseDto::fromUserModel)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getEntityById(@PathVariable final int id) {
        UserModel entity = userService.findById(id);

        return entity == null ? ResponseEntity.notFound().build() : 
               ResponseEntity.ok(UserResponseDto.fromUserModel(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable final int id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<UserModel> create(@RequestBody final UserModel data) {
        try {
            final int id = userService.create(data);
            
            if (id == -1) {
                return ResponseEntity.badRequest().build();
            }
            
            data.setId(id);
            final URI uri = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(id)
                    .toUri();
            return ResponseEntity.created(uri).body(data);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/beneficiary")
    public ResponseEntity<UserModel> createBeneficiary(
            @RequestParam("user") String userJson,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        
        try {
            UserModel user = new com.fasterxml.jackson.databind.ObjectMapper().readValue(userJson, UserModel.class);
            
            if (user.getUserType() == UserModel.UserType.beneficiary) {
                if (documents != null && !documents.isEmpty()) {
                    List<String> documentPaths = fileStorageService.storeFiles(documents, "documents");
                    user.setDocuments(documentPaths);
                }
                
                if (images != null && !images.isEmpty()) {
                    List<String> imagePaths = fileStorageService.storeFiles(images, "images");
                    user.setImages(imagePaths);
                }
            }
            
            final int id = userService.create(user);
            
            final URI uri = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(id)
                    .toUri();
            return ResponseEntity.created(uri).build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
    public ResponseEntity<UserResponseDto> getEntityByEmail(@PathVariable final String email) {

        final UserModel entity = userService.findByEmail(email);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(UserResponseDto.fromUserModel(entity));
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
    
    @GetMapping("/{id}/requests")
    public ResponseEntity<List<Request>> getUserRequests(@PathVariable final int id) {
        UserModel user = userService.findById(id);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        List<Request> requests = requestService.findByUserId(id);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}/is-admin")
    public ResponseEntity<Boolean> isUserAdmin(@PathVariable final int id) {
        UserModel user = userService.findById(id);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        boolean isAdmin = authorizationService.isAdmin(user);
        return ResponseEntity.ok(isAdmin);
    }
    
    @GetMapping("/beneficiaries")
    public ResponseEntity<List<UserResponseDto>> getBeneficiaries() {
        List<UserModel> beneficiaries = userService.findByUserType(UserModel.UserType.beneficiary);
        List<UserResponseDto> response = beneficiaries.stream()
                .map(UserResponseDto::fromUserModel)
                .toList();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/beneficiaries/status/{status}")
    public ResponseEntity<List<UserResponseDto>> getBeneficiariesByStatus(@PathVariable String status) {
        Boolean able = null;
        if ("approved".equals(status)) {
            able = true;
        } else if ("rejected".equals(status)) {
            able = false;
        }
        
        List<UserModel> beneficiaries = userService.findByAbleStatus(able);
        List<UserResponseDto> response = beneficiaries.stream()
                .map(UserResponseDto::fromUserModel)
                .toList();
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateUserStatus(@PathVariable int id, @RequestParam Boolean able) {
        boolean success = userService.updateAbleStatus(id, able);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDto>> searchUsers(@RequestParam String name) {
        List<UserModel> users = userService.searchByName(name);
        List<UserResponseDto> response = users.stream()
                .map(UserResponseDto::fromUserModel)
                .toList();
        return ResponseEntity.ok(response);
    }
}
