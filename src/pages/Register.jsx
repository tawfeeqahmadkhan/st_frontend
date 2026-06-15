import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { RiEyeLine, RiEyeOffLine, RiArrowLeftLine, RiFlashlightLine } from 'react-icons/ri'
import logo from '../public/logo.png'
import leftBg from '../public/left-bg.png'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const user = await register(form.fullName, form.email, form.password)
      toast.success(`Welcome to Scale Studio, ${user.fullName?.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left */}
      <div className="hidden lg:flex lg:max-w-[50%] flex-1 items-center justify-center p-12 relative overflow-hidden">
        <img src={leftBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/85 via-purple-700/80 to-indigo-800/90" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-md text-center flex flex-col items-center">
          <img src={logo} alt="Scale Studio" className="w-28 h-28 object-contain rounded-2xl mb-8" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white/90 text-sm font-bold mb-6">
            <RiFlashlightLine /> Premium Design Leads
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Grow your design<br />business with<br />verified leads
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 lg:max-w-[50%] flex flex-col justify-center p-8 bg-white">
        <Link to="/" className="flex items-center gap-2 text-ink-3 hover:text-ink text-sm mb-8 transition-colors w-fit">
          <RiArrowLeftLine /> Back to home
        </Link>
        <div style={{ animation: 'heroLeft 0.7s ease both' }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 12L8 4L14 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-ink font-extrabold text-xl">Scale<span className="text-violet-600">Studio</span></span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink mb-2 tracking-tight">Create your account</h1>
          <p className="text-ink-2 text-sm mb-8">Join as a designer. Free to sign up.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Full Name</label>
              <input type="text" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} className="input-field" placeholder="Ravi Sharma" required />
            </div>
            <div>
              <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input type={showPw?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-field pr-12" placeholder="Min. 6 characters" required />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink">
                  {showPw ? <RiEyeOffLine/> : <RiEyeLine/>}
                </button>
              </div>
            </div>
            <div>
              <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} className="input-field" placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary py-3.5 mt-2 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : 'Create Account — Free'}
            </button>
          </form>

          <p className="text-center text-ink-3 text-xs mt-4">
            By signing up you agree to our <span className="text-violet-600">Terms</span> and <span className="text-violet-600">Privacy Policy</span>
          </p>
          <p className="text-center text-ink-2 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 hover:text-violet-700 font-bold transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
