package com.nyayasetu.service;

import com.nyayasetu.exception.InvalidFileException;
import com.nyayasetu.model.dto.VerifyResponse;
import java.io.IOException;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VerificationService {
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;
    private final GemmaClientService gemmaClientService;

    public VerificationService(GemmaClientService gemmaClientService) {
        this.gemmaClientService = gemmaClientService;
    }

    public VerifyResponse verify(MultipartFile landDeed, MultipartFile taxReceipt) {
        try {
            ValidatedDocument deed = validateFile(landDeed, "Land deed");
            ValidatedDocument receipt = validateFile(taxReceipt, "Tax receipt");
            return gemmaClientService.compare(
                    UUID.randomUUID(),
                    deed.contentType(),
                    deed.bytes(),
                    receipt.contentType(),
                    receipt.bytes());
        } catch (IOException exception) {
            throw new InvalidFileException("Could not read the uploaded documents.");
        }
    }

    private ValidatedDocument validateFile(MultipartFile file, String label) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException(label + " file is required.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException(label + " must be 10 MB or smaller.");
        }

        String contentType = resolveContentType(file);
        byte[] bytes = file.getBytes();
        if (!hasValidSignature(contentType, bytes)) {
            throw new InvalidFileException(label + " file contents do not match its file type.");
        }
        return new ValidatedDocument(contentType, bytes);
    }

    private String resolveContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if ("application/pdf".equalsIgnoreCase(contentType)
                || "image/jpeg".equalsIgnoreCase(contentType)
                || "image/png".equalsIgnoreCase(contentType)
                || "image/webp".equalsIgnoreCase(contentType)) {
            return contentType.toLowerCase(Locale.ROOT);
        }
        String filename = file.getOriginalFilename();
        String lowerName = filename == null ? "" : filename.toLowerCase(Locale.ROOT);
        if (lowerName.endsWith(".pdf")) return "application/pdf";
        if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) return "image/jpeg";
        if (lowerName.endsWith(".png")) return "image/png";
        if (lowerName.endsWith(".webp")) return "image/webp";
        throw new InvalidFileException("Upload a PDF, JPG, PNG, or WebP document.");
    }

    private boolean hasValidSignature(String contentType, byte[] bytes) {
        return switch (contentType) {
            case "application/pdf" -> startsWith(bytes, new byte[] {'%', 'P', 'D', 'F', '-'});
            case "image/jpeg" -> startsWith(bytes, new byte[] {(byte) 0xff, (byte) 0xd8, (byte) 0xff});
            case "image/png" -> startsWith(bytes, new byte[] {
                    (byte) 0x89, 'P', 'N', 'G', 0x0d, 0x0a, 0x1a, 0x0a
            });
            case "image/webp" -> bytes.length >= 12
                    && startsWith(bytes, new byte[] {'R', 'I', 'F', 'F'})
                    && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P';
            default -> false;
        };
    }

    private boolean startsWith(byte[] bytes, byte[] signature) {
        if (bytes.length < signature.length) return false;
        for (int index = 0; index < signature.length; index++) {
            if (bytes[index] != signature[index]) return false;
        }
        return true;
    }

    private record ValidatedDocument(String contentType, byte[] bytes) {
    }
}
