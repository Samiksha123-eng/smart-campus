package com.smartcampus.service;

import com.smartcampus.model.*;
import com.smartcampus.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final FacilityBookingRepository bookingRepository;
    private final LostFoundRepository lostFoundRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           TicketRepository ticketRepository,
                           FacilityBookingRepository bookingRepository,
                           LostFoundRepository lostFoundRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.lostFoundRepository = lostFoundRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Seed Roles & Users
        User admin = new User(
                "admin",
                passwordEncoder.encode("admin123"),
                "Dr. Alok Verma",
                "admin@smartcampus.edu",
                "Campus Operations & Facilities",
                "+91 98765 00001",
                Role.ADMIN,
                "Operations Management"
        );
        userRepository.save(admin);

        User faculty = new User(
                "faculty",
                passwordEncoder.encode("faculty123"),
                "Prof. Sunita Sharma",
                "sunita.sharma@smartcampus.edu",
                "Computer Science & Engineering",
                "+91 98765 00002",
                Role.FACULTY,
                "Academic Coordinator"
        );
        userRepository.save(faculty);

        User student = new User(
                "student",
                passwordEncoder.encode("student123"),
                "Aarav Patel",
                "aarav.patel@smartcampus.edu",
                "Information Technology (B.Tech)",
                "+91 98765 00003",
                Role.STUDENT,
                null
        );
        userRepository.save(student);

        User staffElec = new User(
                "staff_elec",
                passwordEncoder.encode("staff123"),
                "Rajesh Kumar",
                "rajesh.electrician@smartcampus.edu",
                "Campus Maintenance",
                "+91 98765 00004",
                Role.STAFF,
                "Electrician & Power Grid"
        );
        userRepository.save(staffElec);

        User staffAv = new User(
                "staff_av",
                passwordEncoder.encode("staff123"),
                "Vikram Singh",
                "vikram.av@smartcampus.edu",
                "Audio-Visual Services",
                "+91 98765 00005",
                Role.STAFF,
                "AV & Projector Systems"
        );
        userRepository.save(staffAv);

        User staffNet = new User(
                "staff_net",
                passwordEncoder.encode("staff123"),
                "Priya Nair",
                "priya.network@smartcampus.edu",
                "IT Infrastructure",
                "+91 98765 00006",
                Role.STAFF,
                "Network & Wi-Fi Operations"
        );
        userRepository.save(staffNet);

        // 2. Seed Maintenance and Service Tickets
        Ticket t1 = new Ticket();
        t1.setTicketNumber("TKT-2026-1001");
        t1.setTitle("Ceiling Projector HDMI Port Blinking Intermittently");
        t1.setDescription("During lectures in Seminar Hall A, the projector display disconnects whenever slides are changed. Urgent fix needed before guest lecture.");
        t1.setLocation("Academic Block B, 2nd Floor, Seminar Hall A");
        t1.setType(TicketType.MAINTENANCE);
        t1.setCategory(TicketCategory.PROJECTOR_AV);
        t1.setPriority(TicketPriority.HIGH);
        t1.setStatus(TicketStatus.IN_PROGRESS);
        t1.setCreatedBy(faculty);
        t1.setAssignedStaff(staffAv);
        t1.setPredictedUrgencyScore(78.0);
        t1.setIsAiAutoTriaged(true);
        t1.setAiTriageReason("Detected high-impact terms 'guest lecture' and AV display instability.");
        t1.setCreatedAt(LocalDateTime.now().minusHours(5));
        t1.setSlaDeadline(LocalDateTime.now().plusHours(3));
        t1.setResolutionNotes("Technician inspected; replacing HDMI receiver converter cable.");
        ticketRepository.save(t1);

        Ticket t2 = new Ticket();
        t2.setTicketNumber("TKT-2026-1002");
        t2.setTitle("Severe Water Leakage from Ceiling Tap in Washroom");
        t2.setDescription("Continuous water leak flooding the 3rd floor washroom corridor. Safety hazard for students walking nearby.");
        t2.setLocation("Block C, 3rd Floor, Restroom 302");
        t2.setType(TicketType.MAINTENANCE);
        t2.setCategory(TicketCategory.PLUMBING);
        t2.setPriority(TicketPriority.CRITICAL);
        t2.setStatus(TicketStatus.ASSIGNED);
        t2.setCreatedBy(student);
        t2.setAssignedStaff(staffElec);
        t2.setPredictedUrgencyScore(92.0);
        t2.setIsAiAutoTriaged(true);
        t2.setAiTriageReason("Detected critical emergency terms 'flooding', 'safety hazard'. SLA set to 2 hours.");
        t2.setCreatedAt(LocalDateTime.now().minusHours(1));
        t2.setSlaDeadline(LocalDateTime.now().plusHours(1));
        ticketRepository.save(t2);

        Ticket t3 = new Ticket();
        t3.setTicketNumber("TKT-2026-1003");
        t3.setTitle("Campus Wi-Fi Signal Dropping in CSE Computer Lab 3");
        t3.setDescription("Students unable to connect to internal repository server for lab practicals. Access point LED is showing red.");
        t3.setLocation("IT Building, 1st Floor, Lab 304");
        t3.setType(TicketType.MAINTENANCE);
        t3.setCategory(TicketCategory.WIFI_NETWORK);
        t3.setPriority(TicketPriority.HIGH);
        t3.setStatus(TicketStatus.RESOLVED);
        t3.setCreatedBy(student);
        t3.setAssignedStaff(staffNet);
        t3.setPredictedUrgencyScore(65.0);
        t3.setIsAiAutoTriaged(true);
        t3.setAiTriageReason("High impact educational term 'lab practicals' detected.");
        t3.setCreatedAt(LocalDateTime.now().minusDays(1));
        t3.setResolvedAt(LocalDateTime.now().minusHours(2));
        t3.setSlaDeadline(LocalDateTime.now().plusHours(6));
        t3.setResolutionNotes("Cisco Access Point rebooted and DHCP lease pool expanded.");
        t3.setUserFeedbackRating(5);
        t3.setUserFeedbackComment("Wi-Fi is now super fast! Thanks for quick resolution.");
        t3.setStatus(TicketStatus.CLOSED);
        ticketRepository.save(t3);

        Ticket t4 = new Ticket();
        t4.setTicketNumber("TKT-2026-1004");
        t4.setTitle("Request 100 Extra Auditorium Chairs for Coding Club Hackathon");
        t4.setDescription("Annual National Hackathon requires 100 ergonomic chairs, 8 power extension strips, and stage podium mic.");
        t4.setLocation("Central Auditorium, Ground Floor");
        t4.setType(TicketType.SERVICE_REQUEST);
        t4.setCategory(TicketCategory.EVENT_LOGISTICS);
        t4.setPriority(TicketPriority.MEDIUM);
        t4.setStatus(TicketStatus.SUBMITTED);
        t4.setCreatedBy(faculty);
        t4.setPredictedUrgencyScore(40.0);
        t4.setIsAiAutoTriaged(true);
        t4.setAiTriageReason("Standard event logistics request.");
        t4.setCreatedAt(LocalDateTime.now().minusHours(12));
        t4.setSlaDeadline(LocalDateTime.now().plusHours(12));
        ticketRepository.save(t4);

        Ticket t5 = new Ticket();
        t5.setTicketNumber("TKT-2026-1005");
        t5.setTitle("AC Unit Making Loud Rattle Sound in Faculty Lounge");
        t5.setDescription("Daikin Split AC cooling is reduced and compressor is rattling continuously.");
        t5.setLocation("Admin Block, 1st Floor, Room 108");
        t5.setType(TicketType.MAINTENANCE);
        t5.setCategory(TicketCategory.HVAC_AC);
        t5.setPriority(TicketPriority.MEDIUM);
        t5.setStatus(TicketStatus.ASSIGNED);
        t5.setCreatedBy(faculty);
        t5.setAssignedStaff(staffElec);
        t5.setPredictedUrgencyScore(35.0);
        t5.setIsAiAutoTriaged(true);
        t5.setAiTriageReason("Standard HVAC maintenance.");
        t5.setCreatedAt(LocalDateTime.now().minusHours(8));
        t5.setSlaDeadline(LocalDateTime.now().plusHours(16));
        ticketRepository.save(t5);

        // 3. Seed Facility Bookings
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        FacilityBooking b1 = new FacilityBooking();
        b1.setBookingReference("BKG-2026-201");
        b1.setFacilityName("Central Auditorium");
        b1.setPurpose("Inaugural Ceremony of Smart India Hackathon 2026");
        b1.setBookingDate(tomorrow);
        b1.setStartTime(LocalTime.of(9, 30));
        b1.setEndTime(LocalTime.of(13, 0));
        b1.setBookedBy(faculty);
        b1.setExpectedAttendees(450);
        b1.setSpecialRequirements("Dual projection, 4 wireless lapel mics, VIP stage seating.");
        b1.setStatus(BookingStatus.APPROVED);
        b1.setAdminRemarks("Approved by Operations Head.");
        bookingRepository.save(b1);

        FacilityBooking b2 = new FacilityBooking();
        b2.setBookingReference("BKG-2026-202");
        b2.setFacilityName("Seminar Hall A");
        b2.setPurpose("AI & Machine Learning Research Symposium");
        b2.setBookingDate(tomorrow);
        b2.setStartTime(LocalTime.of(14, 0));
        b2.setEndTime(LocalTime.of(17, 30));
        b2.setBookedBy(faculty);
        b2.setExpectedAttendees(120);
        b2.setSpecialRequirements("Recording setup and live streaming encoder.");
        b2.setStatus(BookingStatus.APPROVED);
        b2.setAdminRemarks("Approved for Computer Science Dept.");
        bookingRepository.save(b2);

        FacilityBooking b3 = new FacilityBooking();
        b3.setBookingReference("BKG-2026-203");
        b3.setFacilityName("Advanced AI Computer Lab");
        b3.setPurpose("Robotics Club Autonomous Drone Simulation Workshop");
        b3.setBookingDate(dayAfter);
        b3.setStartTime(LocalTime.of(10, 0));
        b3.setEndTime(LocalTime.of(12, 30));
        b3.setBookedBy(student);
        b3.setExpectedAttendees(40);
        b3.setSpecialRequirements("High-RAM GPU workstations enabled.");
        b3.setStatus(BookingStatus.PENDING);
        b3.setAdminRemarks("Pending Lab in-charge clearance.");
        bookingRepository.save(b3);

        // 4. Seed Lost & Found Items
        LostFoundItem lf1 = new LostFoundItem();
        lf1.setReferenceNumber("LF-2026-501");
        lf1.setType(ItemType.FOUND);
        lf1.setTitle("Casio FX-991EX Scientific Calculator");
        lf1.setCategory("Electronics");
        lf1.setDescription("Black and silver calculator with a blue sticker of Naruto on the back cover. Left on table 12.");
        lf1.setLocation("Central Library, 2nd Floor Reading Hall");
        lf1.setIncidentDate(LocalDate.now().minusDays(1));
        lf1.setReportedBy(student);
        lf1.setContactInfo("Handed over to Library Helpdesk Staff");
        lf1.setStatus(ItemStatus.OPEN);
        lostFoundRepository.save(lf1);

        LostFoundItem lf2 = new LostFoundItem();
        lf2.setReferenceNumber("LF-2026-502");
        lf2.setType(ItemType.LOST);
        lf2.setTitle("Dell 65W USB-C Laptop Charger");
        lf2.setCategory("Electronics");
        lf2.setDescription("Original Dell black cylindrical pin/USB-C adapter with yellow tag attached.");
        lf2.setLocation("Cafeteria Outdoor Seating Area");
        lf2.setIncidentDate(LocalDate.now().minusDays(2));
        lf2.setReportedBy(faculty);
        lf2.setContactInfo("Contact CSE Dept Office: Ext 402");
        lf2.setStatus(ItemStatus.OPEN);
        lostFoundRepository.save(lf2);

        // 5. Seed Notifications
        notificationRepository.save(new Notification(
                student,
                "Ticket Assigned",
                "Your plumbing issue #TKT-2026-1002 has been assigned to Senior Technician Rajesh Kumar.",
                "TICKET_UPDATE",
                "#tickets"
        ));
        notificationRepository.save(new Notification(
                faculty,
                "Booking Confirmed",
                "Central Auditorium booking #BKG-2026-201 for tomorrow 9:30 AM is APPROVED.",
                "BOOKING_UPDATE",
                "#bookings"
        ));
    }
}
