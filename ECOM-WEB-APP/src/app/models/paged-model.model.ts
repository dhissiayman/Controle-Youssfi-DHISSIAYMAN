/**
 * PagedModel wrapper matching Spring HATEOAS PagedModel
 * Used for paginated responses from Spring Data REST
 */
export interface PagedModel<T> {
  _embedded?: {
    [key: string]: T[];
  };
  _links?: {
    [key: string]: {
      href: string;
    };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

/**
 * Helper to extract content from PagedModel
 */
export function extractContent<T>(pagedModel: PagedModel<T>): T[] {
  if (pagedModel._embedded) {
    const keys = Object.keys(pagedModel._embedded);
    if (keys.length > 0) {
      return pagedModel._embedded[keys[0]];
    }
  }
  return [];
}

