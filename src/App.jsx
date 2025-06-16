import './App.css'
import { AuthProvider } from './Context/AuthContext.jsx'
import Home from './Home.jsx'
import Login from './Login/Login.jsx'
import Register from './Login/Register.jsx'
import Service from './Service/Service.jsx'
import GoogleCallback from './Login/GoogleCallback.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfile from "./Login/CompleteProfile";
import FormPage from './FormADN/FormPage.jsx'
import ProtectedRoute from './Context/PrivateRouter.jsx'
import AdminDashboard from './Admin/AdminDashboard.jsx'
import StaffDashboard from './Staff/RecorderStaffDashboard.jsx'
import LabDashboard from './Lab/LabStaffDashboard.jsx'
import PrivateRouter from './Context/PrivateRouter.jsx'

function App() {
  return (
    <GoogleOAuthProvider clientId="443615178916-5p9djk25jon368lljhovev11s40p19j1.apps.googleusercontent.com">

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/service" element={<Service />} />
            <Route path="/oauth2/callback" element={<GoogleCallback />} />
            <Route path="/completeprofile" element={<CompleteProfile />} />
            <Route path="/form" element={
              <PrivateRouter allowedRole="CUSTOMER">
                <FormPage />
              </PrivateRouter>
            } />

            <Route path="/admin/dashboard" element={
              <PrivateRouter allowedRole="ADMIN">
                <AdminDashboard />
              </PrivateRouter>
            } />
            <Route path="/staff/dashboard" element={
              <PrivateRouter allowedRole="RECORDER_STAFF">
                <StaffDashboard />
              </PrivateRouter>
            } />
            <Route path="/lab/dashboard" element={
              <PrivateRouter allowedRole="LAB_STAFF">
                <LabDashboard />
              </PrivateRouter>
            } />
            <Route path="/unauthorized" element={
              <div style={{ padding: 40, textAlign: "center", color: "red", fontWeight: "bold" }}>
                Bạn không có quyền truy cập trang này.
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
export default App