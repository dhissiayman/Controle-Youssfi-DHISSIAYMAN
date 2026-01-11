package ma.emsi.dhissiayman.tp4.supplierservice;

import ma.emsi.dhissiayman.tp4.supplierservice.entities.Supplier;
import ma.emsi.dhissiayman.tp4.supplierservice.repository.SupplierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.stream.Stream;

@SpringBootApplication
public class SupplierServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SupplierServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner init(SupplierRepository supplierRepository) {
		return args -> {
			Stream.of("HP", "Dell", "Lenovo", "Apple").forEach(name -> {
				Supplier supplier = Supplier.builder()
						.name(name)
						.email("contact@" + name.toLowerCase() + ".com")
						.build();
				supplierRepository.save(supplier);
			});
			supplierRepository.findAll().forEach(System.out::println);
		};
	}
}
