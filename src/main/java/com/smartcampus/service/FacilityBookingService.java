package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.FacilityBooking;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.FacilityBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@Service
public class FacilityBookingService {

    private final FacilityBookingRepository bookingRepository;
    private final NotificationService notificationService;

    public FacilityBookingService(FacilityBookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public FacilityBooking createBooking(BookingRequest req, User currentUser) {
        if (req.getStartTime().isAfter(req.getEndTime()) || req.getStartTime().equals(req.getEndTime())) {
            throw new IllegalArgumentException("Booking start time must be strictly before end time.");
        }

        if (req.getBookingDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot book a facility for a past date.");
        }

        // Strict Conflict Prevention Engine
        List<FacilityBooking> conflicts = bookingRepository.findConflictingBookings(
                req.getFacilityName(),
                req.getBookingDate(),
                req.getStartTime(),
                req.getEndTime(),
                null
        );

        if (!conflicts.isEmpty()) {
            FacilityBooking conflict = conflicts.get(0);
            throw new BookingConflictException(
                    "Conflict detected: " + req.getFacilityName() + " is already reserved from " +
                    conflict.getStartTime() + " to " + conflict.getEndTime() +
                    " on " + req.getBookingDate() + " for '" + conflict.getPurpose() + "'.",
                    conflicts
            );
        }

        FacilityBooking booking = new FacilityBooking();
        String year = String.valueOf(LocalDate.now().getYear());
        int randomSeq = 100 + new Random().nextInt(900);
        booking.setBookingReference("BKG-" + year + "-" + randomSeq);
        booking.setFacilityName(req.getFacilityName());
        booking.setPurpose(req.getPurpose());
        booking.setBookingDate(req.getBookingDate());
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        booking.setBookedBy(currentUser);
        booking.setExpectedAttendees(req.getExpectedAttendees());
        booking.setSpecialRequirements(req.getSpecialRequirements());

        // Faculty bookings get expedited approval; student club bookings enter pending queue
        if (currentUser.getRole() == Role.FACULTY || currentUser.getRole() == Role.ADMIN) {
            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminRemarks("Auto-approved for Faculty/Admin reservation.");
        } else {
            booking.setStatus(BookingStatus.PENDING);
            booking.setAdminRemarks("Pending Administrative verification.");
        }

        FacilityBooking saved = bookingRepository.save(booking);

        notificationService.createNotification(
                currentUser,
                "Facility Reservation: " + saved.getBookingReference(),
                "Reservation for " + saved.getFacilityName() + " on " + saved.getBookingDate() + " is " + saved.getStatus(),
                "BOOKING_UPDATE",
                "#bookings"
        );

        return saved;
    }

    public List<FacilityBooking> checkConflicts(String facilityName, LocalDate date, LocalTime start, LocalTime end) {
        return bookingRepository.findConflictingBookings(facilityName, date, start, end, null);
    }

    public List<FacilityBooking> getAllBookings(User user) {
        if (user.getRole() == Role.ADMIN) {
            return bookingRepository.findAllByOrderByBookingDateDescStartTimeAsc();
        } else {
            return bookingRepository.findByBookedByOrderByBookingDateDesc(user);
        }
    }

    public List<FacilityBooking> getBookingsByDateAndFacility(LocalDate date, String facility) {
        return bookingRepository.findByBookingDateAndFacilityName(date, facility);
    }

    @Transactional
    public FacilityBooking updateBookingStatus(Long id, BookingStatus status, String remarks, User admin) {
        FacilityBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));

        booking.setStatus(status);
        booking.setAdminRemarks(remarks);
        FacilityBooking saved = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getBookedBy(),
                "Booking Status Updated: " + booking.getBookingReference(),
                "Your reservation for " + booking.getFacilityName() + " has been " + status + ". Remarks: " + remarks,
                "BOOKING_UPDATE",
                "#bookings"
        );

        return saved;
    }
}
