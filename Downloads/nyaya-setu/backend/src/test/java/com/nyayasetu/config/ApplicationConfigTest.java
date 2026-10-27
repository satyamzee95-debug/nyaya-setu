package com.nyayasetu.config;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.io.ClassPathResource;

class ApplicationConfigTest {
    @Test
    void applicationConfigurationLoadsWithLocalEnvironmentImport() throws IOException {
        var propertySources = new YamlPropertySourceLoader()
                .load("application", new ClassPathResource("application.yml"));

        assertTrue(propertySources.stream()
                .anyMatch(source -> String.valueOf(source.getProperty("spring.datasource.url"))
                        .contains("nyaya_setu_db")));
        assertTrue(propertySources.stream()
                .anyMatch(source -> "10MB".equals(
                        source.getProperty("spring.servlet.multipart.max-file-size"))));
        assertTrue(propertySources.stream()
                .anyMatch(source -> String.valueOf(source.getProperty("server.port"))
                        .contains("8080")));
        assertTrue(propertySources.stream()
                .anyMatch(source -> String.valueOf(source.getProperty("ai.gemini.model"))
                        .contains("gemini-3.8-flash")));
        assertTrue(propertySources.stream()
                .anyMatch(source -> String.valueOf(source.getProperty("ai.gemini.api-key"))
                        .contains("GEMINI_API_KEY")));
        assertTrue(propertySources.stream()
                .anyMatch(source -> String.valueOf(source.getProperty("spring.datasource.password"))
                        .contains("DATABASE_PASSWORD")));
    }
}
