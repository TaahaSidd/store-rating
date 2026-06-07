package com.spicalabs.store_rating.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {

    private UUID id;
    private String name;
    private String email;
    private String address;
    private String role;
    private Double averageRating;
}
