import { Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home/Home.jsx';
import Login from './src/pages/Login/Login';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;
