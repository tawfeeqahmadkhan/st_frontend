import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCMS, DEFAULT_CMS, DEFAULT_LEAD_VISIBILITY } from '../context/CMSContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../public/logo.png'
import {
  RiDashboardLine, RiAddCircleLine, RiListCheck, RiGroupLine,
  RiShoppingBagLine, RiLogoutBoxLine, RiEditLine, RiDeleteBinLine,
  RiToggleLine, RiCheckLine, RiStarLine, RiCloseLine, RiArrowLeftLine,
  RiFlashlightLine, RiFileTextLine, RiEyeLine,
} from 'react-icons/ri'

const CATEGORIES = ['Full Home Interior','Modular Kitchen','Office & Commercial','Bedroom & Wardrobe','Living Room','Restaurant & Hospitality','Retail Store','3D Visualization','Renovation','Landscape & Exterior']
const STATES = ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Telangana','Gujarat','Rajasthan','West Bengal','Kerala','Punjab','Goa','Madhya Pradesh']
const INIT = { title:'',category:'Full Home Interior',projectDescription:'',propertySize:'',budget:{min:'',max:''},location:{city:'',state:'',area:''},clientName:'',clientPhone:'',clientEmail:'',price:'',isFeatured:false }

const VISIBILITY_FIELDS = [
  { key: 'category', label: 'Category' },
  { key: 'title', label: 'Title' },
  { key: 'projectDescription', label: 'Project Description' },
  { key: 'propertySize', label: 'Property Size' },
  { key: 'budget', label: 'Budget Range' },
  { key: 'city', label: 'City' },
  { key: 'area', label: 'Area / Locality' },
  { key: 'postedAt', label: 'Posted Time' },
  { key: 'price', label: 'Lead Price' },
  { key: 'clientName', label: 'Client Name' },
  { key: 'clientPhone', label: 'Client Phone' },
  { key: 'clientEmail', label: 'Client Email' },
]

const CMS_SECTIONS = [
  { key: 'header', label: 'Header & Navigation' },
  { key: 'hero', label: 'Hero Section' },
  { key: 'stats', label: 'Stats Bar' },
  { key: 'howItWorks', label: 'How It Works' },
  { key: 'whyUs', label: 'Why Scale Studio' },
  { key: 'pricing', label: 'Pricing Section' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'faq', label: 'FAQ' },
  { key: 'ctaSection', label: 'CTA Section' },
  { key: 'footer', label: 'Footer' },
]

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

  // CMS state
  const { cms, visibility, updateCMS, updateVisibility } = useCMS()
  const [cmsLocal, setCmsLocal] = useState(null)
  const [cmsSection, setCmsSection] = useState('header')
  const [cmsSaving, setCmsSaving] = useState(false)

  // Visibility state
  const [visLocal, setVisLocal] = useState(null)
  const [visSaving, setVisSaving] = useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { fetchStats() }, [])
  useEffect(() => {
    if (tab==='leads') fetchLeads()
    if (tab==='users') fetchUsers()
    if (tab==='purchases') fetchPurchases()
    if (tab==='content') setCmsLocal(JSON.parse(JSON.stringify(cms)))
    if (tab==='visibility') setVisLocal(JSON.parse(JSON.stringify(visibility)))
  }, [tab])

  // Sync local copies when global changes
  useEffect(() => { if (tab==='content') setCmsLocal(JSON.parse(JSON.stringify(cms))) }, [cms])
  useEffect(() => { if (tab==='visibility') setVisLocal(JSON.parse(JSON.stringify(visibility))) }, [visibility])

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

  const saveCMS = async () => {
    setCmsSaving(true)
    try {
      await updateCMS(cmsLocal)
      toast.success('Content saved!')
    } catch { toast.error('Failed to save') }
    finally { setCmsSaving(false) }
  }

  const saveVisibility = async () => {
    setVisSaving(true)
    try {
      await updateVisibility(visLocal)
      toast.success('Visibility settings saved!')
    } catch { toast.error('Failed to save') }
    finally { setVisSaving(false) }
  }

  const updateCmsField = (section, field, value) => {
    setCmsLocal(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }))
  }

  const updateCmsArrayItem = (section, arrayKey, idx, field, value) => {
    setCmsLocal(prev => {
      const arr = [...(prev[section][arrayKey] || [])]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...prev, [section]: { ...prev[section], [arrayKey]: arr } }
    })
  }

  const updateCmsDirectArray = (section, idx, field, value) => {
    setCmsLocal(prev => {
      const arr = [...(prev[section] || [])]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...prev, [section]: arr }
    })
  }

  const toggleVisField = (level, field) => {
    setVisLocal(prev => ({
      ...prev,
      [level]: { ...prev[level], [field]: !prev[level][field] }
    }))
  }

  const nav = [
    { id:'dashboard', label:'Dashboard', icon:RiDashboardLine },
    { id:'leads', label:'Manage Leads', icon:RiListCheck },
    { id:'users', label:'Designers', icon:RiGroupLine },
    { id:'purchases', label:'Purchases', icon:RiShoppingBagLine },
    { id:'content', label:'Site Content', icon:RiFileTextLine },
    { id:'visibility', label:'Lead Visibility', icon:RiEyeLine },
  ]

  const Loader = () => <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"/></div>
  const TH = ({children}) => <th className="text-left px-4 py-3 text-ink-3 text-xs font-bold uppercase tracking-wider">{children}</th>
  const TD = ({children, className=''}) => <td className={`px-4 py-3 ${className}`}>{children}</td>

  const InputField = ({ label, value, onChange, multiline = false, placeholder = '' }) => (
    <div>
      <label className="text-ink-3 text-xs font-bold uppercase tracking-wider block mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="input-field resize-none h-20 text-sm"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="input-field text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-page flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-violet-100 flex flex-col shadow-sm">
        <div className="p-5 border-b border-violet-50">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ScaleStudio logo" className="w-8 h-8 object-contain rounded-xl" />
            <div>
              <p className="text-ink font-extrabold text-sm">Scale<span className="text-violet-600">Studio</span></p>
              <p className="text-ink-3 text-[10px] font-semibold">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
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
                    <button onClick={()=>setTab('content')} className="btn-ghost px-5 py-2.5 text-sm flex items-center gap-2"><RiFileTextLine/>Edit Site Content</button>
                    <button onClick={()=>setTab('visibility')} className="btn-ghost px-5 py-2.5 text-sm flex items-center gap-2"><RiEyeLine/>Lead Visibility</button>
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

            {/* SITE CONTENT (CMS) */}
            {tab==='content' && cmsLocal && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-ink">Site Content</h2>
                    <p className="text-ink-2 text-sm mt-1">Edit all website text — changes apply instantly after saving.</p>
                  </div>
                  <button onClick={saveCMS} disabled={cmsSaving} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
                    {cmsSaving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <RiCheckLine/>}
                    Save All Changes
                  </button>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Section selector */}
                  <div className="bg-white border border-violet-100 rounded-2xl p-4 shadow-card h-fit">
                    <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">Sections</p>
                    <div className="flex flex-col gap-1">
                      {CMS_SECTIONS.map(s => (
                        <button
                          key={s.key}
                          onClick={() => setCmsSection(s.key)}
                          className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            cmsSection === s.key
                              ? 'bg-violet-600 text-white'
                              : 'text-ink-2 hover:bg-violet-50 hover:text-ink'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fields editor */}
                  <div className="lg:col-span-3 bg-white border border-violet-100 rounded-2xl p-6 shadow-card">
                    <h3 className="text-ink font-bold text-base mb-5">
                      {CMS_SECTIONS.find(s => s.key === cmsSection)?.label}
                    </h3>

                    <div className="flex flex-col gap-4">

                      {/* HEADER */}
                      {cmsSection === 'header' && (
                        <>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Brand Name" value={cmsLocal.header?.brandName} onChange={v => updateCmsField('header','brandName',v)} />
                            <InputField label="Brand Suffix" value={cmsLocal.header?.brandSuffix} onChange={v => updateCmsField('header','brandSuffix',v)} />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Login Button Text" value={cmsLocal.header?.loginBtn} onChange={v => updateCmsField('header','loginBtn',v)} />
                            <InputField label="Join Button Text" value={cmsLocal.header?.joinBtn} onChange={v => updateCmsField('header','joinBtn',v)} />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Nav Link 1" value={cmsLocal.header?.nav1} onChange={v => updateCmsField('header','nav1',v)} placeholder="Home" />
                            <InputField label="Nav Link 2" value={cmsLocal.header?.nav2} onChange={v => updateCmsField('header','nav2',v)} placeholder="How It Works" />
                            <InputField label="Nav Link 3" value={cmsLocal.header?.nav3} onChange={v => updateCmsField('header','nav3',v)} placeholder="Pricing" />
                            <InputField label="Nav Link 4" value={cmsLocal.header?.nav4} onChange={v => updateCmsField('header','nav4',v)} placeholder="Leads" />
                          </div>
                        </>
                      )}

                      {/* HERO */}
                      {cmsSection === 'hero' && (
                        <>
                          <InputField label="Badge Text" value={cmsLocal.hero?.badge} onChange={v => updateCmsField('hero','badge',v)} />
                          <div className="grid sm:grid-cols-3 gap-4">
                            <InputField label="Heading Line 1" value={cmsLocal.hero?.heading1} onChange={v => updateCmsField('hero','heading1',v)} />
                            <InputField label="Heading Line 2 (gradient)" value={cmsLocal.hero?.heading2} onChange={v => updateCmsField('hero','heading2',v)} />
                            <InputField label="Heading Line 3" value={cmsLocal.hero?.heading3} onChange={v => updateCmsField('hero','heading3',v)} />
                          </div>
                          <InputField label="Subtext" value={cmsLocal.hero?.subtext} onChange={v => updateCmsField('hero','subtext',v)} multiline />
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="CTA Button 1" value={cmsLocal.hero?.cta1} onChange={v => updateCmsField('hero','cta1',v)} />
                            <InputField label="CTA Button 2" value={cmsLocal.hero?.cta2} onChange={v => updateCmsField('hero','cta2',v)} />
                          </div>
                          <InputField label="Social Proof Text" value={cmsLocal.hero?.socialProof} onChange={v => updateCmsField('hero','socialProof',v)} />
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider">Mini Stats</p>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <InputField label="Stat 1 Value" value={cmsLocal.hero?.stat1Value} onChange={v => updateCmsField('hero','stat1Value',v)} />
                            <InputField label="Stat 1 Label" value={cmsLocal.hero?.stat1Label} onChange={v => updateCmsField('hero','stat1Label',v)} />
                          </div>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <InputField label="Stat 2 Value" value={cmsLocal.hero?.stat2Value} onChange={v => updateCmsField('hero','stat2Value',v)} />
                            <InputField label="Stat 2 Label" value={cmsLocal.hero?.stat2Label} onChange={v => updateCmsField('hero','stat2Label',v)} />
                          </div>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <InputField label="Stat 3 Value" value={cmsLocal.hero?.stat3Value} onChange={v => updateCmsField('hero','stat3Value',v)} />
                            <InputField label="Stat 3 Label" value={cmsLocal.hero?.stat3Label} onChange={v => updateCmsField('hero','stat3Label',v)} />
                          </div>
                        </>
                      )}

                      {/* STATS BAR */}
                      {cmsSection === 'stats' && (
                        <div className="flex flex-col gap-5">
                          {(cmsLocal.stats || []).map((stat, i) => (
                            <div key={i} className="border border-violet-100 rounded-xl p-4">
                              <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">Stat {i+1}</p>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <InputField label="Value" value={stat.value} onChange={v => updateCmsDirectArray('stats', i, 'value', v)} />
                                <InputField label="Label" value={stat.label} onChange={v => updateCmsDirectArray('stats', i, 'label', v)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* HOW IT WORKS */}
                      {cmsSection === 'howItWorks' && (
                        <>
                          <InputField label="Section Tag" value={cmsLocal.howItWorks?.tag} onChange={v => updateCmsField('howItWorks','tag',v)} />
                          <InputField label="Heading" value={cmsLocal.howItWorks?.heading} onChange={v => updateCmsField('howItWorks','heading',v)} />
                          <InputField label="Subtext" value={cmsLocal.howItWorks?.subtext} onChange={v => updateCmsField('howItWorks','subtext',v)} multiline />
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mt-2">Steps</p>
                          <div className="flex flex-col gap-4">
                            {(cmsLocal.howItWorks?.steps || []).map((step, i) => (
                              <div key={i} className="border border-violet-100 rounded-xl p-4">
                                <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">Step {i+1}</p>
                                <div className="flex flex-col gap-3">
                                  <InputField label="Title" value={step.title} onChange={v => updateCmsArrayItem('howItWorks','steps',i,'title',v)} />
                                  <InputField label="Description" value={step.desc} onChange={v => updateCmsArrayItem('howItWorks','steps',i,'desc',v)} multiline />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* WHY US */}
                      {cmsSection === 'whyUs' && (
                        <>
                          <InputField label="Section Tag" value={cmsLocal.whyUs?.tag} onChange={v => updateCmsField('whyUs','tag',v)} />
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Heading Line 1" value={cmsLocal.whyUs?.heading1} onChange={v => updateCmsField('whyUs','heading1',v)} />
                            <InputField label="Heading Line 2 (gradient)" value={cmsLocal.whyUs?.heading2} onChange={v => updateCmsField('whyUs','heading2',v)} />
                          </div>
                          <InputField label="Subtext" value={cmsLocal.whyUs?.subtext} onChange={v => updateCmsField('whyUs','subtext',v)} multiline />
                          <InputField label="CTA Button Text" value={cmsLocal.whyUs?.cta} onChange={v => updateCmsField('whyUs','cta',v)} />
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mt-2">Bullet Points</p>
                          <div className="flex flex-col gap-2">
                            {(cmsLocal.whyUs?.bullets || []).map((bullet, i) => (
                              <div key={i}>
                                <InputField label={`Bullet ${i+1}`} value={bullet}
                                  onChange={v => {
                                    const bullets = [...(cmsLocal.whyUs?.bullets || [])]
                                    bullets[i] = v
                                    setCmsLocal(prev => ({ ...prev, whyUs: { ...prev.whyUs, bullets } }))
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mt-2">Features</p>
                          <div className="flex flex-col gap-4">
                            {(cmsLocal.whyUs?.features || []).map((feat, i) => (
                              <div key={i} className="border border-violet-100 rounded-xl p-4">
                                <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">Feature {i+1}</p>
                                <div className="flex flex-col gap-3">
                                  <InputField label="Title" value={feat.title} onChange={v => updateCmsArrayItem('whyUs','features',i,'title',v)} />
                                  <InputField label="Description" value={feat.desc} onChange={v => updateCmsArrayItem('whyUs','features',i,'desc',v)} multiline />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* PRICING */}
                      {cmsSection === 'pricing' && (
                        <>
                          <InputField label="Section Tag" value={cmsLocal.pricing?.tag} onChange={v => updateCmsField('pricing','tag',v)} />
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Heading Part 1" value={cmsLocal.pricing?.heading1} onChange={v => updateCmsField('pricing','heading1',v)} />
                            <InputField label="Heading Part 2 (gradient)" value={cmsLocal.pricing?.heading2} onChange={v => updateCmsField('pricing','heading2',v)} />
                          </div>
                          <InputField label="Subtext" value={cmsLocal.pricing?.subtext} onChange={v => updateCmsField('pricing','subtext',v)} multiline />
                          <InputField label="CTA Button Text" value={cmsLocal.pricing?.cta} onChange={v => updateCmsField('pricing','cta',v)} />
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mt-2">Plans</p>
                          <div className="flex flex-col gap-4">
                            {(cmsLocal.pricing?.plans || []).map((plan, i) => (
                              <div key={i} className="border border-violet-100 rounded-xl p-4">
                                <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">Plan {i+1}</p>
                                <div className="flex flex-col gap-3">
                                  <div className="grid sm:grid-cols-3 gap-3">
                                    <InputField label="Name" value={plan.name} onChange={v => updateCmsArrayItem('pricing','plans',i,'name',v)} />
                                    <InputField label="Price" value={plan.price} onChange={v => updateCmsArrayItem('pricing','plans',i,'price',v)} />
                                    <InputField label="Per Lead Text" value={plan.perLead} onChange={v => updateCmsArrayItem('pricing','plans',i,'perLead',v)} />
                                  </div>
                                  <InputField label="Badge Tag (optional)" value={plan.tag || ''} onChange={v => updateCmsArrayItem('pricing','plans',i,'tag',v)} />
                                  <p className="text-ink-3 text-xs font-bold uppercase tracking-wider">Features (one per line)</p>
                                  <textarea
                                    value={(plan.features || []).join('\n')}
                                    onChange={e => updateCmsArrayItem('pricing','plans',i,'features',e.target.value.split('\n'))}
                                    className="input-field resize-none h-28 text-sm"
                                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* TESTIMONIALS */}
                      {cmsSection === 'testimonials' && (
                        <>
                          <InputField label="Section Tag" value={cmsLocal.testimonials?.tag} onChange={v => updateCmsField('testimonials','tag',v)} />
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Heading Part 1" value={cmsLocal.testimonials?.heading1} onChange={v => updateCmsField('testimonials','heading1',v)} />
                            <InputField label="Heading Part 2 (gradient)" value={cmsLocal.testimonials?.heading2} onChange={v => updateCmsField('testimonials','heading2',v)} />
                          </div>
                          <InputField label="Subtext" value={cmsLocal.testimonials?.subtext} onChange={v => updateCmsField('testimonials','subtext',v)} />
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mt-2">Testimonials</p>
                          <div className="flex flex-col gap-4">
                            {(cmsLocal.testimonials?.items || []).map((t, i) => (
                              <div key={i} className="border border-violet-100 rounded-xl p-4">
                                <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">Testimonial {i+1}</p>
                                <div className="flex flex-col gap-3">
                                  <div className="grid sm:grid-cols-3 gap-3">
                                    <InputField label="Name" value={t.name} onChange={v => updateCmsArrayItem('testimonials','items',i,'name',v)} />
                                    <InputField label="Role" value={t.role} onChange={v => updateCmsArrayItem('testimonials','items',i,'role',v)} />
                                    <InputField label="City" value={t.city} onChange={v => updateCmsArrayItem('testimonials','items',i,'city',v)} />
                                  </div>
                                  <InputField label="Quote" value={t.quote} onChange={v => updateCmsArrayItem('testimonials','items',i,'quote',v)} multiline />
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <InputField label="Result" value={t.result} onChange={v => updateCmsArrayItem('testimonials','items',i,'result',v)} />
                                    <InputField label="Initials (2 letters)" value={t.initials} onChange={v => updateCmsArrayItem('testimonials','items',i,'initials',v)} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* FAQ */}
                      {cmsSection === 'faq' && (
                        <>
                          <InputField label="Section Tag" value={cmsLocal.faq?.tag} onChange={v => updateCmsField('faq','tag',v)} />
                          <InputField label="Heading" value={cmsLocal.faq?.heading} onChange={v => updateCmsField('faq','heading',v)} />
                          <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mt-2">FAQ Items</p>
                          <div className="flex flex-col gap-4">
                            {(cmsLocal.faq?.items || []).map((item, i) => (
                              <div key={i} className="border border-violet-100 rounded-xl p-4">
                                <p className="text-ink-3 text-xs font-bold uppercase tracking-wider mb-3">FAQ {i+1}</p>
                                <div className="flex flex-col gap-3">
                                  <InputField label="Question" value={item.q} onChange={v => updateCmsArrayItem('faq','items',i,'q',v)} />
                                  <InputField label="Answer" value={item.a} onChange={v => updateCmsArrayItem('faq','items',i,'a',v)} multiline />
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* CTA SECTION */}
                      {cmsSection === 'ctaSection' && (
                        <>
                          <InputField label="Badge Text" value={cmsLocal.ctaSection?.badge} onChange={v => updateCmsField('ctaSection','badge',v)} />
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Heading Line 1" value={cmsLocal.ctaSection?.heading1} onChange={v => updateCmsField('ctaSection','heading1',v)} />
                            <InputField label="Heading Line 2" value={cmsLocal.ctaSection?.heading2} onChange={v => updateCmsField('ctaSection','heading2',v)} />
                          </div>
                          <InputField label="Subtext" value={cmsLocal.ctaSection?.subtext} onChange={v => updateCmsField('ctaSection','subtext',v)} multiline />
                          <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="CTA Button 1" value={cmsLocal.ctaSection?.cta1} onChange={v => updateCmsField('ctaSection','cta1',v)} />
                            <InputField label="CTA Button 2" value={cmsLocal.ctaSection?.cta2} onChange={v => updateCmsField('ctaSection','cta2',v)} />
                          </div>
                          <InputField label="Footnote" value={cmsLocal.ctaSection?.footnote} onChange={v => updateCmsField('ctaSection','footnote',v)} />
                        </>
                      )}

                      {/* FOOTER */}
                      {cmsSection === 'footer' && (
                        <>
                          <InputField label="Tagline" value={cmsLocal.footer?.tagline} onChange={v => updateCmsField('footer','tagline',v)} multiline />
                          <div className="grid sm:grid-cols-3 gap-4">
                            <InputField label="Email" value={cmsLocal.footer?.email} onChange={v => updateCmsField('footer','email',v)} />
                            <InputField label="Phone" value={cmsLocal.footer?.phone} onChange={v => updateCmsField('footer','phone',v)} />
                            <InputField label="Address" value={cmsLocal.footer?.address} onChange={v => updateCmsField('footer','address',v)} />
                          </div>
                          <InputField label="Copyright Text" value={cmsLocal.footer?.copyright} onChange={v => updateCmsField('footer','copyright',v)} />
                        </>
                      )}

                    </div>

                    <div className="mt-6 pt-4 border-t border-violet-50 flex gap-3">
                      <button onClick={saveCMS} disabled={cmsSaving} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
                        {cmsSaving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <RiCheckLine/>}
                        Save Changes
                      </button>
                      <button
                        onClick={() => { if(confirm('Reset this section to defaults?')) { setCmsLocal(prev => ({ ...prev, [cmsSection]: DEFAULT_CMS[cmsSection] })) }}}
                        className="btn-ghost px-6 py-2.5 text-sm"
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEAD VISIBILITY */}
            {tab==='visibility' && visLocal && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-ink">Lead Visibility Configuration</h2>
                    <p className="text-ink-2 text-sm mt-1">Control which lead fields are visible at each access level.</p>
                  </div>
                  <button onClick={saveVisibility} disabled={visSaving} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
                    {visSaving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> : <RiCheckLine/>}
                    Save Settings
                  </button>
                </div>

                <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-violet-50">
                          <th className="text-left px-6 py-4 text-ink-3 text-xs font-bold uppercase tracking-wider w-48">Field</th>
                          <th className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs font-bold text-ink uppercase tracking-wider">Public</span>
                              <span className="text-[10px] text-ink-3">Before Login</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs font-bold text-ink uppercase tracking-wider">Logged In</span>
                              <span className="text-[10px] text-ink-3">After Login</span>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs font-bold text-ink uppercase tracking-wider">Purchased</span>
                              <span className="text-[10px] text-ink-3">After Purchase</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {VISIBILITY_FIELDS.map(({ key, label }) => (
                          <tr key={key} className="border-b border-violet-50 hover:bg-violet-50/20 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-ink text-sm font-semibold">{label}</span>
                              {(key === 'clientName' || key === 'clientPhone' || key === 'clientEmail') && (
                                <span className="ml-2 badge bg-amber-100 text-amber-700 border border-amber-200 text-[10px]">sensitive</span>
                              )}
                            </td>
                            {['public','loggedIn','purchased'].map(level => (
                              <td key={level} className="px-6 py-4 text-center">
                                <button
                                  onClick={() => toggleVisField(level, key)}
                                  className={`w-10 h-6 rounded-full transition-all relative ${visLocal[level]?.[key] ? 'bg-violet-600' : 'bg-gray-200'}`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${visLocal[level]?.[key] ? 'left-5' : 'left-1'}`} />
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <p className="text-amber-800 text-sm font-semibold mb-1">Important Notes</p>
                  <ul className="text-amber-700 text-xs space-y-1 list-disc list-inside">
                    <li>Sensitive fields (Name, Phone, Email) are always hidden by the server until a lead is purchased — frontend visibility only affects the UI.</li>
                    <li>The "Purchased" level will always include all fields by default. Unchecking here hides a field even after purchase.</li>
                    <li>Changes take effect immediately after saving — no page refresh needed.</li>
                  </ul>
                </div>
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
