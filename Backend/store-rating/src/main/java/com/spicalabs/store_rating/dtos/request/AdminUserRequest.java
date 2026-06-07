package com.spicalabs.store_rating.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdminUserRequest {
    @NotBlank
    @Size(min = 20, max = 60)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, max = 16)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
            message = "Password must have at least one uppercase letter and one special character")
    private String password;

    @NotBlank
    @Size(max = 400)
    private String address;

    @NotNull
    private String role;
}
