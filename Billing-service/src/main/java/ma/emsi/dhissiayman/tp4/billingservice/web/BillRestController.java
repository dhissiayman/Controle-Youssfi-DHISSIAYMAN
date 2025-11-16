package ma.emsi.dhissiayman.tp4.billingservice.web;


import ma.emsi.dhissiayman.tp4.billingservice.entities.Bill;
import ma.emsi.dhissiayman.tp4.billingservice.fein.CustomerRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.fein.ProductRestClient;
import ma.emsi.dhissiayman.tp4.billingservice.repository.BillRepository;
import ma.emsi.dhissiayman.tp4.billingservice.repository.ProductItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BillRestController {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private ProductItemRepository productRepository;
    @Autowired
    private CustomerRestClient customerRepository;
    @Autowired
    private ProductRestClient productRestClient;

    public Bill getBill(Long id){
        Bill bill= billRepository.findById(id).get();
        return bill;
    }
}
