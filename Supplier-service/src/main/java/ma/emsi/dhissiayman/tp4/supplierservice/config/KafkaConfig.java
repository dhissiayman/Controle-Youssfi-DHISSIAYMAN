package ma.emsi.dhissiayman.tp4.supplierservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic supplierTopic() {
        return TopicBuilder.name("supplier-topic")
                .build();
    }
}
