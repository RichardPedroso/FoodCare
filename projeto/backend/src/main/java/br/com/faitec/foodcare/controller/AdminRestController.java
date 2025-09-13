package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.request.RequestService;
import br.com.faitec.foodcare.port.service.user.UserService;
import br.com.faitec.foodcare.port.service.authorization.AuthorizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {
    
    private final RequestService requestService;
    private final UserService userService;
    private final AuthorizationService authorizationService;

    public AdminRestController(RequestService requestService, UserService userService, AuthorizationService authorizationService) {
        this.requestService = requestService;
        this.userService = userService;
        this.authorizationService = authorizationService;
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<Request>> getPendingRequests(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        UserModel currentUser = userService.findById(userId);
        if (!authorizationService.canManageRequests(currentUser)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Request> requests = requestService.findByStatus(Request.RequestStatus.PENDING);
        return ResponseEntity.ok(requests);
    }

    @PatchMapping("/requests/{id}/approve")
    public ResponseEntity<Void> approveRequest(@PathVariable int id, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        UserModel currentUser = userService.findById(userId);
        if (!authorizationService.canManageRequests(currentUser)) {
            return ResponseEntity.status(403).build();
        }
        
        boolean updated = requestService.updateStatus(id, Request.RequestStatus.APPROVED);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PatchMapping("/requests/{id}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable int id) {
        boolean updated = requestService.updateStatus(id, Request.RequestStatus.REJECTED);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PatchMapping("/requests/{id}/complete")
    public ResponseEntity<Void> completeRequest(@PathVariable int id) {
        boolean updated = requestService.updateStatus(id, Request.RequestStatus.COMPLETED);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserModel>> getAllUsers(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        UserModel currentUser = userService.findById(userId);
        if (!authorizationService.canViewAllUsers(currentUser)) {
            return ResponseEntity.status(403).build();
        }
        
        List<UserModel> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/donors")
    public ResponseEntity<List<UserModel>> getDonors() {
        List<UserModel> users = userService.findAll().stream()
                .filter(user -> user.getUserType() == UserModel.UserType.DONOR)
                .toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/beneficiaries")
    public ResponseEntity<List<UserModel>> getBeneficiaries() {
        List<UserModel> users = userService.findAll().stream()
                .filter(user -> user.getUserType() == UserModel.UserType.BENEFICIARY)
                .toList();
        return ResponseEntity.ok(users);
    }
}