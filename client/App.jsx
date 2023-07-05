import { Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home/Home.jsx';
import Dashboard from './src/pages/Dashboard/Dashboard.jsx';
import Login from './src/pages/Login/Login';
import Register from './src/pages/Register/Register.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App;
