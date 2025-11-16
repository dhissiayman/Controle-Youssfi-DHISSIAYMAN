package ma.emsi.dhissiayman.tp4.inventoryservice.repository;

import ma.emsi.dhissiayman.tp4.inventoryservice.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, String> {
}
