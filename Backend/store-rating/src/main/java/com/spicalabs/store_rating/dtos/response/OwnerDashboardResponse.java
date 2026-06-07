package com.spicalabs.store_rating.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class OwnerDashboardResponse {
    private String storeName;
    private Double averageRating;
    private List<RatingResponse> ratings;
}
