package com.spicalabs.store_rating.controller;

import com.spicalabs.store_rating.dtos.request.RatingRequest;
import com.spicalabs.store_rating.dtos.response.RatingResponse;
import com.spicalabs.store_rating.services.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    // NORMAL USER: submit rating
    @PostMapping
    @PreAuthorize("hasRole('NORMAL_USER')")
    public ResponseEntity<RatingResponse> submitRating(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(ratingService.submitRating(userDetails.getUsername(), request));
    }

    // NORMAL USER: update rating
    @PutMapping
    @PreAuthorize("hasRole('NORMAL_USER')")
    public ResponseEntity<RatingResponse> updateRating(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RatingRequest request
    ) {
        return ResponseEntity.ok(ratingService.updateRating(userDetails.getUsername(), request));
    }

    // STORE OWNER: get all ratings for their store
    @GetMapping("/store/{storeId}")
    @PreAuthorize("hasRole('STORE_OWNER')")
    public ResponseEntity<List<RatingResponse>> getRatingsByStore(@PathVariable UUID storeId) {
        return ResponseEntity.ok(ratingService.getRatingsByStore(storeId));
    }

    // NORMAL USER: get their own rating for a store
    @GetMapping("/my/{storeId}")
    @PreAuthorize("hasRole('NORMAL_USER')")
    public ResponseEntity<RatingResponse> getMyRating(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID storeId
    ) {
        return ResponseEntity.ok(ratingService.getUserRatingForStore(userDetails.getUsername(), storeId));
    }

}
