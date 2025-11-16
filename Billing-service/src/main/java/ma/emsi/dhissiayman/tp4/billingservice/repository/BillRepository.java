package ma.emsi.dhissiayman.tp4.billingservice.repository;

import ma.emsi.dhissiayman.tp4.billingservice.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BillRepository extends JpaRepository<Bill, Long> {
}
