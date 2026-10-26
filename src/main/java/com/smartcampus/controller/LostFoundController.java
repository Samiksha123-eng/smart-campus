package com.smartcampus.controller;

import com.smartcampus.dto.LostFoundRequest;
import com.smartcampus.model.LostFoundItem;
import com.smartcampus.model.User;
import com.smartcampus.service.LostFoundService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    @PostMapping
    public ResponseEntity<LostFoundItem> reportItem(@RequestBody LostFoundRequest request,
                                                    @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(lostFoundService.reportItem(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<LostFoundItem>> getAllItems() {
        return ResponseEntity.ok(lostFoundService.getAllItems());
    }

    @PostMapping("/{id}/claim")
    public ResponseEntity<LostFoundItem> submitClaim(@PathVariable Long id,
                                                     @RequestBody Map<String, String> payload,
                                                     @AuthenticationPrincipal User currentUser) {
        String claimNote = payload.getOrDefault("claimNote", "I believe this item belongs to me.");
        return ResponseEntity.ok(lostFoundService.submitClaim(id, claimNote, currentUser));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<LostFoundItem> resolveClaim(@PathVariable Long id,
                                                      @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(lostFoundService.resolveClaim(id, currentUser));
    }
}
