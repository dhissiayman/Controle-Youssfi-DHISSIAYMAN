package ma.emsi.dhissiayman.tp4.billingservice.web;


import ma.emsi.dhissiayman.tp4.billingservice.entities.Bill;
import ma.emsi.dhissiayman.tp4.billingservice.fein.CustomerRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.fein.ProductRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.repository.BillRepository;
import ma.emsi.dhissiayman.tp4.billingservice.repository.ProductItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BillRestController {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private ProductItemRepository productItemRepository;
    @Autowired
    private CustomerRestClient customerRestClient;
    @Autowired
    private ProductRestClient productRestClient;
    @GetMapping(path = "/bills/{id}")
    public Bill getBill(@PathVariable Long id){
        Bill bill = billRepository.findById(id).get();
        bill.setCustomer(customerRestClient.getCustomerById(bill.getCustomerId()));
        bill.getProductItems().forEach(productItem -> {
            productItem.setProduct(productRestClient.getProductById(productItem.getProductId()));
        });
        return bill;
    }
}
