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
    public ResponseEntity<List<BasketRequest>> getAllBasketRequests() {
        try (Connection connection = getConnection()) {
            BasketRequestDaoImpl basketRequestDao = new BasketRequestDaoImpl(connection);
            List<BasketRequest> basketRequests = basketRequestDao.findAll();
            return ResponseEntity.ok(basketRequests);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
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
}