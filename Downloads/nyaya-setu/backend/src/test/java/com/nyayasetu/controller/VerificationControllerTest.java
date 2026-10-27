package com.nyayasetu.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.nyayasetu.model.dto.VerifyResponse;
import com.nyayasetu.service.VerificationService;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class VerificationControllerTest {
    @Test
    void acceptsMultipartLandDeedAndTaxReceipt() throws Exception {
        VerificationService service = mock(VerificationService.class);
        UUID caseId = UUID.randomUUID();
        when(service.verify(any(), any())).thenReturn(new VerifyResponse(
                caseId,
                "REVIEW_REQUIRED",
                35,
                "Review the fields.",
                List.of(),
                List.of("Area differs.")));
        MockMvc mockMvc = MockMvcBuilders
                .standaloneSetup(new VerificationController(service))
                .build();
        MockMultipartFile deed = new MockMultipartFile(
                "landDeed", "deed.pdf", "application/pdf", "%PDF-test".getBytes());
        MockMultipartFile receipt = new MockMultipartFile(
                "taxReceipt", "receipt.png", "image/png", new byte[] {1, 2, 3});

        mockMvc.perform(multipart("/api/v1/verify")
                        .file(deed)
                        .file(receipt))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.caseId").value(caseId.toString()))
                .andExpect(jsonPath("$.riskScore").value(35))
                .andExpect(jsonPath("$.redFlags[0]").value("Area differs."));

        verify(service).verify(any(), any());
    }
}
