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
import BroadcastPage from './features/advertise/pages/broadcastPage.tsx';
import TemplatesPage from './features/advertise/pages/templatesPage.tsx';
import CreateTemplatePage from './features/advertise/pages/createTemplates.tsx';

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

            {/* 🔻 Advertise main page with nested tabs */}
            <Route path="advertise" element={<AdvertisePage />}>
              <Route index element={<Navigate to="broadcast" replace />} />
              <Route path="broadcast" element={<BroadcastPage />} />
              <Route path="templates" element={<TemplatesPage />} />
            </Route>

            {/* ✅ Standalone Create Template Page (outside Advertise tab layout) */}
            <Route
              path="advertise/create-template"
              element={<CreateTemplatePage />}
            />
          </Route>

          <Route path="/flows/:flowId" element={<SingleFlowPage />} />
        </Routes>
      </AuthGuard>
    </Router>
  );
}

export default App;
