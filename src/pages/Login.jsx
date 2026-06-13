import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { RiEyeLine, RiEyeOffLine, RiArrowLeftLine, RiFlashlightLine, RiShieldCheckLine } from 'react-icons/ri'
import { HiStar } from 'react-icons/hi'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.fullName?.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white/90 text-sm font-bold mb-8">
            <RiFlashlightLine /> Premium Design Leads
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Grow your design<br />business with<br />verified leads
          </h2>
          <p className="text-violet-200 text-base leading-relaxed mb-10">
            Join 1,200+ designers closing more projects every week with Scale Studio.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[['2,400+','Monthly leads'],['₹45Cr+','Project value'],['4 min','Alert time']].map(([v,l]) => (
              <div key={l} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="text-white font-extrabold text-xl">{v}</p>
                <p className="text-violet-200 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-left backdrop-blur-sm">
            <div className="flex gap-1 mb-3">{[...Array(5)].map((_,i)=><HiStar key={i} className="text-amber-300 text-sm"/>)}</div>
            <p className="text-violet-100 text-sm leading-relaxed">"Scale Studio helped me close ₹45L+ in projects in 6 months. The lead quality is unmatched."</p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/15">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center text-white text-xs font-bold">PK</div>
              <div>
                <p className="text-white text-xs font-bold">Priya Kapoor</p>
                <p className="text-violet-300 text-[10px]">Studio Owner, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 lg:max-w-[480px] flex flex-col justify-center p-8 bg-white">
        <Link to="/" className="flex items-center gap-2 text-ink-3 hover:text-ink text-sm mb-10 transition-colors w-fit">
          <RiArrowLeftLine /> Back to home
        </Link>
        <div style={{ animation: 'heroLeft 0.7s ease both' }}>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 12L8 4L14 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-ink font-extrabold text-xl">Scale<span className="text-violet-600">Studio</span></span>
          </div>
          <h1 className="text-3xl font-extrabold text-ink mb-2 tracking-tight">Welcome back</h1>
          <p className="text-ink-2 text-sm mb-8">Sign in to your designer dashboard.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-ink-3 text-xs font-bold uppercase tracking-wider">Password</label>
                <button type="button" className="text-violet-600 text-xs font-semibold hover:text-violet-700">Forgot password?</button>
              </div>
              <div className="relative">
                <input type={showPw?'text':'password'} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-field pr-12" placeholder="Enter password" required />
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition-colors">
                  {showPw ? <RiEyeOffLine/> : <RiEyeLine/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary py-3.5 mt-2 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-ink-2 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 hover:text-violet-700 font-bold transition-colors">Join as Designer</Link>
          </p>

          <div className="mt-8 p-4 bg-violet-50 border border-violet-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <RiShieldCheckLine className="text-violet-500 text-sm" />
              <p className="text-ink font-bold text-xs">Demo Credentials</p>
            </div>
            <p className="text-ink-2 text-xs">Designer: <span className="font-mono text-violet-700">designer@scalestudio.in</span> / <span className="font-mono text-violet-700">Designer@123</span></p>
            <p className="text-ink-2 text-xs mt-1">Admin: <span className="font-mono text-violet-700">admin@scalestudio.in</span> / <span className="font-mono text-violet-700">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
