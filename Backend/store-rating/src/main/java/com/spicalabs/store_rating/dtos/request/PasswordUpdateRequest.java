package com.spicalabs.store_rating.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordUpdateRequest {
    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 8, max = 16)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
            message = "Password must have at least one uppercase letter and one special character")
    private String newPassword;
}
