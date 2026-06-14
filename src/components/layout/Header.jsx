import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCMS } from '../../context/CMSContext'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'
import { RiShieldUserLine, RiLogoutBoxLine, RiDashboardLine } from 'react-icons/ri'
import logo from '../../public/logo.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cms } = useCMS()
  const location = useLocation()
  const navigate = useNavigate()

  const header = cms.header

  const navLinks = [
    { label: header.nav1 || 'Home', href: '/' },
    { label: header.nav2 || 'How It Works', href: '/#how-it-works' },
    { label: header.nav3 || 'Pricing', href: '/#pricing' },
    { label: header.nav4 || 'Leads', href: '/leads' },
  ]

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
        ? 'py-3 bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-lg'
        : 'py-5 bg-black/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-15 h-9">
            <img src={logo} alt={`${header.brandName}${header.brandSuffix} logo`} className="w-15 h-9 object-contain rounded-xl" />
          </div>
          {/* <span className="text-white font-extrabold text-lg tracking-tight">
            {header.brandName}<span className="text-violet-400">{header.brandSuffix}</span>
          </span> */}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/10 ${
                location.pathname === link.href ? 'text-violet-400' : 'text-white/80 hover:text-white'
              }`}
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
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-white text-xs font-bold leading-none">{user.fullName?.split(' ')[0]}</p>
                  <p className="text-violet-400 text-[10px] mt-0.5 font-semibold capitalize">{user.role}</p>
                </div>
                <HiChevronDown className={`text-white/60 text-sm transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0f0a1e] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-white font-bold text-sm">{user.fullName}</p>
                    <p className="text-white/40 text-xs mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all">
                      <RiDashboardLine className="text-violet-400" /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all">
                        <RiShieldUserLine className="text-violet-400" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/20 text-white/70 hover:text-red-400 text-sm transition-all">
                      <RiLogoutBoxLine className="text-base" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white/80 border border-white/20 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                {header.loginBtn}
              </Link>
              <Link to="/register" className="btn-primary px-5 py-2.5 text-sm relative overflow-hidden group">
                <span>{header.joinBtn}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 rounded-xl bg-white/10 border border-white/20" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX className="text-white text-xl" /> : <HiMenu className="text-white text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.label} to={link.href} className="py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="py-3 px-4 rounded-xl text-white/70 hover:bg-white/10 text-sm font-semibold">Dashboard</Link>
                  <button onClick={handleLogout} className="py-3 px-4 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-semibold text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-3 text-sm text-center font-bold text-white/80 border border-white/20 rounded-xl hover:bg-white/10">{header.loginBtn}</Link>
                  <Link to="/register" className="btn-primary py-3 text-sm text-center">{header.joinBtn}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
