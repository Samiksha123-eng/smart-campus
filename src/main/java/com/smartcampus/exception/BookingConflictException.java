package com.smartcampus.exception;

import com.smartcampus.model.FacilityBooking;
import java.util.List;

public class BookingConflictException extends RuntimeException {
    private final List<FacilityBooking> conflictingBookings;

    public BookingConflictException(String message, List<FacilityBooking> conflictingBookings) {
        super(message);
        this.conflictingBookings = conflictingBookings;
    }

    public List<FacilityBooking> getConflictingBookings() {
        return conflictingBookings;
    }
}
