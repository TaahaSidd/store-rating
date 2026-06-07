package com.spicalabs.store_rating.repo;

import com.spicalabs.store_rating.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RatingRepo extends JpaRepository<Rating, UUID> {
    Optional<Rating> findByUserIdAndStoreId(UUID userId, UUID storeId);

    List<Rating> findByStoreId(UUID storeId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.store.id = :storeId")
    Double findAverageRatingByStoreId(@Param("storeId") UUID storeId);
}
