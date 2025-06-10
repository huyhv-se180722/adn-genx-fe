import './App.css'
import Home from './Home.jsx'
import Login from './Login/Login.jsx'
import Register from './Login/Register.jsx'
import Service from './Service/Service.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/service" element={<Service />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App