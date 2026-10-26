package com.smartcampus.service;

import com.smartcampus.model.TicketCategory;
import com.smartcampus.model.TicketPriority;
import com.smartcampus.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SmartTriageService {

    private final TicketRepository ticketRepository;

    public SmartTriageService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public static class TriageResult {
        private TicketCategory recommendedCategory;
        private TicketPriority recommendedPriority;
        private double urgencyScore; // 0 - 100
        private String rationale;
        private boolean recurringWarning;
        private long recentLocationIncidents;

        public TriageResult(TicketCategory recommendedCategory, TicketPriority recommendedPriority, double urgencyScore, String rationale, boolean recurringWarning, long recentLocationIncidents) {
            this.recommendedCategory = recommendedCategory;
            this.recommendedPriority = recommendedPriority;
            this.urgencyScore = urgencyScore;
            this.rationale = rationale;
            this.recurringWarning = recurringWarning;
            this.recentLocationIncidents = recentLocationIncidents;
        }

        public TicketCategory getRecommendedCategory() {
            return recommendedCategory;
        }

        public TicketPriority getRecommendedPriority() {
            return recommendedPriority;
        }

        public double getUrgencyScore() {
            return urgencyScore;
        }

        public String getRationale() {
            return rationale;
        }

        public boolean isRecurringWarning() {
            return recurringWarning;
        }

        public long getRecentLocationIncidents() {
            return recentLocationIncidents;
        }
    }

    // Keyword Dictionaries for Classification
    private static final Map<TicketCategory, List<String>> CATEGORY_KEYWORDS = new EnumMap<>(TicketCategory.class);
    static {
        CATEGORY_KEYWORDS.put(TicketCategory.ELECTRICAL, Arrays.asList("fan", "light", "switch", "wire", "spark", "socket", "power", "shock", "blackout", "fuse", "tube light"));
        CATEGORY_KEYWORDS.put(TicketCategory.HVAC_AC, Arrays.asList("ac", "air conditioner", "cooling", "hvac", "ventilation", "chiller", "hot", "temperature", "remote"));
        CATEGORY_KEYWORDS.put(TicketCategory.PROJECTOR_AV, Arrays.asList("projector", "screen", "hdmi", "speaker", "mic", "microphone", "audio", "sound", "smart board", "display", "vga"));
        CATEGORY_KEYWORDS.put(TicketCategory.WIFI_NETWORK, Arrays.asList("wifi", "wi-fi", "internet", "lan", "network", "router", "signal", "bandwidth", "ethernet", "connectivity"));
        CATEGORY_KEYWORDS.put(TicketCategory.PLUMBING, Arrays.asList("leak", "tap", "water", "pipe", "drain", "washroom", "toilet", "flush", "sink", "cooler", "overflow"));
        CATEGORY_KEYWORDS.put(TicketCategory.FURNITURE, Arrays.asList("desk", "chair", "bench", "table", "whiteboard", "door", "window", "lock", "handle", "podium"));
        CATEGORY_KEYWORDS.put(TicketCategory.EVENT_LOGISTICS, Arrays.asList("event", "seminar", "stage", "extension board", "dais", "auditorium support", "extra chairs"));
        CATEGORY_KEYWORDS.put(TicketCategory.LAB_EQUIPMENT, Arrays.asList("pc", "computer", "cpu", "keyboard", "mouse", "monitor", "oscilloscope", "instrument", "power supply"));
    }

    private static final List<String> CRITICAL_KEYWORDS = Arrays.asList(
            "fire", "spark", "smoke", "flood", "shock", "hazard", "danger", "emergency", "short circuit", "burst"
    );

    private static final List<String> HIGH_KEYWORDS = Arrays.asList(
            "urgent", "blackout", "overflow", "exam", "lab exam", "presentation", "guest lecture", "dead", "completely down"
    );

    public TriageResult analyze(String title, String description, String location, TicketCategory userCategory) {
        String fullText = ((title != null ? title : "") + " " + (description != null ? description : "")).toLowerCase();

        // 1. Determine Recommended Category
        TicketCategory bestCategory = userCategory != null ? userCategory : TicketCategory.OTHER;
        int maxMatches = 0;

        for (Map.Entry<TicketCategory, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            int matchCount = 0;
            for (String kw : entry.getValue()) {
                if (fullText.contains(kw)) {
                    matchCount++;
                }
            }
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                bestCategory = entry.getKey();
            }
        }

        // 2. Calculate Urgency Score
        double baseScore = 25.0; // Medium baseline
        StringBuilder rationale = new StringBuilder();

        // Check Critical Keywords
        boolean hasCritical = false;
        for (String kw : CRITICAL_KEYWORDS) {
            if (fullText.contains(kw)) {
                baseScore += 45.0;
                hasCritical = true;
                rationale.append("Detected safety hazard/emergency term '").append(kw).append("'. ");
                break;
            }
        }

        // Check High Priority Keywords
        boolean hasHigh = false;
        if (!hasCritical) {
            for (String kw : HIGH_KEYWORDS) {
                if (fullText.contains(kw)) {
                    baseScore += 30.0;
                    hasHigh = true;
                    rationale.append("Detected high-impact educational term '").append(kw).append("'. ");
                    break;
                }
            }
        }

        // 3. Predictive Maintenance Check: Recurring fault at this location in last 14 days
        long recentCount = 0;
        boolean recurringWarning = false;
        if (location != null && !location.trim().isEmpty()) {
            recentCount = ticketRepository.countRecentTicketsByLocation(location.trim(), LocalDateTime.now().minusDays(14));
            if (recentCount >= 2) {
                baseScore += 20.0;
                recurringWarning = true;
                rationale.append("Predictive Maintenance: ").append(recentCount)
                        .append(" recurring complaints logged in this room recently. ");
            }
        }

        // Clamp score to 100
        double finalScore = Math.min(100.0, Math.max(10.0, baseScore));

        // 4. Map Urgency Score to Priority
        TicketPriority priority;
        if (finalScore >= 75.0) {
            priority = TicketPriority.CRITICAL;
        } else if (finalScore >= 50.0) {
            priority = TicketPriority.HIGH;
        } else if (finalScore >= 25.0) {
            priority = TicketPriority.MEDIUM;
        } else {
            priority = TicketPriority.LOW;
        }

        if (rationale.length() == 0) {
            rationale.append("Standard automated rule-based triage based on service description.");
        }

        return new TriageResult(bestCategory, priority, finalScore, rationale.toString().trim(), recurringWarning, recentCount);
    }
}
