package com.spicalabs.store_rating.services;

import com.spicalabs.store_rating.dtos.request.RatingRequest;
import com.spicalabs.store_rating.dtos.response.RatingResponse;
import com.spicalabs.store_rating.entities.Rating;
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

public class RatingService {
    @Autowired
    private RatingRepo ratingRepo;

    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private UserRepo userRepo;

    // Submit a new rating
    public RatingResponse submitRating(String email, RatingRequest request) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Store store = storeRepo.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        if (ratingRepo.findByUserIdAndStoreId(user.getId(), store.getId()).isPresent()) {
            throw new RuntimeException("You have already rated this store. Use update instead.");
        }

        Rating rating = Rating.builder()
                .user(user)
                .store(store)
                .rating(request.getRating())
                .build();

        return toResponse(ratingRepo.save(rating));
    }

    // Update existing rating
    public RatingResponse updateRating(String email, RatingRequest request) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating existing = ratingRepo.findByUserIdAndStoreId(user.getId(), request.getStoreId())
                .orElseThrow(() -> new RuntimeException("No rating found to update"));

        existing.setRating(request.getRating());
        return toResponse(ratingRepo.save(existing));
    }

    // Get all ratings for a store (used by store owner)
    public List<RatingResponse> getRatingsByStore(UUID storeId) {
        return ratingRepo.findByStoreId(storeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Get a user's rating for a specific store (used in store listing)
    public RatingResponse getUserRatingForStore(String email, UUID storeId) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Rating rating = ratingRepo.findByUserIdAndStoreId(user.getId(), storeId)
                .orElseThrow(() -> new RuntimeException("No rating submitted yet"));

        return toResponse(rating);
    }

    private RatingResponse toResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .storeId(rating.getStore().getId())
                .storeName(rating.getStore().getName())
                .userId(rating.getUser().getId())
                .userName(rating.getUser().getName())
                .rating(rating.getRating())
                .build();
    }
}
