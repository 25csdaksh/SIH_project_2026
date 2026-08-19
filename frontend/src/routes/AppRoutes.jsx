import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';

import { HomePage } from '../pages/HomePage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

import { SoilInformationPage } from '../features/soil/pages/SoilInformationPage';
import { SmartKrishiPage } from '../features/smartKrishi/pages/SmartKrishiPage';
import { WeatherPage } from '../features/weather/pages/WeatherPage';
import { MandiPage } from '../features/mandi/pages/MandiPage';
import { GovernmentSchemesPage } from '../features/governmentSchemes/pages/GovernmentSchemesPage';
import { ChatbotPage } from '../features/chatbot/pages/ChatbotPage';
import { PestDetectionPage } from '../features/pestDetection/pages/PestDetectionPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Feature Routes */}
        <Route path="soil" element={<SoilInformationPage />} />
        <Route path="smart-krishi" element={<SmartKrishiPage />} />
        <Route path="weather" element={<WeatherPage />} />
        <Route path="mandi" element={<MandiPage />} />
        <Route path="government-schemes" element={<GovernmentSchemesPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="pest-detection" element={<PestDetectionPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
