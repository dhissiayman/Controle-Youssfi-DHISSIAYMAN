package ma.emsi.dhissiayman.tp4.billingservice.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Product;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;
    @ManyToOne
    private Bill bill;
    private int quantity;
    private double unitPrice;
    @Transient
    private Product product;

}
