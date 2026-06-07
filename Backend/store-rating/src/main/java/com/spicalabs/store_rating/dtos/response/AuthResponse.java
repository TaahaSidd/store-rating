package com.spicalabs.store_rating.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private UUID id;
    private String name;
    private String email;
    private String role;
}
