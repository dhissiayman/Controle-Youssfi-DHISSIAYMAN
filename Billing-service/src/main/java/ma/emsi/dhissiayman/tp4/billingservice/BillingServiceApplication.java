package ma.emsi.dhissiayman.tp4.billingservice;

import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Customer;
import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Product;
import ma.emsi.dhissiayman.tp4.billingservice.entities.Bill;
import ma.emsi.dhissiayman.tp4.billingservice.entities.ProductItem;
import ma.emsi.dhissiayman.tp4.billingservice.fein.CustomerRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.fein.ProductRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.repository.BillRepository;
import ma.emsi.dhissiayman.tp4.billingservice.repository.ProductItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.util.Collection;

@SpringBootApplication
@EnableFeignClients
public class BillingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillingServiceApplication.class, args);
    }
    @Bean
    CommandLineRunner commandLineRunner(BillRepository  billRepository,
                                        ProductItemRepository productItemRepository,
                                        CustomerRestClient customerRestClient,
                                        ProductRestClient productRestClient){

        return args -> {
            // Automatic bill generation on startup is disabled
            // Use the /api/bills/generate endpoint from the frontend instead
            System.out.println("ℹ️  Billing Service started successfully.");
            System.out.println("ℹ️  Use POST /api/bills/generate to create bills on demand.");
            System.out.println("ℹ️  No automatic bill generation on startup.");
            
            // Optional: Try to check if other services are available (non-blocking)
            try {
                Collection<Customer> customers = customerRestClient.getAllCustomers().getContent();
                Collection<Product> products = productRestClient.getAllProducts().getContent();
                
                if (!customers.isEmpty() && !products.isEmpty()) {
                    System.out.println("ℹ️  Found " + customers.size() + " customers and " + products.size() + " products.");
                    System.out.println("ℹ️  You can generate bills using the /api/bills/generate endpoint.");
                } else {
                    System.out.println("⚠️  No customers or products found yet. Start Customer and Inventory services first.");
                }
            } catch (Exception e) {
                // Services not available yet - this is normal at startup
                System.out.println("ℹ️  Customer/Inventory services not available yet. This is normal.");
                System.out.println("ℹ️  Services will be available once all microservices are started.");
            }
        };
    }

}