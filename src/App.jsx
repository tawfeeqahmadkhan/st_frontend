import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CMSProvider } from './context/CMSContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Leads from './pages/Leads'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function AppRoutes() {
  const location = useLocation()
  const isAuth = location.pathname === '/login' || location.pathname === '/register'
  const isAdmin = location.pathname.startsWith('/admin')
  const noLayout = isAuth || isAdmin

  return (
    <div className="min-h-screen bg-page">
      <div className="relative z-10">
        {!noLayout && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
        </Routes>
        {!noLayout && <Footer />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CMSProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#0f0a1e',
              border: '1.5px solid rgba(124,58,237,0.2)',
              borderRadius: '14px',
              fontSize: '13px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 10px 40px rgba(124,58,237,0.15)',
            },
            success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
        </CMSProvider>
      </AuthProvider>
    </Router>
  )
}
