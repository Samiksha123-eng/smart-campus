package com.smartcampus.model;

public enum TicketPriority {
    LOW(72),      // 72 hours SLA
    MEDIUM(24),   // 24 hours SLA
    HIGH(8),      // 8 hours SLA
    CRITICAL(2);  // 2 hours SLA emergency

    private final int slaHours;

    TicketPriority(int slaHours) {
        this.slaHours = slaHours;
    }

    public int getSlaHours() {
        return slaHours;
    }
}
