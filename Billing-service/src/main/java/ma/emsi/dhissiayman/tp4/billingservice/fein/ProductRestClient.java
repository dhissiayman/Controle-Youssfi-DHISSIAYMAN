package ma.emsi.dhissiayman.tp4.billingservice.fein;

import ma.emsi.dhissiayman.tp4.billingservice.MODEL.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "INVENTORY-SERVICE")
public interface ProductRestClient {
    @GetMapping("/api/products/{id}")
    Product getProductById(@PathVariable String id);
    @GetMapping("/api/products")
    PagedModel<Product> getAllProducts();
}
