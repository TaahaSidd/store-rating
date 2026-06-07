package com.spicalabs.store_rating.controller;

import com.spicalabs.store_rating.dtos.response.OwnerDashboardResponse;
import com.spicalabs.store_rating.services.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {
    @Autowired
    private OwnerService ownerService;

    @GetMapping("/dashboard")
    public ResponseEntity<OwnerDashboardResponse> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ownerService.getDashboard(userDetails.getUsername()));
    }

}
