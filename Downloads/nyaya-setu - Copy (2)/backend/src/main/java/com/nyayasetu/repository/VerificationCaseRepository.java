package com.nyayasetu.repository;

import com.nyayasetu.model.entity.VerificationCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface VerificationCaseRepository extends JpaRepository<VerificationCase, UUID> {
}
