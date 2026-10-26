package com.smartcampus.service;

import com.smartcampus.dto.LostFoundRequest;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.*;
import com.smartcampus.repository.LostFoundRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class LostFoundService {

    private final LostFoundRepository lostFoundRepository;
    private final NotificationService notificationService;

    public LostFoundService(LostFoundRepository lostFoundRepository, NotificationService notificationService) {
        this.lostFoundRepository = lostFoundRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public LostFoundItem reportItem(LostFoundRequest req, User currentUser) {
        LostFoundItem item = new LostFoundItem();
        String year = String.valueOf(LocalDate.now().getYear());
        int randomSeq = 100 + new Random().nextInt(900);
        item.setReferenceNumber("LF-" + year + "-" + randomSeq);
        item.setType(req.getType());
        item.setTitle(req.getTitle());
        item.setCategory(req.getCategory());
        item.setDescription(req.getDescription());
        item.setLocation(req.getLocation());
        item.setIncidentDate(req.getIncidentDate());
        item.setContactInfo(req.getContactInfo());
        item.setReportedBy(currentUser);
        item.setStatus(ItemStatus.OPEN);

        LostFoundItem saved = lostFoundRepository.save(item);

        notificationService.createNotification(
                currentUser,
                "Lost & Found Reported: " + saved.getReferenceNumber(),
                "Your " + saved.getType() + " item report for '" + saved.getTitle() + "' is published on the campus pinboard.",
                "LOST_FOUND",
                "#lost-found"
        );

        return saved;
    }

    public List<LostFoundItem> getAllItems() {
        return lostFoundRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public LostFoundItem submitClaim(Long id, String claimNote, User claimant) {
        LostFoundItem item = lostFoundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + id));

        item.setClaimedBy(claimant);
        item.setClaimVerificationNote(claimNote);
        item.setStatus(ItemStatus.CLAIM_PENDING);

        LostFoundItem saved = lostFoundRepository.save(item);

        notificationService.createNotification(
                item.getReportedBy(),
                "Claim Submitted for " + item.getTitle(),
                claimant.getFullName() + " submitted a claim verification note: '" + claimNote + "'",
                "LOST_FOUND",
                "#lost-found"
        );

        return saved;
    }

    @Transactional
    public LostFoundItem resolveClaim(Long id, User currentUser) {
        LostFoundItem item = lostFoundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + id));

        item.setStatus(ItemStatus.RESOLVED);
        LostFoundItem saved = lostFoundRepository.save(item);

        if (item.getClaimedBy() != null) {
            notificationService.createNotification(
                    item.getClaimedBy(),
                    "Item Claim Approved!",
                    "Your claim for '" + item.getTitle() + "' has been verified and resolved.",
                    "LOST_FOUND",
                    "#lost-found"
            );
        }

        return saved;
    }
}
