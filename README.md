# PetBoard Frontend

PetBoard Frontend is a Next.js dashboard for managing pet boarding operations. It provides a clean admin interface for customers, pets, bookings, invoices, and daily operational metrics.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix UI
- TanStack Query
- TanStack Table
- React Hook Form and Zod

## Features

- Dashboard metrics for check-ins, check-outs, boarded pets, and monthly bookings
- Customer and pet record management
- Booking creation and status tracking
- Invoice listing and payment status updates
- Responsive admin layout with reusable table and form components

## Local Development

```bash
npm install
npm run dev
```

Set the backend API URL when needed:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080 npm run dev
```

## Production Build

```bash
NEXT_PUBLIC_API_URL=<backend-url> npm run build
```
