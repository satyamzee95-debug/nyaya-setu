package com.nyayasetu.model.dto;

import java.util.List;
import java.util.UUID;

public record VerifyResponse(
        UUID caseId,
        String status,
        int riskScore,
        String summary,
        List<ComparisonFieldDto> fields,
        List<String> redFlags) {
    public record ComparisonFieldDto(
            String field,
            String landDeedValue,
            String taxReceiptValue,
            String status,
            String explanation) {
    }
}
