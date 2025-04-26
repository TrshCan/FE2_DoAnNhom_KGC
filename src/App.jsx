import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/loading" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mainhall" element={<MainHall />} />
      <Route path="/loading" element={<LoadingScreen />} />
    </Routes>
  );
};

export default App;

