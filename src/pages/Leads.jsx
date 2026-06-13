import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import LeadCard from '../components/leads/LeadCard'
import { RiSearchLine, RiFilterLine, RiMapPin2Line, RiRefreshLine } from 'react-icons/ri'

const CATEGORIES = ['All', 'Full Home Interior', 'Modular Kitchen', 'Office & Commercial', 'Bedroom & Wardrobe', 'Living Room', 'Restaurant & Hospitality', 'Retail Store', '3D Visualization', 'Renovation', 'Landscape & Exterior']
const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Kochi', 'Chandigarh', 'Surat', 'Goa']

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [city, setCity] = useState('All')
  const { user } = useAuth()

  const fetchLeads = async (params = {}) => {
    setLoading(true)
    try {
      const res = await api.get('/leads', { params: { category, city, search, page, limit: 12, ...params } })
      setLeads(res.data.leads)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchLeads() }, [page, category, city])

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchLeads({ page: 1 }) }

  const reset = () => { setCategory('All'); setCity('All'); setSearch(''); setPage(1); fetchLeads({ category: 'All', city: 'All', search: '', page: 1 }) }

  const handlePurchase = (updatedLead) => setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l))

  return (
    <div className="min-h-screen bg-mesh pt-28 pb-16">

      {/* Subtle background orbs */}
      <div className="fixed top-20 left-[5%] w-80 h-80 bg-violet-200/25 rounded-full blur-[90px] pointer-events-none" />
      <div className="fixed bottom-20 right-[5%] w-72 h-72 bg-purple-200/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="section-tag mb-4">Lead Marketplace</div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-2">
              Browse <span className="gradient-text">Design Leads</span>
            </h1>
            <p className="text-ink-2">
              {total > 0 ? <><span className="text-ink font-bold">{total}</span> verified leads available — buy any lead directly</> : 'Loading leads...'}
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 text-base" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="input-field pl-10" />
            </div>
            <button type="submit" className="btn-primary px-5 py-3 text-sm flex-shrink-0">Search</button>
          </form>
        </div>
      </div>

      {/* Category pills */}
      <div className="max-w-7xl mx-auto px-6 mb-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all border-2 ${
                category === cat ? 'bg-violet-600 border-violet-600 text-white shadow-glow-sm' : 'bg-white border-violet-100 text-ink-2 hover:border-violet-300 hover:text-ink'
              }`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* City filter + reset */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <RiMapPin2Line className="text-violet-500 flex-shrink-0" />
          {CITIES.slice(0, 9).map(c => (
            <button key={c} onClick={() => { setCity(c); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 border transition-all ${
                city === c ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white border-violet-100 text-ink-3 hover:border-violet-300 hover:text-ink'
              }`}
            >{c}</button>
          ))}
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-ink-3 hover:text-violet-600 text-xs font-semibold transition-colors">
          <RiRefreshLine /> Reset filters
        </button>
      </div>

      {/* Lead grid */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white border border-violet-100 rounded-2xl h-72 animate-pulse">
                <div className="h-1 bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 w-1/3 bg-violet-50 rounded-lg" />
                  <div className="h-4 w-2/3 bg-violet-50/70 rounded-lg" />
                  <div className="h-3 w-full bg-violet-50/50 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-4">
              <RiFilterLine className="text-violet-300 text-2xl" />
            </div>
            <h3 className="text-ink-2 font-bold mb-2">No leads found</h3>
            <p className="text-ink-3 text-sm">Try changing your filters or <button onClick={reset} className="text-violet-600 font-semibold">reset them</button></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                wishlisted={user?.wishlist?.some(w => (w._id || w) === lead._id)}
                purchased={user?.purchasedLeads?.some(p => (p._id || p) === lead._id)}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {[...Array(pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${
                  page === i + 1 ? 'bg-violet-600 border-violet-600 text-white shadow-glow-sm' : 'bg-white border-violet-100 text-ink-2 hover:border-violet-300'
                }`}
              >{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
