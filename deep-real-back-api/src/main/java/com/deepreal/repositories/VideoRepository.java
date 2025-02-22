package com.deepreal.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deepreal.models.Video;

public interface VideoRepository extends JpaRepository<Video, UUID> {
    
    Optional<Video> findByUserId(UUID userId);
    
}
