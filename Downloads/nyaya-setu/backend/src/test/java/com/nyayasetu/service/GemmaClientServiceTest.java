package com.nyayasetu.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

class GemmaClientServiceTest {
    @Test
    void reportsMissingApiKeyAsServiceUnavailable() {
        GemmaClientService service = new GemmaClientService(
                RestClient.builder().build(), new ObjectMapper(), "", "gemini-3.6-flash");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.compare(
                        UUID.randomUUID(),
                        "application/pdf",
                        "%PDF-test".getBytes(),
                        "image/png",
                        new byte[] {(byte) 0x89, 'P', 'N', 'G'}));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
    }

    @Test
    void sendsBothDocumentsAndParsesStructuredAnalysis() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        UUID caseId = UUID.randomUUID();

        ObjectNode analysis = objectMapper.createObjectNode()
                .put("status", "REVIEW_REQUIRED")
                .put("riskScore", 38)
                .put("summary", "Review the property area.");
        analysis.putArray("fields")
                .addObject()
                .put("field", "Property area")
                .put("landDeedValue", "10.5 Acres")
                .put("taxReceiptValue", "9.2 Acres")
                .put("status", "MISMATCH")
                .put("explanation", "The values differ.");
        analysis.putArray("redFlags").add("Property area differs.");

        ObjectNode response = objectMapper.createObjectNode();
        response.putArray("candidates")
                .addObject()
                .putObject("content")
                .putArray("parts")
                .addObject()
                .put("text", objectMapper.writeValueAsString(analysis));
        server.expect(requestTo(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("x-goog-api-key", "test-key"))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("\"inlineData\"")))
                .andRespond(withSuccess(objectMapper.writeValueAsString(response), MediaType.APPLICATION_JSON));

        GemmaClientService service = new GemmaClientService(
                builder.build(), objectMapper, "test-key", "gemini-3.6-flash");
        var result = service.compare(
                caseId,
                "application/pdf",
                "%PDF-test".getBytes(),
                "image/png",
                new byte[] {(byte) 0x89, 'P', 'N', 'G'});

        assertEquals(caseId, result.caseId());
        assertEquals(38, result.riskScore());
        assertEquals("Property area", result.fields().get(0).field());
        assertEquals("Property area differs.", result.redFlags().get(0));
        server.verify();
    }
}
