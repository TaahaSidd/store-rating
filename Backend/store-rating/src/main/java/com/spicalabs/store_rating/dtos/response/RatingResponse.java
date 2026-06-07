package com.spicalabs.store_rating.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class RatingResponse {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private UUID userId;
    private String userName;
    private int rating;
}
