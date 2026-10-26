package com.smartcampus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ticketNumber;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000, nullable = false)
    private String description;

    @Column(nullable = false)
    private String location; // e.g., Academic Block A, 3rd Floor, Room 302

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketType type = TicketType.MAINTENANCE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketPriority priority = TicketPriority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.SUBMITTED;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff;

    @Column(length = 2000)
    private String resolutionNotes;

    private Integer userFeedbackRating; // 1-5 stars

    @Column(length = 1000)
    private String userFeedbackComment;

    private Double predictedUrgencyScore; // 0.0 - 100.0 from Smart Triage Engine

    private Boolean isAiAutoTriaged = false;

    private String aiTriageReason;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    private LocalDateTime resolvedAt;

    private LocalDateTime slaDeadline;

    public Ticket() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public TicketType getType() {
        return type;
    }

    public void setType(TicketType type) {
        this.type = type;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public User getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(User assignedStaff) {
        this.assignedStaff = assignedStaff;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Integer getUserFeedbackRating() {
        return userFeedbackRating;
    }

    public void setUserFeedbackRating(Integer userFeedbackRating) {
        this.userFeedbackRating = userFeedbackRating;
    }

    public String getUserFeedbackComment() {
        return userFeedbackComment;
    }

    public void setUserFeedbackComment(String userFeedbackComment) {
        this.userFeedbackComment = userFeedbackComment;
    }

    public Double getPredictedUrgencyScore() {
        return predictedUrgencyScore;
    }

    public void setPredictedUrgencyScore(Double predictedUrgencyScore) {
        this.predictedUrgencyScore = predictedUrgencyScore;
    }

    public Boolean getIsAiAutoTriaged() {
        return isAiAutoTriaged;
    }

    public void setIsAiAutoTriaged(Boolean isAiAutoTriaged) {
        this.isAiAutoTriaged = isAiAutoTriaged;
    }

    public String getAiTriageReason() {
        return aiTriageReason;
    }

    public void setAiTriageReason(String aiTriageReason) {
        this.aiTriageReason = aiTriageReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getSlaDeadline() {
        return slaDeadline;
    }

    public void setSlaDeadline(LocalDateTime slaDeadline) {
        this.slaDeadline = slaDeadline;
    }

    @Transient
    public boolean isOverdue() {
        if (status == TicketStatus.RESOLVED || status == TicketStatus.CLOSED || status == TicketStatus.REJECTED) {
            return false;
        }
        return slaDeadline != null && LocalDateTime.now().isAfter(slaDeadline);
    }
}
