package com.smartcampus.controller;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.FacilityBooking;
import com.smartcampus.model.User;
import com.smartcampus.service.FacilityBookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
public class FacilityBookingController {

    private final FacilityBookingService bookingService;

    public FacilityBookingController(FacilityBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<FacilityBooking> createBooking(@RequestBody BookingRequest request,
                                                         @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(bookingService.createBooking(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<FacilityBooking>> getBookings(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(bookingService.getAllBookings(currentUser));
    }

    @GetMapping("/check-conflicts")
    public ResponseEntity<List<FacilityBooking>> checkConflicts(
            @RequestParam String facilityName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {
        return ResponseEntity.ok(bookingService.checkConflicts(facilityName, date, startTime, endTime));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FacilityBooking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User currentUser) {
        BookingStatus status = BookingStatus.valueOf(payload.get("status"));
        String remarks = payload.getOrDefault("remarks", "");
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, remarks, currentUser));
    }
}
