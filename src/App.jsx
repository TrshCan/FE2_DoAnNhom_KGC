import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoadingScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mainhall" element={<MainHall />} />
    </Routes>
  );
};

export default App;
