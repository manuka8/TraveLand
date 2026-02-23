# TraveLand – Full-Stack Travel Booking Platform

A production-ready travel booking website built with **React + Vite + Tailwind CSS** (Frontend) and **Node.js + Express + MySQL** (Backend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MySQL server running locally

### 1. Backend Setup

```bash
cd Backend
npm install
```

Edit `.env` and update your **MySQL credentials**:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=traveland_db
```

> **Create the database first:**
> ```sql
> CREATE DATABASE traveland_db CHARACTER SET utf8mb4;
> ```

Start the backend:
```bash
npm run dev
```

Expected console output:
```
  ✔ Database connected
  ✔ users.sql loaded
  ✔ destinations.sql loaded
  ...
  🚀 Server running on port 5000
```

---

### 2. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
TraveLand/
├── Backend/
│   └── src/
│       ├── config/db.js
│       ├── controllers/        (auth, user, destination, package, booking, payment, review, admin)
│       ├── middleware/         (auth, role, validate, errorHandler)
│       ├── models/             (all entity models with SQL queries)
│       ├── routes/             (all route files)
│       ├── utils/
│       │   ├── dbInit.js
│       │   └── dbUtils/        (.sql schema files)
│       ├── app.js
│       └── server.js
└── Frontend/
    └── src/
        ├── animations/
        ├── components/
        │   ├── layout/         (Navbar, Footer, MainLayout)
        │   └── ui/             (DestinationCard, PackageCard, StarRating, SkeletonLoader)
        ├── context/            (AuthContext)
        ├── pages/              (Home, Auth, Destinations, Packages, Booking, Dashboards, Profile)
        ├── routes/             (AppRouter, guards)
        ├── services/           (api.js – Axios service)
        └── App.jsx
```

---

## 🔐 Default Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/destinations` | List destinations |
| GET | `/api/packages` | List packages |
| POST | `/api/bookings` | Create booking (auth) |
| GET | `/api/admin/stats` | Admin dashboard stats |

---

## 👤 Creating an Admin User

After starting the server, manually update a user's `role_id` to `2` (admin):

```sql
UPDATE users SET role_id = 2 WHERE email = 'your@email.com';
```
