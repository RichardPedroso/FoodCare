package br.com.faitec.foodcare.controller;

import br.com.faitec.foodcare.domain.BasketRequest;
import br.com.faitec.foodcare.implementation.dao.postgres.BasketRequestDaoImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

@RestController
@RequestMapping("/api/basket-request")
public class BasketRequestRestController {

    private final BasketRequestDaoImpl basketRequestDao;

    public BasketRequestRestController() {
        try {
            Connection connection = DriverManager.getConnection(
                "jdbc:postgresql://localhost:5432/FoodCare",
                "postgres",
                "123456"
            );
            this.basketRequestDao = new BasketRequestDaoImpl(connection);
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to database", e);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BasketRequest>> getBasketRequestsByUserId(@PathVariable final int userId) {
        List<BasketRequest> basketRequests = basketRequestDao.findByUserId(userId);
        return ResponseEntity.ok(basketRequests);
    }

    @GetMapping
    public ResponseEntity<List<BasketRequest>> getAllBasketRequests() {
        List<BasketRequest> basketRequests = basketRequestDao.findAll();
        return ResponseEntity.ok(basketRequests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BasketRequest> getBasketRequestById(@PathVariable final int id) {
        BasketRequest basketRequest = basketRequestDao.findByid(id);
        if (basketRequest == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(basketRequest);
    }
}