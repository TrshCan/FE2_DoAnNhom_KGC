import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';
//admin
import ClassesManager from './pages/admin/ClassesManager';
import HeroSkillManager from './pages/admin/HeroSkillManager';
import HeroManager from './pages/admin/HeroManager';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/mainhall" element={<MainHall />}/>
      <Route path="/register" element={<Register />} />
      <Route path="/loading" element={<LoadingScreen/>} />
      //admin
      <Route path="/admin/classes" element={<ClassesManager />} />
      <Route path="/admin/hero-skills" element={<HeroSkillManager />} />
      <Route path="/admin/heroes" element={<HeroManager />} />
    </Routes>
  );
};

export default App;
