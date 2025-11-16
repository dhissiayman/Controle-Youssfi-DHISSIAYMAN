package ma.emsi.dhissiayman.tp4.billingservice.repository;

import ma.emsi.dhissiayman.tp4.billingservice.entities.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
}
