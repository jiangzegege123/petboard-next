import { baseUrl } from '@/lib/utils';

import { CustomerDTO } from '@/lib/types/customer';
import { PetDTO } from '@/lib/types/pet';
import { BookingDTO, BookingStatus } from '@/lib/types/booking';
import { InvoiceDTO } from '@/lib/types/invoice';
import { DashboardStats, BoardedPet } from '@/lib/types/dashboard';

type RequestBody = BodyInit | object | null;

interface HttpConfig {
  method?: string;
  body?: RequestBody;
}

async function HttpClient<T = unknown>(endpoint: string, config: HttpConfig = {}): Promise<T> {
  const init: RequestInit = {
    method: config.method ?? 'GET',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  };

  if (config.body) {
    init.body = JSON.stringify(config.body);
  }

  const url = `${baseUrl()}${endpoint}`;
  console.log(`[APIClient] ${init.method} ${url}`, config.body ?? '');

  const response = await fetch(url, init);

  if (response.status === 204) return {} as T;

  const isJson = response.headers.get('Content-Type')?.includes('application/json');

  if (response.ok) {
    return isJson ? (response.json() as Promise<T>) : (response as unknown as T);
  }

  let message = response.statusText;
  if (isJson) {
    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // ignore
    }
  }
  const error = new Error(message) as Error & { response?: { status: number; statusText: string } };
  error.response = { status: response.status, statusText: response.statusText };
  return Promise.reject(error);
}

const client = {
  Get: <T>(endpoint: string) => HttpClient<T>(endpoint),
  Post: <T>(endpoint: string, body?: RequestBody) => HttpClient<T>(endpoint, { method: 'POST', body }),
  Put: <T>(endpoint: string, body?: RequestBody) => HttpClient<T>(endpoint, { method: 'PUT', body }),
  Patch: <T>(endpoint: string, body?: RequestBody) => HttpClient<T>(endpoint, { method: 'PATCH', body }),
  Delete: <T>(endpoint: string) => HttpClient<T>(endpoint, { method: 'DELETE' }),
};

export const APIClient = {
  customers: {
    getAll: () => client.Get<CustomerDTO[]>('/api/customers'),
    getById: (id: number) => client.Get<CustomerDTO>(`/api/customers/${id}`),
    create: (data: Partial<CustomerDTO>) => client.Post<CustomerDTO>('/api/customers', data),
    update: (id: number, data: Partial<CustomerDTO>) => client.Put<CustomerDTO>(`/api/customers/${id}`, data),
    delete: (id: number) => client.Delete<void>(`/api/customers/${id}`),
  },

  pets: {
    getAll: () => client.Get<PetDTO[]>('/api/pets'),
    getById: (id: number) => client.Get<PetDTO>(`/api/pets/${id}`),
    getByCustomer: (customerId: number) => client.Get<PetDTO[]>(`/api/customers/${customerId}/pets`),
    create: (data: Partial<PetDTO>) => client.Post<PetDTO>('/api/pets', data),
    update: (id: number, data: Partial<PetDTO>) => client.Put<PetDTO>(`/api/pets/${id}`, data),
    delete: (id: number) => client.Delete<void>(`/api/pets/${id}`),
  },

  bookings: {
    getAll: () => client.Get<BookingDTO[]>('/api/bookings'),
    getById: (id: number) => client.Get<BookingDTO>(`/api/bookings/${id}`),
    create: (data: Partial<BookingDTO>) => client.Post<BookingDTO>('/api/bookings', data),
    update: (id: number, data: Partial<BookingDTO>) => client.Put<BookingDTO>(`/api/bookings/${id}`, data),
    updateStatus: (id: number, status: BookingStatus) =>
      client.Patch<BookingDTO>(`/api/bookings/${id}/status`, { status }),
  },

  invoices: {
    getAll: () => client.Get<InvoiceDTO[]>('/api/invoices'),
    getById: (id: number) => client.Get<InvoiceDTO>(`/api/invoices/${id}`),
    markPaid: (id: number) => client.Patch<InvoiceDTO>(`/api/invoices/${id}/pay`),
  },

  dashboard: {
    getStats: () => client.Get<DashboardStats>('/api/dashboard/stats'),
    getBoardedPets: () => client.Get<BoardedPet[]>('/api/dashboard/boarded-pets'),
  },
};
