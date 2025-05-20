import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AuthGuard } from './components/AuthGuard';

import Login from './features/auth/pages/loginPage';
import Register from './features/auth/pages/registerPage';

function App() {
  // const baseURL = import.meta.env.VITE_API_BASE_URL;
  return (
    <Router>
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthGuard>
    </Router>
  );
}

export default App;
