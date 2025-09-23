package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.BasketRequest;
import br.com.faitec.foodcare.implementation.dao.postgres.BasketRequestDaoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

@RestController
@RequestMapping("/api/basket_request")
public class BasketRequestRestController {

    private Connection getConnection() throws Exception {
        return DriverManager.getConnection(
            "jdbc:postgresql://localhost:5432/FoodCare",
            "postgres",
            "123456"
        );
    }

    @GetMapping
    public ResponseEntity<List<BasketRequest>> getBasketRequestsByUserId(
            @RequestParam final int user_id,
            @RequestParam(required = false) final String basket_type) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            List<BasketRequest> basketRequests = basketRequestDao.findByUserId(user_id);
            
            if (basket_type != null && !basket_type.isEmpty()) {
                basketRequests = basketRequests.stream()
                        .filter(request -> basket_type.equals(request.getBasketType()))
                        .collect(java.util.stream.Collectors.toList());
            }
            
            return ResponseEntity.ok(basketRequests);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BasketRequest>> getBasketRequestsByUserIdPath(@PathVariable final int userId) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            List<BasketRequest> basketRequests = basketRequestDao.findByUserId(userId);
            return ResponseEntity.ok(basketRequests);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/all")
    public List<BasketRequest> getAllBasketRequests() {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            return basketRequestDao.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BasketRequest> getBasketRequestById(@PathVariable final int id) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            BasketRequest basketRequest = basketRequestDao.findByid(id);
            if (basketRequest == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(basketRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<Integer> createBasketRequest(@RequestBody BasketRequest basketRequest) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            basketRequest.setId(0);
            int id = basketRequestDao.create(basketRequest);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<Void> approveBasketRequest(@PathVariable final int id) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            BasketRequest basketRequest = basketRequestDao.findByid(id);
            if (basketRequest != null) {
                basketRequest.setStatus("approved");
                basketRequestDao.update(id, basketRequest);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<Void> rejectBasketRequest(@PathVariable final int id) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            BasketRequest basketRequest = basketRequestDao.findByid(id);
            if (basketRequest != null) {
                basketRequest.setStatus("cancelled");
                basketRequestDao.update(id, basketRequest);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBasketRequest(@PathVariable final int id, @RequestBody BasketRequest basketRequest) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            basketRequestDao.update(id, basketRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateBasketRequestStatus(@PathVariable final int id, @RequestParam final String status) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            BasketRequest basketRequest = basketRequestDao.findByid(id);
            if (basketRequest != null) {
                basketRequest.setStatus(status);
                basketRequestDao.update(id, basketRequest);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBasketRequest(@PathVariable final int id) {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            basketRequestDao.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}