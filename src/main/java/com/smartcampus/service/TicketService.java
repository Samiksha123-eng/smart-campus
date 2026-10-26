package com.smartcampus.service;

import com.smartcampus.dto.TicketRequest;
import com.smartcampus.dto.TicketStatusUpdateDto;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.*;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SmartTriageService triageService;
    private final NotificationService notificationService;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         SmartTriageService triageService,
                         NotificationService notificationService) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.triageService = triageService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Ticket createTicket(TicketRequest request, User currentUser) {
        Ticket ticket = new Ticket();
        
        // Generate unique ticket number
        String year = String.valueOf(LocalDateTime.now().getYear());
        int randomSeq = 1000 + new Random().nextInt(9000);
        ticket.setTicketNumber("TKT-" + year + "-" + randomSeq);

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setLocation(request.getLocation());
        ticket.setType(request.getType() != null ? request.getType() : TicketType.MAINTENANCE);
        ticket.setCreatedBy(currentUser);

        // Run Smart AI / ML Triage Heuristics
        SmartTriageService.TriageResult triageResult = triageService.analyze(
                request.getTitle(),
                request.getDescription(),
                request.getLocation(),
                request.getCategory()
        );

        ticket.setCategory(triageResult.getRecommendedCategory());
        
        // Priority: use user priority if specified, else use AI recommended priority
        TicketPriority finalPriority = request.getPriority() != null ? request.getPriority() : triageResult.getRecommendedPriority();
        ticket.setPriority(finalPriority);
        ticket.setPredictedUrgencyScore(triageResult.getUrgencyScore());
        ticket.setIsAiAutoTriaged(true);
        ticket.setAiTriageReason(triageResult.getRationale());

        // SLA Calculation based on priority
        ticket.setSlaDeadline(LocalDateTime.now().plusHours(finalPriority.getSlaHours()));
        ticket.setStatus(TicketStatus.SUBMITTED);

        // Automated Staff Matching based on Category & Specialization
        List<User> staffMembers = userRepository.findByRole(Role.STAFF);
        User matchedStaff = autoMatchStaff(staffMembers, ticket.getCategory());
        if (matchedStaff != null) {
            ticket.setAssignedStaff(matchedStaff);
            ticket.setStatus(TicketStatus.ASSIGNED);
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // Notify Creator
        notificationService.createNotification(
                currentUser,
                "Ticket Created: " + savedTicket.getTicketNumber(),
                "Your " + savedTicket.getType() + " ticket for " + savedTicket.getLocation() + " is logged. Priority: " + savedTicket.getPriority(),
                "TICKET_UPDATE",
                "#tickets"
        );

        // Notify Assigned Staff
        if (savedTicket.getAssignedStaff() != null) {
            notificationService.createNotification(
                    savedTicket.getAssignedStaff(),
                    "New Work Order: " + savedTicket.getTicketNumber(),
                    "You have been assigned to: " + savedTicket.getTitle() + " at " + savedTicket.getLocation(),
                    "TICKET_UPDATE",
                    "#tickets"
            );
        }

        return savedTicket;
    }

    public List<Ticket> getTicketsForUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            return ticketRepository.findAllByOrderByCreatedAtDesc();
        } else if (user.getRole() == Role.STAFF) {
            return ticketRepository.findByAssignedStaffOrderByCreatedAtDesc(user);
        } else {
            return ticketRepository.findByCreatedByOrderByCreatedAtDesc(user);
        }
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    @Transactional
    public Ticket updateTicket(Long id, TicketStatusUpdateDto dto, User currentUser) {
        Ticket ticket = getTicketById(id);

        if (dto.getStatus() != null) {
            ticket.setStatus(dto.getStatus());
            if (dto.getStatus() == TicketStatus.RESOLVED) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
        }

        if (dto.getAssignedStaffId() != null) {
            User staff = userRepository.findById(dto.getAssignedStaffId())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff user not found: " + dto.getAssignedStaffId()));
            ticket.setAssignedStaff(staff);
            if (ticket.getStatus() == TicketStatus.SUBMITTED) {
                ticket.setStatus(TicketStatus.ASSIGNED);
            }
        }

        if (dto.getPriority() != null) {
            ticket.setPriority(dto.getPriority());
            ticket.setSlaDeadline(ticket.getCreatedAt().plusHours(dto.getPriority().getSlaHours()));
        }

        if (dto.getResolutionNotes() != null) {
            ticket.setResolutionNotes(dto.getResolutionNotes());
        }

        if (dto.getUserFeedbackRating() != null) {
            ticket.setUserFeedbackRating(dto.getUserFeedbackRating());
            ticket.setUserFeedbackComment(dto.getUserFeedbackComment());
            ticket.setStatus(TicketStatus.CLOSED);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket updated = ticketRepository.save(ticket);

        // Notify user about update
        notificationService.createNotification(
                ticket.getCreatedBy(),
                "Update on Ticket " + ticket.getTicketNumber(),
                "Status changed to: " + ticket.getStatus() + (dto.getResolutionNotes() != null ? " | Notes: " + dto.getResolutionNotes() : ""),
                "TICKET_UPDATE",
                "#tickets"
        );

        return updated;
    }

    private User autoMatchStaff(List<User> staffList, TicketCategory category) {
        if (staffList == null || staffList.isEmpty()) return null;

        String requiredKeyword = switch (category) {
            case ELECTRICAL -> "electri";
            case HVAC_AC -> "ac";
            case PROJECTOR_AV -> "av";
            case WIFI_NETWORK -> "network";
            case PLUMBING -> "plumb";
            case FURNITURE -> "carpenter";
            default -> "technician";
        };

        for (User staff : staffList) {
            if (staff.getSpecialization() != null &&
                staff.getSpecialization().toLowerCase().contains(requiredKeyword)) {
                return staff;
            }
        }
        // Fallback to first available staff
        return staffList.get(0);
    }
}
