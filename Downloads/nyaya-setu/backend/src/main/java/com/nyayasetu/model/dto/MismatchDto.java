package com.nyayasetu.model.dto;

public record MismatchDto(String field, String firstValue, String secondValue, String explanation) {
}
