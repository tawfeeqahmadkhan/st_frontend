import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import LeadCard from '../components/leads/LeadCard'
import { formatDistanceToNow } from 'date-fns'
import {
  RiDashboardLine, RiShoppingBagLine, RiHeartLine, RiUserLine,
  RiHistoryLine, RiCheckLine, RiPhoneLine, RiMailLine, RiMapPin2Line,
  RiTimeLine, RiBuildingLine, RiLockPasswordLine, RiLogoutBoxLine,
  RiArrowRightLine, RiFlashlightLine, RiArrowDownSLine,
} from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'

function PurchasedLeadRow({ lead }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all cursor-pointer ${expanded ? 'border-violet-300 bg-violet-50/30' : 'border-gray-100 hover:border-violet-200'}`}
      onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <RiBuildingLine className="text-violet-600 text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-ink font-bold text-sm truncate">{lead.title}</p>
            <p className="text-ink-2 text-xs">{lead.category} · {lead.location?.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <span className="badge bg-emerald-100 text-emerald-700 border border-emerald-200">
            <RiCheckLine className="text-[10px]" /> Purchased
          </span>
          <RiArrowDownSLine className={`text-ink-3 text-lg transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div style={{ maxHeight: expanded ? '600px' : 0, opacity: expanded ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.25s ease' }} className="border-t border-violet-100">
        {expanded && (
            <div className="p-4 grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-ink-3 text-[10px] font-bold uppercase tracking-wider mb-2">Client Details</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                    <span className="text-violet-700 text-xs font-bold">{lead.clientName?.[0]}</span>
                  </div>
                  <p className="text-ink font-bold text-sm">{lead.clientName}</p>
                </div>
                <div className="flex items-center gap-2 text-ink-2 text-sm mb-1">
                  <RiPhoneLine className="text-violet-500" /> {lead.clientPhone}
                </div>
                {lead.clientEmail && (
                  <div className="flex items-center gap-2 text-ink-2 text-sm">
                    <RiMailLine className="text-violet-500" /> {lead.clientEmail}
                  </div>
                )}
              </div>
              <div>
                <p className="text-ink-3 text-[10px] font-bold uppercase tracking-wider mb-2">Project Info</p>
                <div className="flex items-center gap-2 text-ink-2 text-sm mb-1">
                  <RiMapPin2Line className="text-violet-500" /> {lead.location?.city}{lead.location?.area ? `, ${lead.location.area}` : ''}
                </div>
                <div className="flex items-center gap-2 text-ink-2 text-sm mb-2">
                  <span className="text-violet-500 text-xs font-bold">₹</span>
                  {(lead.budget?.min / 100000).toFixed(0)}L – {(lead.budget?.max / 100000).toFixed(0)}L budget
                </div>
                {lead.projectDescription && <p className="text-ink-2 text-xs leading-relaxed">{lead.projectDescription}</p>}
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [purchasedLeads, setPurchasedLeads] = useState([])
  const [wishlistLeads, setWishlistLeads] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({})
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) setProfileForm({ fullName: user.fullName || '', phone: user.phone || '', city: user.city || '', bio: user.bio || '' })
  }, [user])

  useEffect(() => {
    if (activeTab === 'purchased') fetchPurchased()
    if (activeTab === 'wishlist') fetchWishlist()
    if (activeTab === 'history') fetchHistory()
  }, [activeTab])

  const fetchPurchased = async () => { setLoading(true); try { const r = await api.get('/purchases/my/purchased'); setPurchasedLeads(r.data) } catch {} finally { setLoading(false) } }
  const fetchWishlist = async () => { setLoading(true); try { const r = await api.get('/leads/user/wishlist'); setWishlistLeads(r.data) } catch {} finally { setLoading(false) } }
  const fetchHistory = async () => { setLoading(true); try { const r = await api.get('/purchases/my/history'); setHistory(r.data) } catch {} finally { setLoading(false) } }

  const updateProfile = async (e) => {
    e.preventDefault()
    try { await api.put('/auth/profile', profileForm); await refreshUser(); toast.success('Profile updated!') }
    catch { toast.error('Failed to update profile') }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords don't match"); return }
    try { await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }); toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const navItems = [
    { id: 'overview', label: 'Overview', icon: RiDashboardLine },
    { id: 'purchased', label: 'My Leads', icon: RiShoppingBagLine },
    { id: 'wishlist', label: 'Wishlist', icon: RiHeartLine },
    { id: 'profile', label: 'Profile', icon: RiUserLine },
    { id: 'history', label: 'History', icon: RiHistoryLine },
  ]

  const Loader = () => (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white border border-violet-100 rounded-2xl p-4 sticky top-24 shadow-card">
              <div className="flex items-center gap-3 p-3 mb-4 border-b border-violet-50 pb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-ink font-bold text-sm truncate">{user?.fullName}</p>
                  <p className="text-violet-600 text-xs font-semibold capitalize">{user?.role}</p>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}>
                    <item.icon className="text-base flex-shrink-0" />{item.label}
                  </button>
                ))}
                <div className="h-px bg-violet-50 my-2" />
                <Link to="/leads" className="sidebar-link">
                  <RiFlashlightLine className="text-base flex-shrink-0" />Browse Leads
                </Link>
                <button onClick={() => { logout(); navigate('/') }} className="sidebar-link text-red-400 hover:text-red-600 hover:bg-red-50">
                  <RiLogoutBoxLine className="text-base flex-shrink-0" />Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div key={activeTab} style={{ animation: 'fadeIn 0.25s ease both' }}>

                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                  <div className="flex flex-col gap-6">
                    <div>
                      <h1 className="text-2xl font-extrabold text-ink">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
                      <p className="text-ink-2 text-sm mt-1">Your Scale Studio designer dashboard.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { label: 'Leads Purchased', value: user?.purchasedLeads?.length || 0, icon: RiShoppingBagLine, color: 'text-violet-600', bg: 'bg-violet-100', tab: 'purchased' },
                        { label: 'Wishlisted', value: user?.wishlist?.length || 0, icon: RiHeartLine, color: 'text-pink-600', bg: 'bg-pink-100', tab: 'wishlist' },
                        { label: 'Transactions', value: history.length, icon: RiHistoryLine, color: 'text-blue-600', bg: 'bg-blue-100', tab: 'history' },
                      ].map(card => (
                        <button key={card.label} onClick={() => setActiveTab(card.tab)} className="stat-card text-left">
                          <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                            <card.icon className={`text-xl ${card.color}`} />
                          </div>
                          <p className="text-ink font-extrabold text-2xl">{card.value}</p>
                          <p className="text-ink-3 text-xs mt-1">{card.label}</p>
                        </button>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <button onClick={() => setActiveTab('purchased')} className="glass-card rounded-2xl p-5 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                          <RiShoppingBagLine className="text-violet-600 text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-ink font-bold">My Purchased Leads</p>
                          <p className="text-ink-2 text-xs">{user?.purchasedLeads?.length || 0} leads — view client details</p>
                        </div>
                        <RiArrowRightLine className="text-ink-3" />
                      </button>
                      <Link to="/leads" className="glass-card rounded-2xl p-5 flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <RiFlashlightLine className="text-amber-600 text-xl" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-ink font-bold">Browse Leads</p>
                          <p className="text-ink-2 text-xs">Explore 2,400+ verified leads</p>
                        </div>
                        <RiArrowRightLine className="text-ink-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* ── PURCHASED ── */}
                {activeTab === 'purchased' && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-ink mb-6">My Purchased Leads</h2>
                    {loading ? <Loader /> : purchasedLeads.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4">
                          <RiShoppingBagLine className="text-violet-300 text-2xl" />
                        </div>
                        <h3 className="text-ink-2 font-bold mb-2">No purchased leads yet</h3>
                        <p className="text-ink-3 text-sm mb-6">Browse the marketplace and buy your first lead.</p>
                        <Link to="/leads" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
                          <span>Browse Leads</span><RiArrowRightLine />
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {purchasedLeads.map(lead => <PurchasedLeadRow key={lead._id} lead={lead} />)}
                      </div>
                    )}
                  </div>
                )}

                {/* ── WISHLIST ── */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-ink mb-6">My Wishlist</h2>
                    {loading ? <Loader /> : wishlistLeads.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto mb-4">
                          <RiHeartLine className="text-pink-300 text-2xl" />
                        </div>
                        <h3 className="text-ink-2 font-bold mb-2">Your wishlist is empty</h3>
                        <p className="text-ink-3 text-sm mb-6">Heart a lead on the marketplace to save it here.</p>
                        <Link to="/leads" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm"><span>Browse Leads</span></Link>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-5">
                        {wishlistLeads.map(lead => (
                          <LeadCard key={lead._id} lead={lead} wishlisted={true}
                            purchased={user?.purchasedLeads?.some(p => (p._id || p) === lead._id)}
                            onPurchase={() => fetchWishlist()}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── PROFILE ── */}
                {activeTab === 'profile' && (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-extrabold text-ink">Profile Settings</h2>

                    <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-card">
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-violet-50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-ink font-extrabold text-lg">{user?.fullName}</p>
                          <p className="text-ink-2 text-sm">{user?.email}</p>
                          <span className="badge bg-violet-100 text-violet-700 border border-violet-200 mt-1.5">{user?.role === 'admin' ? 'Admin' : 'Designer'}</span>
                        </div>
                      </div>
                      <form onSubmit={updateProfile} className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Full Name</label><input type="text" value={profileForm.fullName || ''} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} className="input-field" /></div>
                        <div><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Phone</label><input type="text" value={profileForm.phone || ''} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" placeholder="+91 98765 43210" /></div>
                        <div><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">City</label><input type="text" value={profileForm.city || ''} onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} className="input-field" placeholder="Mumbai" /></div>
                        <div className="sm:col-span-2"><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Bio</label><textarea value={profileForm.bio || ''} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} className="input-field resize-none h-24" placeholder="Tell clients about your expertise..." /></div>
                        <div className="sm:col-span-2"><button type="submit" className="btn-primary px-6 py-2.5 text-sm">Save Changes</button></div>
                      </form>
                    </div>

                    <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-card">
                      <h3 className="text-ink font-bold mb-5 flex items-center gap-2">
                        <RiLockPasswordLine className="text-violet-500" /> Change Password
                      </h3>
                      <form onSubmit={changePassword} className="flex flex-col gap-4 max-w-md">
                        <div><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Current Password</label><input type="password" value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="input-field" required /></div>
                        <div><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">New Password</label><input type="password" value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} className="input-field" required /></div>
                        <div><label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Confirm New Password</label><input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} className="input-field" required /></div>
                        <button type="submit" className="btn-primary px-6 py-2.5 text-sm w-fit">Update Password</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ── HISTORY ── */}
                {activeTab === 'history' && (
                  <div>
                    <h2 className="text-2xl font-extrabold text-ink mb-6">Purchase History</h2>
                    {loading ? <Loader /> : history.length === 0 ? (
                      <div className="text-center py-16 text-ink-3 text-sm">No transactions yet</div>
                    ) : (
                      <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-card">
                        <div className="divide-y divide-violet-50">
                          {history.map(tx => (
                            <div key={tx._id} className="flex items-center justify-between p-4 hover:bg-violet-50/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                                  <RiShoppingBagLine className="text-violet-600 text-sm" />
                                </div>
                                <div>
                                  <p className="text-ink text-sm font-semibold">{tx.lead?.title}</p>
                                  <p className="text-ink-3 text-xs">{tx.lead?.category} · {tx.lead?.location?.city} · {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-ink font-bold">₹{tx.amount}</p>
                                <span className="badge bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px]">{tx.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
