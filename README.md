# 🌍 Traveloop — AI-Powered Travel Planning Platform

A complete full-stack travel planner built with React + TypeScript + Express + MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
# Edit .env with your MongoDB URI and GROQ_API_KEY
npm install
npm run dev          # Start dev server on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Start on http://localhost:5173
```

### Demo Login
- **Email:** `demo@traveloop.com`
- **Password:** `demo1234`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + custom animations |
| UI Components | Radix UI + custom components |
| State | React Query + React Context |
| Routing | React Router DOM v6 |
| AI Model | Llama 3.3 (via Groq Cloud) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Image Storage | Cloudinary (optional) |

## 📁 Project Structure

```
odoo/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, error, upload
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routers
│   │   └── utils/         # Seed script
│   └── uploads/           # Local file storage
│
└── frontend/
    └── src/
        ├── components/    # Reusable UI components
        ├── context/       # Auth + Theme contexts
        ├── layouts/       # AppLayout wrapper
        ├── pages/         # Route-level pages
        ├── services/      # API layer (axios)
        ├── types/         # TypeScript interfaces
        └── utils/         # Helpers + constants
```

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/trips` | List user trips |
| POST | `/api/trips` | Create trip |
| GET | `/api/trips/:id` | Get trip details |
| PUT | `/api/trips/:id` | Update trip |
| DELETE | `/api/trips/:id` | Delete trip |
| POST | `/api/trips/:id/share` | Generate share link |
| GET | `/api/trips/shared/:token` | Public trip view |
| POST | `/api/trips/:id/stops` | Add city stop |
| PUT | `/api/trips/:id/stops/:sid` | Update stop |
| DELETE | `/api/trips/:id/stops/:sid` | Delete stop |
| POST | `/api/trips/:id/stops/:sid/activities` | Add activity |
| GET | `/api/trips/:tripId/packing` | Packing list |
| GET | `/api/trips/:tripId/notes` | Trip notes |

## ✨ Features

- 🔐 **JWT Authentication**: Secure register / login / logout flow.
- 🗺️ **Itinerary Builder**: Multi-city planning with reorderable stops.
- 🤖 **AI Trip Planner**: Generate 7-day itineraries in seconds using Llama 3.3.
- 💰 **Budget Analytics**: Detailed breakdown charts (Pie/Line) for cost tracking.
- 🔗 **Public Share Page**: Beautiful, read-only links to showcase your plans.
- 📦 **Packing & Notes**: Checklist management and colorful sticky notes.
- 🌙 **Modern UI**: Full dark mode support and responsive "Traveloop" aesthetic.

---
© 2026 Traveloop. All adventures reserved.
