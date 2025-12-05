package ma.emsi.dhissiayman.tp4.billingservice.web;


import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Customer;
import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Product;
import ma.emsi.dhissiayman.tp4.billingservice.entities.Bill;
import ma.emsi.dhissiayman.tp4.billingservice.entities.ProductItem;
import ma.emsi.dhissiayman.tp4.billingservice.fein.CustomerRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.fein.ProductRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.repository.BillRepository;
import ma.emsi.dhissiayman.tp4.billingservice.repository.ProductItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Bill REST Controller
 * 
 * NOTE: CORS is handled by the Gateway Service, not here.
 * Removing @CrossOrigin to avoid duplicate CORS headers.
 * The Gateway's CorsWebFilter handles all CORS configuration.
 */
@RestController
public class BillRestController {
    private static final Logger logger = LoggerFactory.getLogger(BillRestController.class);
    
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private ProductItemRepository productItemRepository;
    @Autowired
    private CustomerRestClient customerRestClient;
    @Autowired
    private ProductRestClient productRestClient;

    /**
     * Get all bills
     * GET /bills
     * Returns list of all bills with populated customer and product items
     */
    @GetMapping(path = "/bills")
    public List<Bill> getAllBills() {
        logger.info("Fetching all bills");
        List<Bill> bills = billRepository.findAll();
        logger.debug("Found {} bills in database", bills.size());
        
        bills.forEach(bill -> {
            // Populate customer information
            try {
                bill.setCustomer(customerRestClient.getCustomerById(bill.getCustomerId()));
            } catch (Exception e) {
                logger.warn("Failed to fetch customer {} for bill {}: {}", 
                    bill.getCustomerId(), bill.getId(), e.getMessage());
                // If customer service is unavailable, continue without customer data
            }
            // Populate product information for each product item
            bill.getProductItems().forEach(productItem -> {
                try {
                    productItem.setProduct(productRestClient.getProductById(productItem.getProductId()));
                } catch (Exception e) {
                    logger.warn("Failed to fetch product {} for bill {}: {}", 
                        productItem.getProductId(), bill.getId(), e.getMessage());
                    // If product service is unavailable, continue without product data
                }
            });
        });
        logger.info("Returning {} bills", bills.size());
        return bills;
    }

    /**
     * Get bill by ID
     * GET /bills/{id}
     * Returns bill with populated customer and product items
     */
    @GetMapping(path = "/bills/{id}")
    public ResponseEntity<Bill> getBill(@PathVariable Long id){
        logger.info("Fetching bill with id: {}", id);
        Bill bill = billRepository.findById(id).orElse(null);
        if (bill == null) {
            logger.warn("Bill with id {} not found", id);
            return ResponseEntity.notFound().build();
        }
        try {
            bill.setCustomer(customerRestClient.getCustomerById(bill.getCustomerId()));
        } catch (Exception e) {
            logger.warn("Failed to fetch customer {} for bill {}: {}", 
                bill.getCustomerId(), bill.getId(), e.getMessage());
            // If customer service is unavailable, continue without customer data
        }
        bill.getProductItems().forEach(productItem -> {
            try {
                productItem.setProduct(productRestClient.getProductById(productItem.getProductId()));
            } catch (Exception e) {
                logger.warn("Failed to fetch product {} for bill {}: {}", 
                    productItem.getProductId(), bill.getId(), e.getMessage());
                // If product service is unavailable, continue without product data
            }
        });
        logger.info("Returning bill with id: {}", id);
        return ResponseEntity.ok(bill);
    }

    /**
     * Generate bills for all customers
     * POST /bills/generate
     * Creates bills automatically for all existing customers with all existing products
     * No need to restart the service!
     */
    @PostMapping(path = "/bills/generate")
    public ResponseEntity<Map<String, Object>> generateBills() {
        logger.info("Generating bills for all customers");
        Map<String, Object> response = new HashMap<>();
        
        try {
            Collection<Customer> customers = customerRestClient.getAllCustomers().getContent();
            Collection<Product> products = productRestClient.getAllProducts().getContent();
            logger.info("Found {} customers and {} products", customers.size(), products.size());

            if (customers.isEmpty()) {
                response.put("success", false);
                response.put("message", "No customers found. Please create customers first.");
                response.put("billsCreated", 0);
                return ResponseEntity.badRequest().body(response);
            }
            
            if (products.isEmpty()) {
                response.put("success", false);
                response.put("message", "No products found. Please create products first.");
                response.put("billsCreated", 0);
                return ResponseEntity.badRequest().body(response);
            }

            int billsCreated = 0;
            int existingBillsCount = (int) billRepository.count();
            
            // Get all existing bills once to avoid multiple queries
            List<Bill> existingBills = billRepository.findAll();
            Set<Long> customersWithBills = existingBills.stream()
                    .map(Bill::getCustomerId)
                    .collect(Collectors.toSet());
            
            // Create a bill for each customer
            for (Customer customer : customers) {
                // Check if bill already exists for this customer
                if (!customersWithBills.contains(customer.getId())) {
                    Bill bill = Bill.builder()
                            .billingDate(new Date())
                            .customerId(customer.getId())
                            .build();
                    billRepository.save(bill);
                    
                    // Add all products to this bill
                    for (Product product : products) {
                        ProductItem productItem = ProductItem.builder()
                                .bill(bill)
                                .productId(product.getId())
                                .quantity(1 + new Random().nextInt(10))
                                .unitPrice((double) product.getPrice())
                                .build();
                        productItemRepository.save(productItem);
                    }
                    billsCreated++;
                }
            }
            
            int totalBills = (int) billRepository.count();
            logger.info("Successfully created {} bills. Total bills: {}", billsCreated, totalBills);
            
            response.put("success", true);
            response.put("message", "Bills generated successfully!");
            response.put("billsCreated", billsCreated);
            response.put("totalBills", totalBills);
            response.put("customersCount", customers.size());
            response.put("productsCount", products.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error generating bills", e);
            response.put("success", false);
            response.put("message", "Error generating bills: " + e.getMessage());
            response.put("billsCreated", 0);
            return ResponseEntity.status(500).body(response);
        }
    }
}
