package com.smartcampus.repository;

import com.smartcampus.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByCreatedByOrderByCreatedAtDesc(User user);
    List<Ticket> findByAssignedStaffOrderByCreatedAtDesc(User staff);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByCategory(TicketCategory category);
    List<Ticket> findByPriority(TicketPriority priority);

    long countByStatus(TicketStatus status);
    long countByCategory(TicketCategory category);
    long countByPriority(TicketPriority priority);

    // Predictive maintenance: Count recurring tickets in same location within recent days
    @Query("SELECT COUNT(t) FROM Ticket t WHERE LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%')) AND t.createdAt >= :since")
    long countRecentTicketsByLocation(@Param("location") String location, @Param("since") LocalDateTime since);

    // Active overdue tickets
    @Query("SELECT t FROM Ticket t WHERE t.status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED') AND t.slaDeadline < :now ORDER BY t.slaDeadline ASC")
    List<Ticket> findOverdueTickets(@Param("now") LocalDateTime now);
}
