package com.spicalabs.store_rating.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalStores;
    private long totalRatings;
}
