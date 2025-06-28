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
import ContactPage from './features/contacts/pages/contactPage';
import AutomationPage from './features/automations/pages/allFlowsPage.tsx';
import ChatsPage from './features/chats/pages/chatsPage.tsx';
import AdvertisePage from './features/advertise/pages/advertisePage.tsx';
import SingleFlowPage from './features/automations/pages/singleFlowPage.tsx';

function App() {
  return (
    <Router>
      <AuthGuard>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="advertise" element={<AdvertisePage />} />
          </Route>
          <Route path="/flows/:flowId" element={<SingleFlowPage />}></Route>
        </Routes>
      </AuthGuard>
    </Router>
  );
}

export default App;
