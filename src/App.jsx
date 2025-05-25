import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';
import Barrack from './pages/Barrack';
import Friend from './pages/Friend';
import HeroCard from './pages/TestCard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClassesManager from './pages/admin/ClassesManager';
import HeroManager from './pages/admin/HeroManager';
import MailManager from './pages/admin/MailManager';
import SundryManager from './pages/admin/SundryManager';
import UserManager from './pages/admin/UserManager';
import EnemySkillManager from './pages/admin/EnemySkillManager';
import EnemyManager from './pages/admin/EnemyManager';
import HeroSkillManager from './pages/admin/HeroSkillManager';
import RegionManager from './pages/admin/RegionManager';
import UserHeroesManager from './pages/admin/UserHeroesManager';
import ItemEffectsManager from './pages/admin/ItemEffectsManager';
import XpAmountsManager from './pages/admin/XpAmountsManager';
import InventoryManager from './pages/admin/InventoryManager';
import LevelRequirementsManager from './pages/admin/LevelRequirementsManager';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`/api/check-session.php`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
        setRole(data.role);
      } catch (err) {
        console.error('Error checking session:', err);
        setIsLoggedIn(false);
        setRole(null);
      }
    };
    checkSession();
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/mainhall" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={localStorage.getItem('token') ? '/loading' : '/login'} replace />} />
      <Route path="/loading" element={<LoadingScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/friend" element={<Friend />} />
      <Route path="/barrack" element={<Barrack />} />
      <Route path="/test" element={<HeroCard />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserManager />} />
        <Route path="user-heroes" element={<UserHeroesManager />} />
        <Route path="classes" element={<ClassesManager />} />
        <Route path="hero-skills" element={<HeroSkillManager />} />
        <Route path="heroes" element={<HeroManager />} />
        <Route path="mails" element={<MailManager />} />
        <Route path="sundries" element={<SundryManager />} />
        <Route path="users" element={<UserManager />} />
        <Route path="enemy-skills" element={<EnemySkillManager />} />
        <Route path="enemies" element={<EnemyManager />} />
        <Route path="regions" element={<RegionManager />} />
        <Route path="item-effects" element={<ItemEffectsManager />} />
        <Route path="xp-amounts" element={<XpAmountsManager />} />
        <Route path="inventory" element={<InventoryManager />} />
        <Route path="level-requirements" element={<LevelRequirementsManager />} />
      </Route>
      <Route
        path="/mainhall"
        element={
          <ProtectedRoute>
            <MainHall />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/loading" replace />} />
    </Routes>
  );
};

export default App;