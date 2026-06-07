package com.spicalabs.store_rating.controller;

import com.spicalabs.store_rating.dtos.request.AdminUserRequest;
import com.spicalabs.store_rating.dtos.request.StoreRequest;
import com.spicalabs.store_rating.dtos.response.AdminStatsResponse;
import com.spicalabs.store_rating.dtos.response.StoreResponse;
import com.spicalabs.store_rating.dtos.response.UserResponse;
import com.spicalabs.store_rating.services.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // Create user (any role)
    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    // Create store
    @PostMapping("/stores")
    public ResponseEntity<StoreResponse> createStore(@Valid @RequestBody StoreRequest request) {
        return ResponseEntity.ok(adminService.createStore(request));
    }

    // List users with filters
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String role
    ) {
        return ResponseEntity.ok(adminService.getUsers(name, email, address, role));
    }

    // List stores with filters
    @GetMapping("/stores")
    public ResponseEntity<List<StoreResponse>> getStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address
    ) {
        return ResponseEntity.ok(adminService.getStores(name, address));
    }

    // Get single user detail
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }
}
