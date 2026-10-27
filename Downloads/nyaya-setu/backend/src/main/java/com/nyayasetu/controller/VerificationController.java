package com.nyayasetu.controller;

import com.nyayasetu.model.dto.VerifyResponse;
import com.nyayasetu.service.VerificationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/verify")
public class VerificationController {
    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public VerifyResponse verify(
            @RequestParam("landDeed") MultipartFile landDeed,
            @RequestParam("taxReceipt") MultipartFile taxReceipt) {
        return verificationService.verify(landDeed, taxReceipt);
    }
}
