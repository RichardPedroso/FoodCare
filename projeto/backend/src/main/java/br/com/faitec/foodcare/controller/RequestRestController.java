package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.domain.dto.UpdateRequestDto;
import br.com.faitec.foodcare.port.service.request.RequestService;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/request")
public class RequestRestController {
    private final RequestService requestService;
    private final UserService userService;

    public RequestRestController(RequestService requestService, UserService userService) {
        this.requestService = requestService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Request>> getEntities() {
        List<Request> entities = requestService.findAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> getEntityById(@PathVariable final int id) {
        Request entity = requestService.findById(id);

        if (entity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(entity);
    }

    @GetMapping("/{id}/user")
    public ResponseEntity<UserModel> getRequestUser(@PathVariable final int id) {
        Request request = requestService.findById(id);

        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        UserModel user = userService.findById(request.getUserId());

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Request>> getRequestsByUserId(@PathVariable final int userId) {
        UserModel user = userService.findById(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Request> requests = requestService.findByUserId(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Request>> getRequestsByStatus(@PathVariable final String status) {
        try {
            Request.RequestStatus requestStatus = Request.RequestStatus.valueOf(status.toUpperCase());
            List<Request> requests = requestService.findByStatus(requestStatus);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Request>> getRequestsByType(@PathVariable final String type) {
        try {
            Request.RequestType requestType = Request.RequestType.valueOf(type.toUpperCase());
            List<Request> requests = requestService.findByRequestType(requestType);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable final int id) {
        requestService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Request> create(@RequestBody final Request data) {
        final int id = requestService.create(data);

        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Request> update(@PathVariable final int id, @RequestBody final UpdateRequestDto data) {
        Request entity = data.toRequest();
        requestService.update(id, entity);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable final int id, @RequestBody final Map<String, String> statusData) {
        String statusStr = statusData.get("status");
        
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Request.RequestStatus newStatus = Request.RequestStatus.valueOf(statusStr.toUpperCase());
            boolean updated = requestService.updateStatus(id, newStatus);
            return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}