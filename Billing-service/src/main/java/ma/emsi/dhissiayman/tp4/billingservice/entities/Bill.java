package ma.emsi.dhissiayman.tp4.billingservice.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Customer;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@NoArgsConstructor @AllArgsConstructor @Getter @Setter @Builder
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date billingDate;
    private long customerId;
    @OneToMany(mappedBy = "bill")
    private List<ProductItem> productItems = new ArrayList<>();
    @Transient private Customer customer;

    public double getTotal() {
        double total = 0;
        for (ProductItem pi : productItems) {
            total += pi.getUnitPrice() * pi.getQuantity();
        }
        return total;
    }
}
