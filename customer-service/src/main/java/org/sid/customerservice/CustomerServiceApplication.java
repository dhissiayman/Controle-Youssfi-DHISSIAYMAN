package org.sid.customerservice;

import org.sid.customerservice.entities.Customer;
import org.sid.customerservice.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CustomerServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(CustomerRepository customerRepository) {
		return args -> {
			customerRepository.save(Customer.builder()
							.name("ahmed").email("hello@gmail.com")
					.build());
			customerRepository.save(Customer.builder()
					.name("oussama").email("hello@gmail.com")
					.build());
			customerRepository.save(Customer.builder()
					.name("ayman").email("hello@gmail.com")
					.build());

			customerRepository.findAll().forEach(c->{
				System.out.println(c.getName());
				System.out.println(c.getId());
				System.out.println(c.getName());
			});

		};
	}

}
