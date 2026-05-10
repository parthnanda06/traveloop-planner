# 🌍 Traveloop — AI-Powered Travel Planning Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Traveloop** is a premium, AI-driven travel planning application that turns your scattered ideas into stunning, organized itineraries. Built with a modern tech stack and a focus on visual storytelling.

---

## ✨ Features

- 🤖 **AI Trip Planner**: Generate full 7-day itineraries in seconds using **Llama 3.3** (via Groq Cloud).
- 💰 **Budget Analytics**: Interactive Pie and Line charts (via Recharts) to track spending across cities and categories.
- 🗺️ **Visual Timeline**: A professional vertical timeline for stops and activities with drag-and-drop reordering.
- 🔗 **Public Share Page**: Generate tokenized, read-only links to share your plans with friends and family.
- 📦 **Packing & Notes**: Category-based checklists and colorful sticky notes for trip journaling.
- 🔐 **Secure Auth**: JWT-based authentication with protected routes and personalized profiles.
- 🌙 **Modern Aesthetic**: Full dark/light mode support with a cyan-to-teal premium design system.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or Atlas)
- **Groq API Key** (Get it free at [Groq Console](https://console.groq.com/))

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/parthnanda06/traveloop-planner.git
cd traveloop-planner

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the **backend** directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

### 4. Run the Application

```bash
# From the root directory
npm run dev
```
*The backend will run on port 5000 and the frontend on port 5173.*

---

## 📁 Project Structure

```text
odoo/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Business logic & AI orchestration
│   │   ├── middleware/    # Auth & Error handling
│   │   ├── models/        # Mongoose data schemas
│   │   └── routes/        # API endpoint definitions
│
└── frontend/
    └── src/
        ├── components/    # Reusable UI (Card, Button, Badge)
        ├── context/       # Global Auth & Theme state
        ├── pages/         # High-level route components
        └── services/      # Axios API service layer
```

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/ai/generate` | Generate AI itinerary |
| `GET`  | `/api/trips` | Fetch all user trips |
| `POST` | `/api/trips/:id/share` | Create public share link |
| `GET`  | `/api/trips/shared/:token` | Access public trip view |

---

## 🛠️ Built With

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, TanStack Query.
- **Backend**: Node.js, Express, Mongoose, JWT.
- **AI**: Groq Cloud (Llama 3.3 70B).

---
© 2026 Traveloop. All adventures reserved. Built with ❤️ for travelers everywhere.
