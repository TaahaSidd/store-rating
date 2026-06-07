package com.spicalabs.store_rating.services;

import com.spicalabs.store_rating.dtos.request.AdminUserRequest;
import com.spicalabs.store_rating.dtos.request.StoreRequest;
import com.spicalabs.store_rating.dtos.response.AdminStatsResponse;
import com.spicalabs.store_rating.dtos.response.StoreResponse;
import com.spicalabs.store_rating.dtos.response.UserResponse;
import com.spicalabs.store_rating.entities.User;
import com.spicalabs.store_rating.entities.enums.Role;
import com.spicalabs.store_rating.repo.RatingRepo;
import com.spicalabs.store_rating.repo.StoreRepo;
import com.spicalabs.store_rating.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private RatingRepo ratingRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private StoreService storeService;

    // Dashboard stats
    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepo.count())
                .totalStores(storeRepo.count())
                .totalRatings(ratingRepo.count())
                .build();
    }

    // Create any user (normal, admin, store owner)
    public UserResponse createUser(AdminUserRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .role(Role.valueOf(request.getRole()))
                .build();

        return toUserResponse(userRepo.save(user), null);
    }

    // Create store (delegates to StoreService)
    public StoreResponse createStore(StoreRequest request) {
        return storeService.createStore(request);
    }

    // List all users with optional filters
    public List<UserResponse> getUsers(String name, String email, String address, String role) {
        return userRepo.findAll().stream()
                .filter(u -> name == null || u.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(u -> email == null || u.getEmail().toLowerCase().contains(email.toLowerCase()))
                .filter(u -> address == null || u.getAddress().toLowerCase().contains(address.toLowerCase()))
                .filter(u -> role == null || u.getRole().name().equalsIgnoreCase(role))
                .map(u -> {
                    Double avg = null;
                    if (u.getRole() == Role.STORE_OWNER) {
                        // find store owned by this user and get its average rating
                        avg = storeRepo.findByOwnerId(u.getId())
                                .map(s -> ratingRepo.findAverageRatingByStoreId(s.getId()))
                                .orElse(null);
                    }
                    return toUserResponse(u, avg);
                })
                .toList();
    }

    // List all stores with filters (delegates to StoreService)
    public List<StoreResponse> getStores(String name, String address) {
        return storeService.getAllStores(name, address);
    }

    // Get single user detail
    public UserResponse getUserById(UUID id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Double avg = null;
        if (user.getRole() == Role.STORE_OWNER) {
            avg = storeRepo.findByOwnerId(user.getId())
                    .map(s -> ratingRepo.findAverageRatingByStoreId(s.getId()))
                    .orElse(null);
        }

        return toUserResponse(user, avg);
    }

    private UserResponse toUserResponse(User user, Double avg) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .role(user.getRole().name())
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : null)
                .build();
    }
}
