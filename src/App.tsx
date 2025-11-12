import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './store/hooks.ts';
import { getUserProfileThunk } from './store/slices/userSlice.ts';

import { AuthGuard } from './components/AuthGuard';
import { WhatsAppConnectionGuard } from './components/WhatsAppConnectionGuard.tsx';

import Login from './features/auth/pages/loginPage';
// import Register from './features/auth/pages/registerPage';
import DashboardLayout from './features/dashboard/dashboardLayout';
import AnalyticsPage from './features/home/pages/analyticsPage.tsx';
import ContactPage from './features/contacts/pages/contactPage';
import AutomationPage from './features/automations/pages/allFlowsPage.tsx';
import ChatsPage from './features/chats/pages/chatsPage.tsx';
import AdvertisePage from './features/advertise/pages/advertisePage.tsx';
import SingleFlowPage from './features/automations/pages/singleFlowPage.tsx';
import MainHomePage from './features/home/pages/mainHomePage.tsx';
import { useEffect } from 'react';

import BroadcastPage from './features/advertise/pages/broadcastPage.tsx';
import TemplatesPage from './features/advertise/pages/templatesPage.tsx';
import CreateTemplatePage from './features/advertise/pages/createTemplates.tsx';
import TemplatePreviewPage from './features/advertise/pages/templatePreviewPage.tsx';
import ProfilePage from './features/user/pages/profile.tsx';
import BroadcastPreviewPage from './features/advertise/pages/broadcastPreviewPage.tsx';
import CreateCampaign from './features/advertise/pages/createCampaign.tsx';

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getUserProfileThunk());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <AuthGuard>
        <WhatsAppConnectionGuard>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/dashboard/home" replace />}
            />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<MainHomePage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="automation" element={<AutomationPage />} />
              <Route path="chats" element={<ChatsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* 🔻 Advertise main page with nested tabs */}
              <Route path="advertise" element={<AdvertisePage />}>
                <Route index element={<Navigate to="broadcast" replace />} />
                <Route path="broadcast">
                  <Route index element={<BroadcastPage />} />
                  <Route
                    path=":id/preview"
                    element={<BroadcastPreviewPage />}
                  />
                </Route>

                <Route path="templates">
                  {/* Templates list page */}
                  <Route index element={<TemplatesPage />} />

                  {/* Template preview page */}
                  <Route path=":id/preview" element={<TemplatePreviewPage />} />
                </Route>
              </Route>
              {/* ✅ Standalone Create Template Page (outside Advertise tab layout) */}
              <Route
                path="advertise/create-template"
                element={<CreateTemplatePage />}
              />
              <Route
                path="advertise/create-campaign"
                element={<CreateCampaign />}
              />
            </Route>

            <Route path="/flows/:flowId" element={<SingleFlowPage />} />
          </Routes>
        </WhatsAppConnectionGuard>
      </AuthGuard>
    </Router>
  );
}

export default App;
