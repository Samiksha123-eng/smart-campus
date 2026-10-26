package com.smartcampus.repository;

import com.smartcampus.model.BookingStatus;
import com.smartcampus.model.FacilityBooking;
import com.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface FacilityBookingRepository extends JpaRepository<FacilityBooking, Long> {
    List<FacilityBooking> findAllByOrderByBookingDateDescStartTimeAsc();
    List<FacilityBooking> findByBookedByOrderByBookingDateDesc(User user);
    List<FacilityBooking> findByBookingDateAndFacilityName(LocalDate bookingDate, String facilityName);
    List<FacilityBooking> findByStatus(BookingStatus status);

    // Strict Double-Booking Prevention Query: Finds any active/pending booking that overlaps with requested time slot
    @Query("SELECT b FROM FacilityBooking b WHERE b.facilityName = :facilityName " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status IN ('APPROVED', 'PENDING') " +
           "AND (:excludeId IS NULL OR b.id <> :excludeId) " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<FacilityBooking> findConflictingBookings(
            @Param("facilityName") String facilityName,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );

    long countByStatus(BookingStatus status);
}
