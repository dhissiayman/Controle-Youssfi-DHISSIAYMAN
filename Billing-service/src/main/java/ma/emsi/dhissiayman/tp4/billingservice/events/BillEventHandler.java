package ma.emsi.dhissiayman.tp4.billingservice.events;

import ma.emsi.dhissiayman.tp4.billingservice.entities.Bill;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Bill.class)
public class BillEventHandler {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final Logger logger = LoggerFactory.getLogger(BillEventHandler.class);

    public BillEventHandler(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @HandleAfterCreate
    public void handleBillCreate(Bill bill) {
        logger.info("New bill created with ID: {}", bill.getId());
        kafkaTemplate.send("bill-topic", "New Bill Created for Customer: " + bill.getCustomerId() + " with Amount: " + bill.getTotal());
    }
}
