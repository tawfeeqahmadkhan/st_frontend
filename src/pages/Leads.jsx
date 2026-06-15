import { useState, useEffect, useRef } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import LeadCard from '../components/leads/LeadCard'
import { RiSearchLine, RiFilterLine, RiRefreshLine, RiArrowDownSLine, RiCheckLine } from 'react-icons/ri'

const CATEGORIES = ['Full Home Interiors', 'Modular Kitchen', 'Apartment Interiors', 'Villa Interiors']
const BUDGET_OPTIONS = [
  { label: '₹7–10 Lakhs', min: 700000, max: 1000000 },
  { label: '₹10–15 Lakhs', min: 1000000, max: 1500000 },
  { label: '₹15 Lakhs+', min: 1500000 },
]
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Kochi', 'Chandigarh', 'Surat', 'Goa']

function MultiSelect({ label, options, selected, onToggle, getLabel = o => o }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isSelected = (opt) => selected.some(s => getLabel(s) === getLabel(opt))
  const active = selected.length > 0

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all whitespace-nowrap ${
          active
            ? 'border-violet-600 bg-violet-600 text-white'
            : 'border-violet-100 bg-white text-ink-2 hover:border-violet-300 hover:text-ink'
        }`}
      >
        {active
          ? selected.length === 1 ? getLabel(selected[0]) : `${label} (${selected.length})`
          : label
        }
        <RiArrowDownSLine className={`text-base transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-violet-100 rounded-2xl shadow-[0_8px_40px_rgba(124,58,237,0.15)] overflow-hidden min-w-[200px]">
          {options.map((opt, i) => {
            const sel = isSelected(opt)
            return (
              <button
                key={i}
                onClick={() => onToggle(opt)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left text-sm border-b border-violet-50 last:border-0 ${
                  sel ? 'bg-violet-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  sel ? 'bg-violet-600 border-violet-600' : 'border-gray-300'
                }`}>
                  {sel && <RiCheckLine className="text-white text-[10px]" />}
                </div>
                <span className={sel ? 'text-violet-700 font-semibold' : 'text-ink-2'}>{getLabel(opt)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [selCategories, setSelCategories] = useState([])
  const [selBudgets, setSelBudgets] = useState([])
  const [selCities, setSelCities] = useState([])
  const { user } = useAuth()

  const buildParams = (overrides = {}) => {
    const category = selCategories.length > 0 ? selCategories.join(',') : 'All'
    const city = selCities.length > 0 ? selCities.join(',') : 'All'
    const minBudget = selBudgets.length > 0 ? Math.min(...selBudgets.map(b => b.min)) : ''
    const maxBudget = selBudgets.length > 0 && selBudgets.every(b => b.max)
      ? Math.max(...selBudgets.map(b => b.max))
      : ''
    return { category, city, minBudget, maxBudget, search, page, limit: 12, ...overrides }
  }

  const fetchLeads = async (params = {}) => {
    setLoading(true)
    try {
      const res = await api.get('/leads', { params: buildParams(params) })
      setLeads(res.data.leads)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchLeads() }, [page, selCategories, selBudgets, selCities])

  const toggleCategory = (cat) => {
    const next = selCategories.includes(cat) ? selCategories.filter(c => c !== cat) : [...selCategories, cat]
    setSelCategories(next); setPage(1)
  }

  const toggleBudget = (b) => {
    const next = selBudgets.some(s => s.label === b.label) ? selBudgets.filter(s => s.label !== b.label) : [...selBudgets, b]
    setSelBudgets(next); setPage(1)
  }

  const toggleCity = (c) => {
    const next = selCities.includes(c) ? selCities.filter(x => x !== c) : [...selCities, c]
    setSelCities(next); setPage(1)
  }

  const hasFilters = selCategories.length > 0 || selBudgets.length > 0 || selCities.length > 0 || search

  const reset = () => {
    setSelCategories([]); setSelBudgets([]); setSelCities([]); setSearch(''); setPage(1)
    fetchLeads({ category: 'All', city: 'All', minBudget: '', maxBudget: '', search: '', page: 1 })
  }

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchLeads({ page: 1 }) }
  const handlePurchase = (updatedLead) => setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l))

  return (
    <div className="min-h-screen bg-mesh pt-28 pb-16">

      <div className="fixed top-20 left-[5%] w-80 h-80 bg-violet-200/25 rounded-full blur-[90px] pointer-events-none" />
      <div className="fixed bottom-20 right-[5%] w-72 h-72 bg-purple-200/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="section-tag mb-4">Lead Marketplace</div>
        <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-2">
          Browse <span className="gradient-text">Design Leads</span>
        </h1>
        <p className="text-ink-2">
          {total > 0 ? <><span className="text-ink font-bold">{total}</span> verified leads available</> : 'Loading leads...'}
        </p>
      </div>

      {/* Filter bar — single row */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white border border-violet-100 rounded-2xl shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 text-base" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-4 py-2.5 text-sm flex-shrink-0">Search</button>
          </form>

          <div className="w-px h-8 bg-violet-100 hidden md:block" />

          {/* Dropdowns */}
          <MultiSelect
            label="Category"
            options={CATEGORIES}
            selected={selCategories}
            onToggle={toggleCategory}
          />
          <MultiSelect
            label="Budget"
            options={BUDGET_OPTIONS}
            selected={selBudgets}
            onToggle={toggleBudget}
            getLabel={o => o.label}
          />
          <MultiSelect
            label="City"
            options={CITIES}
            selected={selCities}
            onToggle={toggleCity}
          />

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-ink-3 hover:text-violet-600 hover:bg-violet-50 transition-all"
            >
              <RiRefreshLine /> Reset
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {(selCategories.length > 0 || selBudgets.length > 0 || selCities.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {selCategories.map(c => (
              <span key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                {c}
                <button onClick={() => toggleCategory(c)} className="hover:text-violet-900 leading-none">×</button>
              </span>
            ))}
            {selBudgets.map(b => (
              <span key={b.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                {b.label}
                <button onClick={() => toggleBudget(b)} className="hover:text-violet-900 leading-none">×</button>
              </span>
            ))}
            {selCities.map(c => (
              <span key={c} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                {c}
                <button onClick={() => toggleCity(c)} className="hover:text-violet-900 leading-none">×</button>
              </span>
            ))}
          </div>
        )}
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
