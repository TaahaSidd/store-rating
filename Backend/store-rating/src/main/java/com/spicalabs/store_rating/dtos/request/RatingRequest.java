package com.spicalabs.store_rating.dtos.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data

public class RatingRequest {

    @NotNull
    private UUID storeId;

    @Min(1)
    @Max(5)
    private int rating;
}
