import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './pages/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHall from './pages/MainHall';
import Friend from './pages/Friend';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/mainhall" element={<MainHall />}/>
      <Route path="/register" element={<Register />} />
      <Route path="/mainhall" element={<MainHall />} />
      <Route path="/loading" element={<LoadingScreen/>} />
      <Route path="/friend" element={<Friend />} />

    </Routes>
  );
};

export default App;
