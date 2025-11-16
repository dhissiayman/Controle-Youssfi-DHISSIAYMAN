package org.sid.customerservice.entities;


import org.springframework.data.rest.core.config.Projection;

@Projection(name="Email",types = Customer.class)
public interface CustomerProjectionEmail {
    String getEmail();
}
