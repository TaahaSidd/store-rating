package com.spicalabs.store_rating.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class StoreRequest {

    @NotBlank
    @Size(min = 20, max = 60)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(max = 400)
    private String address;

    private UUID ownerId;
}
