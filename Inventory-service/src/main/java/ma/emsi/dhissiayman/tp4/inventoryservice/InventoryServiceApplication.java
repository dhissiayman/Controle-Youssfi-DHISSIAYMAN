package ma.emsi.dhissiayman.tp4.inventoryservice;

import ma.emsi.dhissiayman.tp4.inventoryservice.entities.Product;
import ma.emsi.dhissiayman.tp4.inventoryservice.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class InventoryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventoryServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner init(ProductRepository productRepository) {

		return args -> {
			productRepository.save(Product.builder()
							.id(UUID.randomUUID().toString())
							.name("PRINTER")
							.price(1299)
							.quantity(10)
					      .build());
			productRepository.save(Product.builder()
					.id(UUID.randomUUID().toString())
					.name("COmputer")
					.price(3000)
					.quantity(10)
					.build());
			productRepository.save(Product.builder()
					.id(UUID.randomUUID().toString())
					.name("PARSER")
					.price(10000)
					.quantity(10)
					.build());
			productRepository.findAll().forEach(p->{
				System.out.println(p.toString());
			});


		};
	}

}
