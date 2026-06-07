package com.spicalabs.store_rating.controller;

import com.spicalabs.store_rating.dtos.request.StoreRequest;
import com.spicalabs.store_rating.dtos.response.StoreResponse;
import com.spicalabs.store_rating.services.StoreService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    @Autowired
    private StoreService storeService;

    // ADMIN ONLY
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreResponse> createStore(@Valid @RequestBody StoreRequest request) {
        return ResponseEntity.ok(storeService.createStore(request));
    }

    // ALL AUTHENTICATED USERS
    @GetMapping
    public ResponseEntity<List<StoreResponse>> getAllStores(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address
    ) {
        return ResponseEntity.ok(storeService.getAllStores(name, address));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreResponse> getStore(@PathVariable UUID id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }
}
