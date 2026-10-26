package com.smartcampus.model;

public enum TicketCategory {
    ELECTRICAL("Fans, Lights & Wiring"),
    HVAC_AC("Air Conditioning & Ventilation"),
    PROJECTOR_AV("Projectors, Smart Boards & Audio"),
    WIFI_NETWORK("Wi-Fi, LAN & Network Infrastructure"),
    PLUMBING("Restrooms, Taps & Water Coolers"),
    FURNITURE("Desks, Chairs & Whiteboards"),
    EVENT_LOGISTICS("Chairs, Mic & Stage Support"),
    LAB_EQUIPMENT("Computers, Oscilloscopes & Instruments"),
    OTHER("General Campus Facilities");

    private final String displayName;

    TicketCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
