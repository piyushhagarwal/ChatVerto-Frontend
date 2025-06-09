import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { AuthGuard } from './components/AuthGuard';

import Login from './features/auth/pages/loginPage';
import Register from './features/auth/pages/registerPage';
import DashboardLayout from './features/dashboard/dashboardLayout';
import HomePage from './features/home/pages/homePage';

function App() {
  // const baseURL = import.meta.env.VITE_API_BASE_URL;
  return (
    <Router>
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomePage />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        </Routes>
      </AuthGuard>
    </Router>
  );
}

export default App;
