package ma.emsi.dhissiayman.tp4.analytics.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AnalyticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    private final Map<String, Long> analyticsData = new ConcurrentHashMap<>();

    @KafkaListener(topics = "supplier-topic", groupId = "analytics-group")
    public void consumeSupplierEvents(String message) {
        logger.info("ANALYTICS - Received Supplier Event: {}", message);
        analyticsData.merge("Total Suppliers", 1L, Long::sum);
    }

    @KafkaListener(topics = "bill-topic", groupId = "analytics-group")
    public void consumeBillEvents(String message) {
        logger.info("ANALYTICS - Received Bill Event: {}", message);
        analyticsData.merge("Total Bills", 1L, Long::sum);
    }
    
    public Map<String, Long> getAnalyticsData() {
        return analyticsData;
    }
}
