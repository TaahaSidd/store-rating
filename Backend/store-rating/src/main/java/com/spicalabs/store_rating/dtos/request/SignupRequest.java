package com.spicalabs.store_rating.dtos.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 20, max = 60, message = "Name must be between 20 and 60 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Must follow standard email validation rules")
    private String email;

    @NotBlank(message = "Address is required")
    @Size(max = 400, message = "Address cannot exceed 400 characters")
    private String address;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\",./<>?`|\\\\~]).{8,16}$",
        message = "Password must be 8-16 characters and include at least one uppercase letter and one special character"
    )
    private String password;
}

