package com.smartcampus.controller;

import com.smartcampus.dto.TicketRequest;
import com.smartcampus.service.SmartTriageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/triage")
public class SmartTriageController {

    private final SmartTriageService triageService;

    public SmartTriageController(SmartTriageService triageService) {
        this.triageService = triageService;
    }

    @PostMapping("/classify")
    public ResponseEntity<SmartTriageService.TriageResult> classifyLive(@RequestBody TicketRequest req) {
        return ResponseEntity.ok(triageService.analyze(
                req.getTitle(),
                req.getDescription(),
                req.getLocation(),
                req.getCategory()
        ));
    }
}
