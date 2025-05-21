import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SkillListPage from './pages/SkillListPage';
import SkillDetailPage from './pages/SkillDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/skills" element={<SkillListPage />} />
      <Route path="/skills/:id" element={<SkillDetailPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App
