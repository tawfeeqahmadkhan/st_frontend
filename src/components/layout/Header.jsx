import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'
import { RiShieldUserLine, RiLogoutBoxLine, RiDashboardLine, RiFlashlightLine } from 'react-icons/ri'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Leads', href: '/leads' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [location])

  const handleLogout = () => { logout(); navigate('/') }
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'py-3 bg-white/90 backdrop-blur-2xl border-b border-violet-100 shadow-sm'
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-glow-sm">
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path d="M2 12L8 4L14 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 9L8 6L11 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
          </div>
          <span className="text-ink font-extrabold text-lg tracking-tight">
            Scale<span className="text-violet-600">Studio</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.href}
              className={`nav-link px-4 py-2 rounded-xl hover:bg-violet-50 transition-all duration-200 ${location.pathname === link.href ? 'text-violet-600' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-violet-100 shadow-sm hover:border-violet-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-ink text-xs font-bold leading-none">{user.fullName?.split(' ')[0]}</p>
                  <p className="text-violet-500 text-[10px] mt-0.5 font-semibold capitalize">{user.role}</p>
                </div>
                <HiChevronDown className={`text-ink-3 text-sm transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-violet-100 rounded-2xl shadow-[0_20px_60px_rgba(124,58,237,0.18)] overflow-hidden z-50">
                    <div className="p-3 border-b border-violet-50">
                      <p className="text-ink font-bold text-sm">{user.fullName}</p>
                      <p className="text-ink-3 text-xs mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-violet-50 text-ink-2 hover:text-ink text-sm transition-all">
                        <RiDashboardLine className="text-violet-500" /> Dashboard
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-violet-50 text-ink-2 hover:text-ink text-sm transition-all">
                          <RiShieldUserLine className="text-violet-500" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-ink-2 hover:text-red-600 text-sm transition-all">
                        <RiLogoutBoxLine className="text-base" /> Sign Out
                      </button>
                    </div>
                  </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline-dark px-5 py-2.5 text-sm">Login</Link>
              <Link to="/register" className="btn-primary px-5 py-2.5 text-sm relative overflow-hidden group">
                <span>Join as Designer</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 rounded-xl bg-white border border-violet-100 shadow-sm" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX className="text-ink text-xl" /> : <HiMenu className="text-ink text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
          <div className="md:hidden border-t border-violet-100 bg-white/95 backdrop-blur-xl">
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link key={link.label} to={link.href} className="py-3 px-4 rounded-xl text-ink-2 hover:text-ink hover:bg-violet-50 transition-all text-sm font-semibold">
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-violet-50 mt-2 pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className="py-3 px-4 rounded-xl text-ink-2 hover:bg-violet-50 text-sm font-semibold">Dashboard</Link>
                    <button onClick={handleLogout} className="py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 text-sm font-semibold text-left">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-outline-dark py-3 text-sm text-center">Login</Link>
                    <Link to="/register" className="btn-primary py-3 text-sm text-center">Join as Designer</Link>
                  </>
                )}
              </div>
            </div>
          </div>
      )}
    </header>
  )
}
