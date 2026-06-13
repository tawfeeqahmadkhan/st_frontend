import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine, RiAddCircleLine, RiListCheck, RiGroupLine,
  RiShoppingBagLine, RiLogoutBoxLine, RiEditLine, RiDeleteBinLine,
  RiToggleLine, RiCheckLine, RiStarLine, RiCloseLine, RiArrowLeftLine,
  RiFlashlightLine,
} from 'react-icons/ri'

const CATEGORIES = ['Full Home Interior','Modular Kitchen','Office & Commercial','Bedroom & Wardrobe','Living Room','Restaurant & Hospitality','Retail Store','3D Visualization','Renovation','Landscape & Exterior']
const STATES = ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Telangana','Gujarat','Rajasthan','West Bengal','Kerala','Punjab','Goa','Madhya Pradesh']
const INIT = { title:'',category:'Full Home Interior',projectDescription:'',propertySize:'',budget:{min:'',max:''},location:{city:'',state:'',area:''},clientName:'',clientPhone:'',clientEmail:'',price:'',isFeatured:false }

export default function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [leads, setLeads] = useState([])
  const [users, setUsers] = useState([])
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchStats() }, [])
  useEffect(() => {
    if (tab==='leads') fetchLeads()
    if (tab==='users') fetchUsers()
    if (tab==='purchases') fetchPurchases()
  }, [tab])

  const fetchStats = async () => { try { const r=await api.get('/admin/stats'); setStats(r.data) } catch {} }
  const fetchLeads = async () => { setLoading(true); try{const r=await api.get('/admin/leads');setLeads(r.data)}catch{}finally{setLoading(false)} }
  const fetchUsers = async () => { setLoading(true); try{const r=await api.get('/admin/users');setUsers(r.data)}catch{}finally{setLoading(false)} }
  const fetchPurchases = async () => { setLoading(true); try{const r=await api.get('/admin/purchases');setPurchases(r.data)}catch{}finally{setLoading(false)} }

  const openAdd = () => { setEditing(null); setForm(INIT); setShowForm(true) }
  const openEdit = (lead) => {
    setEditing(lead)
    setForm({ title:lead.title,category:lead.category,projectDescription:lead.projectDescription||'',propertySize:lead.propertySize||'',budget:{min:lead.budget?.min,max:lead.budget?.max},location:{city:lead.location?.city,state:lead.location?.state||'',area:lead.location?.area||''},clientName:lead.clientName,clientPhone:lead.clientPhone,clientEmail:lead.clientEmail||'',price:lead.price,isFeatured:lead.isFeatured||false })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      const payload = { ...form, budget:{min:Number(form.budget.min),max:Number(form.budget.max)}, price:Number(form.price) }
      if (editing) { await api.put(`/admin/leads/${editing._id}`,payload); toast.success('Lead updated!') }
      else { await api.post('/admin/leads',payload); toast.success('Lead added!') }
      setShowForm(false); fetchLeads(); fetchStats()
    } catch(err){toast.error(err.response?.data?.message||'Failed')}
    finally{setSubmitting(false)}
  }

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return
    try{await api.delete(`/admin/leads/${id}`);setLeads(p=>p.filter(l=>l._id!==id));toast.success('Deleted');fetchStats()}catch{toast.error('Failed')}
  }
  const toggleLead = async (id) => {
    try{const r=await api.patch(`/admin/leads/${id}/toggle`);setLeads(p=>p.map(l=>l._id===id?r.data:l));toast.success(r.data.isActive?'Activated':'Deactivated')}catch{toast.error('Failed')}
  }

  const nav = [
    { id:'dashboard', label:'Dashboard', icon:RiDashboardLine },
    { id:'leads', label:'Manage Leads', icon:RiListCheck },
    { id:'users', label:'Designers', icon:RiGroupLine },
    { id:'purchases', label:'Purchases', icon:RiShoppingBagLine },
  ]

  const Loader = () => <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"/></div>

  const TH = ({children}) => <th className="text-left px-4 py-3 text-ink-3 text-xs font-bold uppercase tracking-wider">{children}</th>
  const TD = ({children, className=''}) => <td className={`px-4 py-3 ${className}`}>{children}</td>

  return (
    <div className="min-h-screen bg-page flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-violet-100 flex flex-col shadow-sm">
        <div className="p-5 border-b border-violet-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L8 4L14 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className="text-ink font-extrabold text-sm">Scale<span className="text-violet-600">Studio</span></p>
              <p className="text-ink-3 text-[10px] font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {nav.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`sidebar-link ${tab===item.id?'active':''}`}>
              <item.icon className="text-base" />{item.label}
            </button>
          ))}
          <div className="h-px bg-violet-50 my-2" />
          <button onClick={openAdd} className="sidebar-link text-violet-600 hover:bg-violet-50">
            <RiAddCircleLine className="text-base" />Add New Lead
          </button>
          <Link to="/" className="sidebar-link"><RiArrowLeftLine className="text-base" />View Site</Link>
        </nav>

        <div className="p-4 border-t border-violet-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.fullName?.[0]}
            </div>
            <div>
              <p className="text-ink text-xs font-bold">{user?.fullName}</p>
              <p className="text-violet-600 text-[10px] font-semibold">Administrator</p>
            </div>
          </div>
          <button onClick={()=>{logout();navigate('/')}} className="sidebar-link text-red-400 hover:text-red-600 hover:bg-red-50 w-full">
            <RiLogoutBoxLine />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto bg-page">
        <div className="p-8">
          <div key={tab} style={{ animation: 'fadeIn 0.2s ease both' }}>

              {/* DASHBOARD */}
              {tab==='dashboard' && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold text-ink">Admin Dashboard</h1>
                      <p className="text-ink-2 text-sm mt-1">Scale Studio platform overview</p>
                    </div>
                    <button onClick={openAdd} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
                      <RiAddCircleLine/><span>Add Lead</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      {label:'Total Leads',value:stats.totalLeads||0,icon:RiListCheck,color:'text-violet-600',bg:'bg-violet-100'},
                      {label:'Active Leads',value:stats.activeLeads||0,icon:RiFlashlightLine,color:'text-emerald-600',bg:'bg-emerald-100'},
                      {label:'Designers',value:stats.totalUsers||0,icon:RiGroupLine,color:'text-blue-600',bg:'bg-blue-100'},
                      {label:'Purchases',value:stats.totalPurchases||0,icon:RiShoppingBagLine,color:'text-amber-600',bg:'bg-amber-100'},
                      {label:'Revenue',value:`₹${(stats.totalRevenue||0).toLocaleString()}`,icon:RiStarLine,color:'text-pink-600',bg:'bg-pink-100'},
                    ].map(c=>(
                      <div key={c.label} className="stat-card">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}><c.icon className={`text-xl ${c.color}`}/></div>
                        <p className="text-ink font-extrabold text-2xl">{c.value}</p>
                        <p className="text-ink-3 text-xs mt-1">{c.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-violet-100 rounded-2xl p-6 shadow-card">
                    <h3 className="text-ink font-bold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={openAdd} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"><RiAddCircleLine/><span>Add New Lead</span></button>
                      <button onClick={()=>setTab('leads')} className="btn-ghost px-5 py-2.5 text-sm">View All Leads</button>
                      <button onClick={()=>setTab('users')} className="btn-ghost px-5 py-2.5 text-sm">View Designers</button>
                    </div>
                  </div>
                </div>
              )}

              {/* LEADS */}
              {tab==='leads' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-ink">Manage Leads</h2>
                      <p className="text-ink-2 text-sm">{leads.length} total leads</p>
                    </div>
                    <button onClick={openAdd} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"><RiAddCircleLine/><span>Add Lead</span></button>
                  </div>
                  {loading ? <Loader/> : (
                    <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-card">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-violet-50">{['Title','Category','Location','Budget','Price','Status','Actions'].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                          <tbody>
                            {leads.map(lead=>(
                              <tr key={lead._id} className="border-b border-violet-50 hover:bg-violet-50/30 transition-colors">
                                <TD><p className="text-ink text-sm font-semibold">{lead.title}</p><p className="text-ink-3 text-xs">{lead.clientName}</p></TD>
                                <TD><span className="badge bg-violet-100 text-violet-700 border border-violet-200 text-[11px]">{lead.category}</span></TD>
                                <TD className="text-ink-2 text-sm">{lead.location?.city}</TD>
                                <TD className="text-ink-2 text-sm">₹{(lead.budget?.min/100000).toFixed(0)}L–{(lead.budget?.max/100000).toFixed(0)}L</TD>
                                <TD className="text-ink font-bold text-sm">₹{lead.price}</TD>
                                <TD><span className={`badge border text-xs ${lead.isActive?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-red-100 text-red-600 border-red-200'}`}>{lead.isActive?'Active':'Inactive'}</span></TD>
                                <TD>
                                  <div className="flex items-center gap-2">
                                    <button onClick={()=>openEdit(lead)} className="w-7 h-7 rounded-lg hover:bg-blue-100 text-ink-3 hover:text-blue-600 flex items-center justify-center transition-all"><RiEditLine className="text-sm"/></button>
                                    <button onClick={()=>toggleLead(lead._id)} className="w-7 h-7 rounded-lg hover:bg-amber-100 text-ink-3 hover:text-amber-600 flex items-center justify-center transition-all"><RiToggleLine className="text-sm"/></button>
                                    <button onClick={()=>deleteLead(lead._id)} className="w-7 h-7 rounded-lg hover:bg-red-100 text-ink-3 hover:text-red-600 flex items-center justify-center transition-all"><RiDeleteBinLine className="text-sm"/></button>
                                  </div>
                                </TD>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* USERS */}
              {tab==='users' && (
                <div>
                  <div className="mb-6"><h2 className="text-2xl font-extrabold text-ink">Registered Designers</h2><p className="text-ink-2 text-sm">{users.length} designers</p></div>
                  {loading ? <Loader/> : (
                    <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-card">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-violet-50">{['Designer','Email','Leads Bought','Joined','Status'].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                          <tbody>
                            {users.map(u=>(
                              <tr key={u._id} className="border-b border-violet-50 hover:bg-violet-50/30 transition-colors">
                                <TD>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">{u.fullName?.[0]}</div>
                                    <p className="text-ink text-sm font-semibold">{u.fullName}</p>
                                  </div>
                                </TD>
                                <TD className="text-ink-2 text-sm">{u.email}</TD>
                                <TD className="text-ink text-sm font-bold">{u.purchasedLeads?.length||0}</TD>
                                <TD className="text-ink-3 text-sm">{formatDistanceToNow(new Date(u.createdAt),{addSuffix:true})}</TD>
                                <TD><span className={`badge border ${u.isActive?'bg-emerald-100 text-emerald-700 border-emerald-200':'bg-red-100 text-red-600 border-red-200'}`}>{u.isActive?'Active':'Inactive'}</span></TD>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PURCHASES */}
              {tab==='purchases' && (
                <div>
                  <div className="mb-6"><h2 className="text-2xl font-extrabold text-ink">All Purchases</h2><p className="text-ink-2 text-sm">{purchases.length} transactions</p></div>
                  {loading ? <Loader/> : (
                    <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-card">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-violet-50">{['Designer','Lead','Amount','Transaction ID','Date','Status'].map(h=><TH key={h}>{h}</TH>)}</tr></thead>
                          <tbody>
                            {purchases.map(p=>(
                              <tr key={p._id} className="border-b border-violet-50 hover:bg-violet-50/30">
                                <TD className="text-ink text-sm font-semibold">{p.user?.fullName}</TD>
                                <TD><p className="text-ink text-sm">{p.lead?.title}</p><p className="text-ink-3 text-xs">{p.lead?.location?.city}</p></TD>
                                <TD className="text-ink font-bold">₹{p.amount}</TD>
                                <TD className="text-ink-3 text-xs font-mono">{p.transactionId}</TD>
                                <TD className="text-ink-3 text-sm">{formatDistanceToNow(new Date(p.createdAt),{addSuffix:true})}</TD>
                                <TD><span className="badge bg-emerald-100 text-emerald-700 border border-emerald-200">{p.status}</span></TD>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

          </div>
        </div>
      </main>

      {/* Lead Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          style={{ animation: 'fadeIn 0.2s ease both' }}
          onClick={e=>e.target===e.currentTarget&&setShowForm(false)}
        >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-violet-100 rounded-2xl shadow-[0_30px_80px_rgba(124,58,237,0.25)]">
              <div className="flex items-center justify-between p-5 border-b border-violet-50 sticky top-0 bg-white z-10">
                <h2 className="text-ink font-extrabold text-lg">{editing?'Edit Lead':'Add New Lead'}</h2>
                <button onClick={()=>setShowForm(false)} className="w-8 h-8 rounded-xl hover:bg-violet-50 flex items-center justify-center text-ink-3 hover:text-ink transition-all">
                  <RiCloseLine className="text-lg"/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Title *</label>
                    <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="input-field" placeholder="4BHK Full Home Interior" required/>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Category *</label>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-field">
                      {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Property Size</label>
                    <input type="text" value={form.propertySize} onChange={e=>setForm({...form,propertySize:e.target.value})} className="input-field" placeholder="2800 sq ft"/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Description</label>
                    <textarea value={form.projectDescription} onChange={e=>setForm({...form,projectDescription:e.target.value})} className="input-field resize-none h-20" placeholder="Brief project description..."/>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Budget Min (₹) *</label>
                    <input type="number" value={form.budget.min} onChange={e=>setForm({...form,budget:{...form.budget,min:e.target.value}})} className="input-field" placeholder="500000" required/>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Budget Max (₹) *</label>
                    <input type="number" value={form.budget.max} onChange={e=>setForm({...form,budget:{...form.budget,max:e.target.value}})} className="input-field" placeholder="800000" required/>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Lead Price (₹) *</label>
                    <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="input-field" placeholder="499" required/>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">City *</label>
                    <input type="text" value={form.location.city} onChange={e=>setForm({...form,location:{...form.location,city:e.target.value}})} className="input-field" placeholder="Mumbai" required/>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">State</label>
                    <select value={form.location.state} onChange={e=>setForm({...form,location:{...form.location,state:e.target.value}})} className="input-field">
                      <option value="">Select state</option>
                      {STATES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Area/Locality</label>
                    <input type="text" value={form.location.area} onChange={e=>setForm({...form,location:{...form.location,area:e.target.value}})} className="input-field" placeholder="Bandra West"/>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Client Name *</label>
                    <input type="text" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} className="input-field" placeholder="Full name" required/>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Phone *</label>
                    <input type="text" value={form.clientPhone} onChange={e=>setForm({...form,clientPhone:e.target.value})} className="input-field" placeholder="+91 98765 43210" required/>
                  </div>
                  <div>
                    <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-2">Email</label>
                    <input type="email" value={form.clientEmail} onChange={e=>setForm({...form,clientEmail:e.target.value})} className="input-field" placeholder="client@email.com"/>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={()=>setForm({...form,isFeatured:!form.isFeatured})}
                    className={`w-10 h-6 rounded-full transition-all ${form.isFeatured?'bg-amber-500':'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform shadow-sm ${form.isFeatured?'translate-x-4':''}`}/>
                  </button>
                  <span className="text-ink-2 text-sm font-medium">Mark as Featured</span>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-violet-50">
                  <button type="submit" disabled={submitting} className="btn-primary px-6 py-3 flex items-center gap-2 disabled:opacity-60 text-sm">
                    {submitting?<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>:<RiCheckLine/>}
                    <span>{editing?'Update Lead':'Add Lead'}</span>
                  </button>
                  <button type="button" onClick={()=>setShowForm(false)} className="btn-ghost px-6 py-3 text-sm">Cancel</button>
                </div>
              </form>
            </div>
        </div>
      )}
    </div>
  )
}
