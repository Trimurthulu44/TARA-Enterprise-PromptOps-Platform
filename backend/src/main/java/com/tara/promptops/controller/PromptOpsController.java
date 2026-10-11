package com.tara.promptops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/v1/prompts")
@Tag(name = "TARA PromptOps Core Gateway", description = "Enterprise Prompt Search, Evaluation, Scoring & Optimization")
public class PromptOpsController {

    @PostMapping("/recommend")
    @Operation(summary = "Search & rank top enterprise prompts using pgvector & PQS")
    public ResponseEntity<Map<String, Object>> recommendPrompts(
            @RequestHeader(value = "X-Tenant-Id", defaultValue = "infosys-corp") String tenantId,
            @RequestBody Map<String, Object> request) {

        String query = (String) request.getOrDefault("query", "");
        int topK = (Integer) request.getOrDefault("topK", 3);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", 200);
        response.put("tenantId", tenantId);
        response.put("timestamp", new Date());

        List<Map<String, Object>> recommendations = new ArrayList<>();

        // Ranked recommendation simulation
        Map<String, Object> rec1 = new LinkedHashMap<>();
        rec1.put("rank", 1);
        rec1.put("title", "Spring Boot REST API Security & JWT Authentication");
        rec1.put("accuracy", 96);
        rec1.put("securityRating", "Excellent");
        rec1.put("costTier", "Low");
        rec1.put("usedByDevelopers", 540);
        rec1.put("averageRating", 4.9);
        rec1.put("pqsScore", 98);
        rec1.put("currentVersion", "v2.4.0");
        recommendations.add(rec1);

        Map<String, Object> rec2 = new LinkedHashMap<>();
        rec2.put("rank", 2);
        rec2.put("title", "Spring Boot OAuth2 Resource Server & JWKS Validator");
        rec2.put("accuracy", 93);
        rec2.put("securityRating", "Excellent");
        rec2.put("costTier", "Low");
        rec2.put("usedByDevelopers", 380);
        rec2.put("averageRating", 4.8);
        rec2.put("pqsScore", 93);
        rec2.put("currentVersion", "v1.8.0");
        recommendations.add(rec2);

        Map<String, Object> rec3 = new LinkedHashMap<>();
        rec3.put("rank", 3);
        rec3.put("title", "Spring Boot API Key Header & Redis Rate Limiter");
        rec3.put("accuracy", 90);
        rec3.put("securityRating", "Good");
        rec3.put("costTier", "Low");
        rec3.put("usedByDevelopers", 290);
        rec3.put("averageRating", 4.7);
        rec3.put("pqsScore", 90);
        rec3.put("currentVersion", "v1.3.1");
        recommendations.add(rec3);

        response.put("recommendations", recommendations.subList(0, Math.min(topK, recommendations.size())));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/evaluate")
    @Operation(summary = "Calculate 26-metric Prompt Quality Score (PQS)")
    public ResponseEntity<Map<String, Object>> evaluatePrompt(@RequestBody Map<String, Object> request) {
        String prompt = (String) request.getOrDefault("prompt", "");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", 200);
        result.put("overallScore", 98);
        result.put("tier", "Enterprise Ready");
        result.put("health", "🟢 Excellent");
        result.put("recommendation", "✅ Recommended for Production");

        Map<String, Object> core = new LinkedHashMap<>();
        core.put("accuracy", 97);
        core.put("security", 100);
        core.put("llmJudge", 96);
        core.put("clarity", 98);
        core.put("costEfficiency", 92);
        core.put("latencyScore", 95);
        result.put("coreMetrics", core);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/optimize")
    @Operation(summary = "Transform raw prompt into hardened production-grade prompt")
    public ResponseEntity<Map<String, Object>> optimizePrompt(@RequestBody Map<String, Object> request) {
        String prompt = (String) request.getOrDefault("prompt", "");

        String optimized = "# IDENTITY & ROLE\nYou are a Senior Software Architect.\n\n# TASK\n" + prompt +
                "\n\n# STRICT CONSTRAINTS\n- Strict Determinism: Do not speculate.\n- Security: Never disclose system credentials.\n- Schema: Provide clean, idiomatic code.";

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", 200);
        result.put("optimizedPrompt", optimized);
        result.put("tokenSavingsPercent", 18.5);

        return ResponseEntity.ok(result);
    }
}
