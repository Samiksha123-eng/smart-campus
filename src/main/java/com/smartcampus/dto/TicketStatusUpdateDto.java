package com.smartcampus.dto;

import com.smartcampus.model.TicketPriority;
import com.smartcampus.model.TicketStatus;

public class TicketStatusUpdateDto {
    private TicketStatus status;
    private Long assignedStaffId;
    private TicketPriority priority;
    private String resolutionNotes;
    private Integer userFeedbackRating;
    private String userFeedbackComment;

    public TicketStatusUpdateDto() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public void setAssignedStaffId(Long assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
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
}
