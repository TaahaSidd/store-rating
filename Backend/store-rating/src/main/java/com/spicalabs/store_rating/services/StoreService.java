package com.spicalabs.store_rating.services;

import com.spicalabs.store_rating.dtos.request.StoreRequest;
import com.spicalabs.store_rating.dtos.response.StoreResponse;
import com.spicalabs.store_rating.entities.Store;
import com.spicalabs.store_rating.entities.User;
import com.spicalabs.store_rating.repo.RatingRepo;
import com.spicalabs.store_rating.repo.StoreRepo;
import com.spicalabs.store_rating.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StoreService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RatingRepo ratingRepo;

    // Admin: create a store
    public StoreResponse createStore(StoreRequest request) {
        if (storeRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use by another store");
        }

        Store.StoreBuilder builder = Store.builder()
                .name(request.getName())
                .email(request.getEmail())
                .address(request.getAddress());

        if (request.getOwnerId() != null) {
            User owner = userRepo.findById(request.getOwnerId())
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            builder.owner(owner);
        }

        Store saved = storeRepo.save(builder.build());
        return toResponse(saved, null);
    }

    // All users: list all stores
    public List<StoreResponse> getAllStores(String name, String address) {
        return storeRepo.findAll().stream()
                .filter(s -> name == null || s.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(s -> address == null || s.getAddress().toLowerCase().contains(address.toLowerCase()))
                .map(s -> {
                    Double avg = ratingRepo.findAverageRatingByStoreId(s.getId());
                    return toResponse(s, avg);
                })
                .toList();
    }

    // Get single store detail
    public StoreResponse getStoreById(UUID id) {
        Store store = storeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Double avg = ratingRepo.findAverageRatingByStoreId(id);
        return toResponse(store, avg);
    }

    private StoreResponse toResponse(Store store, Double avg) {
        return StoreResponse.builder()
                .id(store.getId())
                .name(store.getName())
                .email(store.getEmail())
                .address(store.getAddress())
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : null)
                .ownerName(store.getOwner() != null ? store.getOwner().getName() : null)
                .build();
    }
}
