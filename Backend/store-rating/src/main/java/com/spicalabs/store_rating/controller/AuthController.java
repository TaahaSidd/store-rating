package com.spicalabs.store_rating.controller;

import com.spicalabs.store_rating.dtos.request.LoginRequest;
import com.spicalabs.store_rating.dtos.request.SignupRequest;
import com.spicalabs.store_rating.dtos.response.AuthResponse;
import com.spicalabs.store_rating.entities.User;
import com.spicalabs.store_rating.entities.enums.Role;
import com.spicalabs.store_rating.entities.security.JwtUtils;
import com.spicalabs.store_rating.repo.UserRepo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("email", "Email is already taken"));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .address(request.getAddress())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.NORMAL_USER)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully! Proceed to login."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
        }

        String jwtToken = jwtUtils.generateToken(user.getEmail(), "ROLE_" + user.getRole().name());

        return ResponseEntity.ok(new AuthResponse(
                jwtToken,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        ));
    }
}