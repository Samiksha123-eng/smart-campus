package com.smartcampus.controller;

import com.smartcampus.dto.TicketRequest;
import com.smartcampus.dto.TicketStatusUpdateDto;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.User;
import com.smartcampus.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketRequest request,
                                               @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ticketService.createTicket(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getTickets(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ticketService.getTicketsForUser(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable Long id,
                                                     @RequestBody TicketStatusUpdateDto dto,
                                                     @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(ticketService.updateTicket(id, dto, currentUser));
    }
}
