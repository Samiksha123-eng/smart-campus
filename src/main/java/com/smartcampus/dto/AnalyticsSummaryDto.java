package com.smartcampus.dto;

import java.util.Map;

public class AnalyticsSummaryDto {
    private long totalTickets;
    private long submittedTickets;
    private long assignedTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;
    private long criticalTickets;
    private long overdueTickets;
    private double resolutionRatePercentage;
    private double avgResolutionTimeHours;
    private double avgUserSatisfactionRating;
    private long activeBookings;
    private long lostFoundActiveItems;

    private Map<String, Long> ticketsByCategory;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> ticketsByPriority;
    private Map<String, Long> bookingsByFacility;

    public AnalyticsSummaryDto() {
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public long getSubmittedTickets() {
        return submittedTickets;
    }

    public void setSubmittedTickets(long submittedTickets) {
        this.submittedTickets = submittedTickets;
    }

    public long getAssignedTickets() {
        return assignedTickets;
    }

    public void setAssignedTickets(long assignedTickets) {
        this.assignedTickets = assignedTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(long inProgressTickets) {
        this.inProgressTickets = inProgressTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public void setResolvedTickets(long resolvedTickets) {
        this.resolvedTickets = resolvedTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }

    public void setClosedTickets(long closedTickets) {
        this.closedTickets = closedTickets;
    }

    public long getCriticalTickets() {
        return criticalTickets;
    }

    public void setCriticalTickets(long criticalTickets) {
        this.criticalTickets = criticalTickets;
    }

    public long getOverdueTickets() {
        return overdueTickets;
    }

    public void setOverdueTickets(long overdueTickets) {
        this.overdueTickets = overdueTickets;
    }

    public double getResolutionRatePercentage() {
        return resolutionRatePercentage;
    }

    public void setResolutionRatePercentage(double resolutionRatePercentage) {
        this.resolutionRatePercentage = resolutionRatePercentage;
    }

    public double getAvgResolutionTimeHours() {
        return avgResolutionTimeHours;
    }

    public void setAvgResolutionTimeHours(double avgResolutionTimeHours) {
        this.avgResolutionTimeHours = avgResolutionTimeHours;
    }

    public double getAvgUserSatisfactionRating() {
        return avgUserSatisfactionRating;
    }

    public void setAvgUserSatisfactionRating(double avgUserSatisfactionRating) {
        this.avgUserSatisfactionRating = avgUserSatisfactionRating;
    }

    public long getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(long activeBookings) {
        this.activeBookings = activeBookings;
    }

    public long getLostFoundActiveItems() {
        return lostFoundActiveItems;
    }

    public void setLostFoundActiveItems(long lostFoundActiveItems) {
        this.lostFoundActiveItems = lostFoundActiveItems;
    }

    public Map<String, Long> getTicketsByCategory() {
        return ticketsByCategory;
    }

    public void setTicketsByCategory(Map<String, Long> ticketsByCategory) {
        this.ticketsByCategory = ticketsByCategory;
    }

    public Map<String, Long> getTicketsByStatus() {
        return ticketsByStatus;
    }

    public void setTicketsByStatus(Map<String, Long> ticketsByStatus) {
        this.ticketsByStatus = ticketsByStatus;
    }

    public Map<String, Long> getTicketsByPriority() {
        return ticketsByPriority;
    }

    public void setTicketsByPriority(Map<String, Long> ticketsByPriority) {
        this.ticketsByPriority = ticketsByPriority;
    }

    public Map<String, Long> getBookingsByFacility() {
        return bookingsByFacility;
    }

    public void setBookingsByFacility(Map<String, Long> bookingsByFacility) {
        this.bookingsByFacility = bookingsByFacility;
    }
}
