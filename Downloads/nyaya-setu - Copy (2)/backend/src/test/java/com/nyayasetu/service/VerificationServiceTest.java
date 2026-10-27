package com.nyayasetu.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.nyayasetu.exception.InvalidFileException;
import com.nyayasetu.model.dto.VerifyResponse;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class VerificationServiceTest {
    private GemmaClientService gemmaClientService;
    private VerificationService verificationService;

    @BeforeEach
    void setUp() {
        gemmaClientService = mock(GemmaClientService.class);
        verificationService = new VerificationService(gemmaClientService);
    }

    @Test
    void comparesPdfAndImageDocuments() {
        byte[] pdf = "%PDF-1.7 sample".getBytes();
        byte[] png = new byte[] {
                (byte) 0x89, 'P', 'N', 'G', 0x0d, 0x0a, 0x1a, 0x0a, 0x00
        };
        MockMultipartFile deed = new MockMultipartFile(
                "landDeed", "deed.pdf", "application/pdf", pdf);
        MockMultipartFile receipt = new MockMultipartFile(
                "taxReceipt", "receipt.png", "image/png", png);
        VerifyResponse expected = new VerifyResponse(
                UUID.randomUUID(), "REVIEW_REQUIRED", 40, "Review the differences.",
                List.of(), List.of("Area differs."));
        when(gemmaClientService.compare(
                any(), eq("application/pdf"), any(), eq("image/png"), any())).thenReturn(expected);

        VerifyResponse actual = verificationService.verify(deed, receipt);

        assertEquals(expected, actual);
        verify(gemmaClientService).compare(
                any(), eq("application/pdf"), any(), eq("image/png"), any());
    }

    @Test
    void rejectsUnsupportedFilesBeforeCallingAi() {
        MockMultipartFile deed = new MockMultipartFile(
                "landDeed", "deed.txt", "text/plain", "not a document".getBytes());
        MockMultipartFile receipt = validPdf("taxReceipt");

        InvalidFileException exception = assertThrows(
                InvalidFileException.class,
                () -> verificationService.verify(deed, receipt));

        assertEquals("Upload a PDF, JPG, PNG, or WebP document.", exception.getMessage());
    }

    @Test
    void rejectsContentThatDoesNotMatchItsExtension() {
        MockMultipartFile deed = new MockMultipartFile(
                "landDeed", "deed.pdf", "application/pdf", "not a PDF".getBytes());

        InvalidFileException exception = assertThrows(
                InvalidFileException.class,
                () -> verificationService.verify(deed, validPdf("taxReceipt")));

        assertEquals("Land deed file contents do not match its file type.", exception.getMessage());
    }

    @Test
    void requiresBothDocuments() {
        InvalidFileException exception = assertThrows(
                InvalidFileException.class,
                () -> verificationService.verify(null, validPdf("taxReceipt")));

        assertEquals("Land deed file is required.", exception.getMessage());
    }

    @Test
    void rejectsOversizedDocuments() {
        MockMultipartFile deed = new MockMultipartFile(
                "landDeed",
                "deed.pdf",
                "application/pdf",
                new byte[10 * 1024 * 1024 + 1]);

        InvalidFileException exception = assertThrows(
                InvalidFileException.class,
                () -> verificationService.verify(deed, validPdf("taxReceipt")));

        assertEquals("Land deed must be 10 MB or smaller.", exception.getMessage());
    }

    private MockMultipartFile validPdf(String fieldName) {
        return new MockMultipartFile(
                fieldName, "document.pdf", "application/pdf", "%PDF-1.7 sample".getBytes());
    }
}
