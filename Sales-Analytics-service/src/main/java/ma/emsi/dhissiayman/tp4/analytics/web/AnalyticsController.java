package ma.emsi.dhissiayman.tp4.analytics.web;

import ma.emsi.dhissiayman.tp4.analytics.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public Map<String, Long> getAnalytics() {
        return analyticsService.getAnalyticsData();
    }
}
