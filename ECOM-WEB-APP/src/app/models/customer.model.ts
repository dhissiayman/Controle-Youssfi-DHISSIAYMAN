/**
 * Customer model matching Spring Customer entity
 */
export interface Customer {
  id: number;
  name: string;
  email: string;
}

/**
 * Customer DTO for creating/updating customers
 */
export interface CustomerDto {
  name: string;
  email: string;
}

