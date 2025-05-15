import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';
import Barrack from './pages/Barrack';
import ClassesManager from './pages/admin/ClassesManager';
import HeroManager from './pages/admin/HeroManager';
import MailManager from './pages/admin/MailManager';
import SundryManager from './pages/admin/SundryManager';
import UserManager from './pages/admin/UserManager';
import EnemySkillManager from './pages/admin/EnemySkillManager';
import EnemyManager from './pages/admin/EnemyManager';
import HeroSkillManager from './pages/admin/HeroSkillManager';
import RegionManager from './pages/admin/RegionManager';
import AdminDashboard from './pages/admin/AdminDashboard';


const App = () => {
  return (
    <Routes>
      {/* .<Route path="/" element={<Navigate to="/loading" replace />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mainhall" element={<MainHall />} />
      <Route path="/barrack" element={<Barrack />} />
      <Route path="/loading" element={<LoadingScreen/>} />
      
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<UserManager />} /> {/* /admin mặc định */}
        <Route path="classes" element={<ClassesManager />} />
        <Route path="hero-skills" element={<HeroSkillManager />} />
        <Route path="heroes" element={<HeroManager />} />
        <Route path="mails" element={<MailManager />} />
        <Route path="sundries" element={<SundryManager />} />
        <Route path="users" element={<UserManager />} />
        <Route path="enemy-skills" element={<EnemySkillManager />} />
        <Route path="enemies" element={<EnemyManager />} />
        <Route path="regions" element={<RegionManager />} />
      </Route>
      {/* Add other routes here */}

    </Routes>
  );
};

export default App;

