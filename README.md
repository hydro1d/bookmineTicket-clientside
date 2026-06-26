# 🎫 TicketBari - Online Ticket Booking Platform

> Bangladesh's premium online ticket reservation platform. Book buses, trains, flights, and ferries with secure Stripe-powered payments.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [API Endpoints](#api-endpoints)
- [Role-Based Access](#role-based-access)
- [Default Test Credentials](#default-test-credentials)
- [Stripe Test Payments](#stripe-test-payments)

---

## Overview

TicketBari is a full-stack MERN application that allows users to browse, book, and pay for transport tickets across Bangladesh. The platform supports three distinct roles — **Admin**, **Vendor**, and **User** — each with their own dedicated dashboard and permissions.

---

## Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| React Router DOM v7 | Client-side routing |
| TailwindCSS v4 + DaisyUI | Styling |
| Framer Motion | Animations |
| Recharts | Revenue charts (Vendor dashboard) |
| @stripe/react-stripe-js | Stripe payment UI (CardElement) |
| React Hook Form | Form validation |
| @tanstack/react-query | Server state management |
| Axios | HTTP client |
| jsPDF + html2canvas | PDF ticket generation |
| Swiper | Featured ticket carousel |
| Lucide React | Icon library |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Stripe Node SDK | Payment intent creation |
| Helmet | Security headers |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |

---

## Project Structure

```
bookmineTicket/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context (Auth, Theme)
│   │   ├── layouts/            # DashboardLayout with sidebar
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Landing page with featured tickets
│   │   │   ├── AllTickets.tsx  # Browse & filter all tickets
│   │   │   ├── TicketDetails.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard/
│   │   │       ├── Admin/      # AdminStats, ManageUsers, ManageTickets, AdvertiseTickets
│   │   │       ├── Vendor/     # AddTicket, MyTickets, RequestedBookings, VendorRevenue
│   │   │       └── User/       # MyBookings, PayBooking, MyTransactions
│   │   ├── services/
│   │   │   └── api.ts          # Axios instance with JWT interceptor
│   │   └── utils/
│   │       └── imageMapper.ts  # Transport-type image mapping utility
│   └── .env                    # Frontend env variables
│
└── server/                     # Express backend
    ├── controllers/            # Route handler logic
    ├── middleware/             # Auth & role protection middleware
    ├── models/                 # Mongoose schemas (User, Ticket, Booking, Transaction)
    ├── routes/                 # Express routers
    ├── scripts/
    │   └── seed.js             # Database seeder
    └── .env                    # Backend env variables
```

---

## Features

### 🏠 Public Pages
- **Home** — Hero section, featured advertised tickets carousel, transport-type filters, trust indicators
- **All Tickets** — Browse, search by route, filter by transport type, and sort by price/date
- **Ticket Details** — Full ticket info, perks, seat quantity, and booking form

### 👤 User Dashboard
- **My Bookings** — View all booking requests with status (pending / accepted / paid / cancelled), pay for accepted bookings, cancel pending ones, download PDF tickets for paid bookings
- **Pay Booking** — Stripe CardElement checkout flow with client secret exchange
- **My Transactions** — History of all completed payments

### 🏢 Vendor Dashboard
- **Add Ticket** — Create new ticket listings with route, price, seats, perks, and transport type
- **My Tickets** — View, edit, and delete own ticket listings; see verification status
- **Requested Bookings** — Accept or reject customer booking requests
- **Revenue Analytics** — Recharts bar/line charts showing earnings over time

### 🛡️ Admin Dashboard
- **Admin Stats** — Platform-wide overview: total users, tickets, revenue, and pending items
- **Manage Users** — View all users, promote/demote roles, delete accounts
- **Manage Tickets** — Approve or reject vendor ticket submissions, verify listings
- **Advertise Tickets** — Toggle which approved tickets appear in the home page featured carousel

---

## Getting Started

### Prerequisites
- Node.js >= 18
- A MongoDB Atlas cluster (or local MongoDB)
- A Stripe account with test API keys

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `.env` files in both `/server` and `/client` directories. See the [Environment Variables](#environment-variables) section below.

### 3. Seed the Database

```bash
cd server
npm run seed
```

### 4. Run the Application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev     # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd client
npm run dev     # Starts on http://localhost:5173
```

---

## Environment Variables

### `/server/.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### `/client/.env`

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Never commit your `.env` files.** Both are listed in `.gitignore`.

---

## Seeding the Database

The seed script clears all existing `Users` and `Tickets` and inserts fresh test data.

```bash
cd server
npm run seed
```

**What gets created:**
- **4 users** (1 admin, 2 vendors, 1 regular user)
- **8 tickets** across all transport types (bus, train, flight, ferry), all approved and with future departure times

---

## API Endpoints

### Auth — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Create a new user account |
| POST | `/login` | Authenticate and receive a JWT |

### Tickets — `/api/tickets`
| Method | Route | Access |
|---|---|---|
| GET | `/` | Public — list all approved tickets |
| GET | `/:id` | Public — get single ticket details |
| POST | `/` | Vendor — create a new ticket |
| PUT | `/:id` | Vendor — update own ticket |
| DELETE | `/:id` | Vendor/Admin — delete a ticket |

### Bookings — `/api/bookings`
| Method | Route | Access |
|---|---|---|
| POST | `/` | User — request a booking |
| GET | `/my` | User — get own bookings |
| GET | `/vendor` | Vendor — get booking requests for own tickets |
| PATCH | `/:id/status` | Vendor — accept or reject a booking |
| DELETE | `/:id` | User — cancel a pending booking |

### Payments — `/api/payments`
| Method | Route | Access |
|---|---|---|
| POST | `/create-checkout-session` | User — create Stripe PaymentIntent |
| POST | `/verify` | User — verify payment and finalize booking |

### Admin — `/api/admin`
| Method | Route | Access |
|---|---|---|
| GET | `/users` | Admin — list all users |
| PATCH | `/users/:id/role` | Admin — change user role |
| DELETE | `/users/:id` | Admin — delete a user |
| PATCH | `/tickets/:id/verify` | Admin — approve/reject a ticket |
| PATCH | `/tickets/:id/advertise` | Admin — toggle ticket advertisement |

### Dashboard — `/api/dashboard`
| Method | Route | Access |
|---|---|---|
| GET | `/stats` | Admin/Vendor — platform or vendor-specific stats |

---

## Role-Based Access

| Feature | User | Vendor | Admin |
|---|:---:|:---:|:---:|
| Browse tickets | ✅ | ✅ | ✅ |
| Book a ticket | ✅ | ❌ | ❌ |
| Pay for a booking | ✅ | ❌ | ❌ |
| Download PDF ticket | ✅ | ❌ | ❌ |
| Create/manage tickets | ❌ | ✅ | ✅ |
| Accept/reject bookings | ❌ | ✅ | ❌ |
| View revenue analytics | ❌ | ✅ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |
| Approve ticket listings | ❌ | ❌ | ✅ |
| Manage advertisements | ❌ | ❌ | ✅ |

---

## Default Test Credentials

These accounts are created by the seed script:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@ticketbari.com` | `adminpassword123` |
| **Vendor** | `greenline@vendor.com` | `vendorpassword123` |
| **Vendor** | `airways@vendor.com` | `vendorpassword123` |
| **User** | `user@ticketbari.com` | `userpassword123` |

---

## Stripe Test Payments

This project runs in **Stripe test mode**. Real card numbers will be rejected. Use one of the following test cards instead:

### ✅ Successful Payments
| Brand | Card Number |
|---|---|
| Visa | `4242 4242 4242 4242` |
| Mastercard | `5555 5555 5555 4444` |
| American Express | `3782 822463 10005` |
| Visa Debit | `4000 0566 5566 5556` |

### ❌ Declined / Error Cards
| Scenario | Card Number |
|---|---|
| Generic Decline | `4000 0000 0000 0002` |
| Insufficient Funds | `4000 0000 0000 9995` |
| Expired Card | `4000 0000 0000 0069` |
| Incorrect CVC | `4000 0000 0000 0127` |
| Lost Card | `4000 0000 0000 0036` |
| Stolen Card | `4000 0000 0000 0044` |

> Use **any future expiry date**, **any 3-digit CVC**, and **any postal code** with the above test cards.
