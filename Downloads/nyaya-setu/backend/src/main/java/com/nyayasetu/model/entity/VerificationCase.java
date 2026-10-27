package com.nyayasetu.model.entity;

import com.nyayasetu.model.enums.CaseStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "verification_case")
public class VerificationCase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private CaseStatus status = CaseStatus.PENDING;

    @Column(name = "risk_score", nullable = false)
    private int riskScore;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected VerificationCase() {
    }

    public UUID getId() {
        return id;
    }

    public CaseStatus getStatus() {
        return status;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
