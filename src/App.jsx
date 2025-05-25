import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';
import Barrack from './pages/Barrack';
import Friend from './pages/Friend';
import HeroCard from './pages/TestCard';
import BASE_URL from './components/BaseURL';


const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: đang kiểm tra, true: đã đăng nhập, false: chưa đăng nhập

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`/api/check-session.php`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsLoggedIn(data.loggedIn);
      } catch (err) {
        console.error('Error checking session:', err);
        setIsLoggedIn(false); // Nếu lỗi, coi như chưa đăng nhập
      }
    };
    checkSession();
  }, []);

  // Nếu đang kiểm tra session, hiển thị loading tạm thởi
  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  // Nếu đã đăng nhập, render component con; nếu không, chuyển hướng về /login
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
//admin
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
import UserHeroesManager from './pages/admin/UserHeroesManager';
import ItemEffectsManager from './pages/admin/ItemEffectsManager';
import XpAmountsManager from './pages/admin/XpAmountsManager';
import InventoryManager from './pages/admin/InventoryManager';
import LevelRequirementsManager from './pages/admin/LevelRequirementsManager';



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
      //admin
      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<UserManager />} /> {/* /admin mặc định */}
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
      {/* Add other routes here */}

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
