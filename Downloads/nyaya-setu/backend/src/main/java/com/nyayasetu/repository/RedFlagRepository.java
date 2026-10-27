package com.nyayasetu.repository;

import com.nyayasetu.model.entity.RedFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RedFlagRepository extends JpaRepository<RedFlag, UUID> {
}
