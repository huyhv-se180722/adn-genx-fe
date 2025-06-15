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
            <Route path="/form" element={<ProtectedRoute> <FormPage /> </ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}
export default App