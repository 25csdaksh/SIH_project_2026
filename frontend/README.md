# KrishiSeva — React Frontend Application

Clean, modern, professional, and multilingual (English, Gujarati, Hindi) React + Vite web frontend for the **KrishiSeva** agriculture intelligence platform.

---

## Features

1. **Interactive 33-District Gujarat Map**: Clickable district selection displaying soil pH, NPK profiles, water sources, suitable crops, and APMC market yards.
2. **Smart Krishi Advisory**: 3-step dependent workflow (District → Crop → Season) rendering 8 advisory cards (Soil, pH, NPK, Weather, Fertilizer, Water Timing, Diseases, Precautions).
3. **Live Weather Updates**: Humidity, temperature, rainfall, wind speed, and agricultural forecast summaries.
4. **Live Mandi Commodity Rates**: Daily APMC prices filtered by district and commodity.
5. **Government Schemes**: Verified state and central agricultural schemes with official application links.
6. **AI Agriculture Chatbot**: Google Gemini-powered chat supporting English, Gujarati, and Hindi.
7. **Pest & Disease Detection**: Image upload interface with AI health diagnosis and organic remedies.
8. **3-Language i18n Engine**: Seamless translation switching (`en`, `gu`, `hi`) with local storage persistence.
9. **Dark / Light Mode**: Complete theme toggle utilizing CSS custom variables.

---

## Setup & Running Locally

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` communicating with backend API on `http://localhost:5000/api`.

---

## Tech Stack
* React 18 & Vite 6
* React Router v7
* Axios API Client
* Lucide React Icons
* CSS Custom Variables & Responsive Design
