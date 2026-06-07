package com.spicalabs.store_rating.controller;

import com.spicalabs.store_rating.dtos.request.PasswordUpdateRequest;
import com.spicalabs.store_rating.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PasswordUpdateRequest request
    ) {
        return ResponseEntity.ok(userService.updatePassword(userDetails.getUsername(), request));
    }
}
