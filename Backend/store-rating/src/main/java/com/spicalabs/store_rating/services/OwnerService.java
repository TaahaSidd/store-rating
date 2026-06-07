package com.spicalabs.store_rating.services;

import com.spicalabs.store_rating.dtos.response.OwnerDashboardResponse;
import com.spicalabs.store_rating.dtos.response.RatingResponse;
import com.spicalabs.store_rating.entities.Store;
import com.spicalabs.store_rating.entities.User;
import com.spicalabs.store_rating.repo.RatingRepo;
import com.spicalabs.store_rating.repo.StoreRepo;
import com.spicalabs.store_rating.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class OwnerService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private RatingRepo ratingRepo;

    @Autowired
    private UserRepo userRepo;

    public OwnerDashboardResponse getDashboard(String email) {
        User owner = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Store store = storeRepo.findByOwnerId(owner.getId())
                .orElseThrow(() -> new RuntimeException("No store found for this owner"));

        Double avg = ratingRepo.findAverageRatingByStoreId(store.getId());

        List<RatingResponse> ratings = ratingRepo.findByStoreId(store.getId())
                .stream()
                .map(r -> RatingResponse.builder()
                        .id(r.getId())
                        .storeId(store.getId())
                        .storeName(store.getName())
                        .userId(r.getUser().getId())
                        .userName(r.getUser().getName())
                        .rating(r.getRating())
                        .build())
                .toList();

        return OwnerDashboardResponse.builder()
                .storeName(store.getName())
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : null)
                .ratings(ratings)
                .build();
    }
}
