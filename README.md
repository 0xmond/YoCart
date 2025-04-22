# 🛒 YoCart API

An advanced, full-featured e-commerce backend built with **NestJS**, integrating **Stripe**, **MongoDB**, **JWT authentication**, **email services**, **real-time stock updates**, and more.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication (Access & Refresh Tokens)
- Role-based access control (RBAC)
- Guards for:
  - Public routes
  - Role-restricted routes
  - Verified-user-only access

### 👤 User Management

- Secure user registration & login
- Email verification with OTP
- Password reset functionality

### 💳 Payment Integration

- Stripe payment gateway
- Secure payment flow & webhook handling

### 📧 Email Service

- Nodemailer for:
  - Email verification
  - Password reset emails

### ⚡ Real-time & Performance

- **🧠 Caching**: Product data caching using **Redis** for better performance
- **🔄 Real-time Stock Updates**: Powered by **Socket.io** for seamless stock updates across clients

### 🛢️ Database

- MongoDB with Mongoose
- Abstract Repository Pattern for cleaner database operations

### ✅ Code Quality

- Fully typed with TypeScript
- Validation using `class-validator`
- Prettier for consistent formatting

---

## ⚙️ Prerequisites

- **Node.js**: v16 or higher
- **MongoDB**: A running MongoDB instance
- **Redis**: For caching and real-time updates
- **Stripe Account**
- **.env File**: See below

---

## 📦 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/0xmond/YoCart.git
cd YoCart
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_URL=YOUR_DB_URL
EMAIL=YOUR_EMAIL
PASS=YOUR_SENDING_EMAIL_PASSWORD
JWT_SECRET=YOUR_JWT_KEY
CLOUD_NAME=YOUR_CLOUD_NAME
API_KEY=YOUR_CLOUD_API_KEY
API_SECRET=YOUR_CLOUD_API_SECRET
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
REDIS_URI=YOUR_REDIS_URI
```

### 4. Run the App

```bash
npm run start:dev
```

### 5. Access the API

Through: [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
src/
├── auth/               # Auth & RBAC logic
├── common/             # Shared modules & helpers
├── dashboard/          # Admin-related endpoints
├── db/                 # MongoDB setup
├── user/               # User logic
├── seller/             # Seller logic
├── app.module.ts       # Root application module
├── global.module.ts    # Global imports & config
└── main.ts             # Entry point
```

---

## 🛠️ Tech Stack

- **NestJS** – Main framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM
- **Stripe** – Payment gateway
- **Nodemailer** – Email service
- **Redis** – Caching & performance
- **Socket.io** – Real-time communication (stock updates)
- **TypeScript** – Type-safe coding

---

## 🤝 Contributing

Pull requests are welcome!  
Please fork the repo and submit your PR.

---

## 📬 Contact

Have questions or need help?

📧 [mostafamahmoud12120@gmail.com](mailto:mostafamahmoud12120@gmail.com)

---

> Made with ❤️ using NestJS, MongoDB, Redis & Socket.io
