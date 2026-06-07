package com.spicalabs.store_rating.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spicalabs.store_rating.entities.Store;

public interface StoreRepo extends JpaRepository<Store, UUID> {
    boolean existsByEmail(String email);

    Optional<Store> findByOwnerId(UUID ownerId);

}
