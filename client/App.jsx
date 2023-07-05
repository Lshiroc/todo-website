import { Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home/Home.jsx';
import Dashboard from './src/pages/Dashboard/Dashboard.jsx';
import Login from './src/pages/Login/Login';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;
