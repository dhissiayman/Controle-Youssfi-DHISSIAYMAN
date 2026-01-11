package ma.emsi.dhissiayman.tp4.supplierservice.repository;

import ma.emsi.dhissiayman.tp4.supplierservice.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
