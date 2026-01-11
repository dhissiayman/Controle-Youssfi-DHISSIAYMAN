package ma.emsi.dhissiayman.tp4.supplierservice.events;

import ma.emsi.dhissiayman.tp4.supplierservice.entities.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler(Supplier.class)
public class SupplierEventHandler {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final Logger logger = LoggerFactory.getLogger(SupplierEventHandler.class);

    public SupplierEventHandler(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @HandleAfterCreate
    public void handleSupplierCreate(Supplier supplier) {
        logger.info("New supplier created: {}", supplier.getName());
        kafkaTemplate.send("supplier-topic", "New Supplier Created: " + supplier.getName());
    }
}
