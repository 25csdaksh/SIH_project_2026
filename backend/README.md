# KrishiSeva — Agriculture Backend API

Production-ready, modular, multilingual (English, Gujarati, Hindi) REST API backend for the **KrishiSeva** agriculture web application.

---

## Features

1. **Pest Detection Architecture**: Image upload handling, Cloudinary-ready, disease diagnosis, and localized treatment recommendations.
2. **Live Weather Service**: Weather integration with 30-minute MongoDB caching, forecasts, and agricultural metrics.
3. **Soil & Geographic Information**: Comprehensive dataset covering **all 33 districts of Gujarat**, soil pH, NPK profiles, water sources, and APMC markets.
4. **Smart Krishi Advisory**: District → Crop → Season dependency validation with custom fertilizer and irrigation timing guidance.
5. **Live Mandi Rates**: APMC market prices filtered by district, market, and commodity with offline database fallbacks.
6. **Government Schemes**: Verified official schemes (PM-KISAN, PMFBY, i-Khedut, KCC) with direct government portal links.
7. **AI Chatbot**: Agriculture-focused Google Gemini AI assistant with strict security prompt boundaries.
8. **Multilingual Architecture**: Native support for `en` (English), `gu` (Gujarati), and `hi` (Hindi) via `?lang=` query parameters.

---

## Required Technology Stack

* Node.js & Express.js (ES Module Syntax)
* MongoDB Atlas & Mongoose
* JWT Authentication & bcryptjs Password Hashing
* Multer & Cloudinary SDK
* Google Gemini API (`@google/generative-ai`)
* Security: Helmet, CORS, Express Rate Limit, Morgan logging

---

## Folder Structure

```text
backend/
├── src/
│   ├── config/          # Environment, MongoDB & Cloudinary settings
│   ├── controllers/     # Thin controllers for HTTP request/response
│   ├── models/          # Mongoose Schemas (User, District, Crop, Soil, etc.)
│   ├── routes/          # Express API Route endpoints
│   ├── services/        # Business logic & external API integrations
│   ├── middleware/      # Auth, Error handling, Multer upload & validation
│   ├── utils/           # Logger, API response helper & language validators
│   ├── seed/            # Seed data (33 Gujarat Districts, Crops, Soil, Schemes)
│   ├── app.js           # Express App configuration
│   └── server.js        # Server bootstrapper
├── uploads/             # Static file storage directory
├── .env.example         # Environment template
├── package.json
└── README.md
```

---

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Populate `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/krishiseva
JWT_SECRET=your_jwt_secret_key
WEATHER_API_KEY=your_openweather_key
MANDI_API_KEY=your_datagov_key
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed Database
Populate all 33 Gujarat districts, crops, soil profiles, and schemes into MongoDB:
```bash
npm run seed
```

### 4. Run Server
Development mode with Nodemon:
```bash
npm run dev
```
Production mode:
```bash
npm start
```

---

## Key API Endpoints

### Health Check
- `GET /api/health`

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Soil & Geography
- `GET /api/soil/districts?lang=gu`
- `GET /api/soil/district/:id?lang=hi`
- `GET /api/soil/district/:id/crops?lang=en`

### Smart Krishi
- `GET  /api/smart-krishi/crops/:cropId/seasons`
- `POST /api/smart-krishi/advisory`

### Live Weather
- `GET /api/weather?district=Anand&lang=gu`

### Live Mandi Rates
- `GET /api/mandi/rates?district=Anand`

### Government Schemes
- `GET /api/government-schemes?lang=gu`
- `GET /api/government-schemes/:id`

### AI Chatbot
- `POST /api/chatbot/message` (Body: `{ "message": "...", "language": "gu" }`)

### Pest Detection
- `POST /api/pest-detection/analyze` (Multipart Form: `image`, `language`)
