# Payment Management System

Technical for clearing.com

## 🛠 Tech Stack

### Backend
- **NestJS** - Node.js framework for building efficient server-side applications
- **Prisma** - Next-generation ORM for TypeScript & Node.js
- **PostgreSQL** - Reliable relational database
- **TypeScript** - Type-safe JavaScript

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **React Router v7** - Declarative routing for React applications
- **Material-UI (MUI)** - React components implementing Google's Material Design
- **Vite** - Fast build tool and development server

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (≥20.0.0)
- **npm** (≥10.0.0)

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm i
```

```bash
cd backend
npm i
```

Run database migrations and seed data:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db push

#Run a development Postgres database & press H to print out db url to copy to .env
npx prisma dev
```

Create a `.env` file in the backend directory & paste in the DATABASE_URL:

```
DATABASE_URL="prisma+postgres://localhost:51213/?..."
```

Run a seeder to fake data
```bash
npm run seed
```

In another terminal start the backend server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 2. Frontend Setup

In another terminal start frontend
```bash
cd frontend
npm i
npm run dev
```
The application will be available at `http://localhost:5173`

## 📊 Database Schema

The application uses the following main entities:

### Account
- `id` - Unique identifier
- `name` - Account holder name
- `address` - Account holder address
- `phoneNumber` - Contact phone number
- `bankAccountNumber` - Bank account number (optional)

### Payment
- `id` - Unique identifier
- `amount` - Payment amount
- `accountId` - Reference to account
- `recipientName` - Payment recipient name
- `recipientBankName` - Recipient's bank name
- `recipientAccountNumber` - Recipient's account number
- `status` - Payment status (PENDING/APPROVED)
- `notes` - Optional payment notes

## 🔌 API Endpoints

### Accounts
- `GET /accounts` - List all accounts
- `GET /accounts/:id` - Get account by ID
- `POST /accounts` - Create new account
- `PUT /accounts/:id` - Update account

### Payments
- `GET /payments` - List all payments
- `GET /payments/:id` - Get payment by ID
- `POST /payments` - Create new payment
- `PUT /payments/:id` - Update payment

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
```