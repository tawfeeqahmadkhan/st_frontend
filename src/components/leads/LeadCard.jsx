import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RiMapPin2Line, RiTimeLine, RiHeartLine, RiHeartFill, RiLockPasswordLine, RiFlashlightLine, RiBuilding4Line, RiCheckLine } from 'react-icons/ri'
import { HiStar } from 'react-icons/hi'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useCMS } from '../../context/CMSContext'
import { useNavigate } from 'react-router-dom'

const categoryColors = {
  'Full Home Interior': { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
  'Modular Kitchen': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  'Office & Commercial': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'Bedroom & Wardrobe': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  'Living Room': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Restaurant & Hospitality': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'Retail Store': { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  '3D Visualization': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Renovation': { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  'Landscape & Exterior': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
}

const formatBudget = (min, max) => {
  const toL = n => n >= 100000 ? `${(n / 100000).toFixed(0)}L` : `₹${(n / 1000).toFixed(0)}K`
  return `₹${toL(min)}–${toL(max)}`
}

export default function LeadCard({ lead, purchased = false, wishlisted: initialWishlisted = false, onPurchase }) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [buying, setBuying] = useState(false)
  const { user, refreshUser } = useAuth()
  const { visibility } = useCMS()
  const navigate = useNavigate()

  const cat = categoryColors[lead.category] || { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' }
  const isPurchased = purchased || user?.purchasedLeads?.some(p => (p._id || p) === lead._id)

  // Determine which visibility level applies
  const visLevel = isPurchased ? 'purchased' : user ? 'loggedIn' : 'public'
  const vis = visibility?.[visLevel] || {}

  const toggleWishlist = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    try {
      const res = await api.post(`/leads/${lead._id}/wishlist`)
      setWishlisted(res.data.wishlisted)
      toast.success(res.data.wishlisted ? 'Added to wishlist' : 'Removed from wishlist')
    } catch { toast.error('Failed to update wishlist') }
  }

  const handleBuy = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (isPurchased) { navigate('/dashboard'); return }
    setBuying(true)
    try {
      const res = await api.post(`/purchases/${lead._id}`)
      toast.success('Lead purchased! View client details in your dashboard.')
      await refreshUser()
      if (onPurchase) onPurchase(res.data.lead)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed')
    } finally {
      setBuying(false)
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col bg-white group transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">

      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500" />

      <div className="p-5 pb-4">
        {/* Category + wishlist */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {vis.category !== false && (
              <span className={`badge ${cat.bg} ${cat.text} border ${cat.border}`}>{lead.category}</span>
            )}
            {lead.isFeatured && (
              <span className="badge bg-amber-100 text-amber-700 border border-amber-200">
                <HiStar className="text-[10px]" /> Featured
              </span>
            )}
          </div>
          <button
            onClick={toggleWishlist}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-red-50 flex-shrink-0"
          >
            {wishlisted
              ? <RiHeartFill className="text-red-500 text-lg" />
              : <RiHeartLine className="text-ink-3 text-lg group-hover:text-red-400 transition-colors" />
            }
          </button>
        </div>

        {vis.title !== false && (
          <h3 className="text-ink font-bold text-base leading-snug mb-2 line-clamp-2">{lead.title}</h3>
        )}

        {vis.projectDescription !== false && lead.projectDescription && (
          <p className="text-ink-2 text-xs leading-relaxed line-clamp-2 mb-3">{lead.projectDescription}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">
          {(vis.city !== false) && (
            <div className="flex items-center gap-1.5 text-ink-3 text-xs">
              <RiMapPin2Line className="text-violet-500 text-sm" />
              {lead.location?.city}{vis.area !== false && lead.location?.area ? `, ${lead.location.area}` : ''}
            </div>
          )}
          {vis.postedAt !== false && (
            <div className="flex items-center gap-1.5 text-ink-3 text-xs">
              <RiTimeLine className="text-violet-500 text-sm" />
              {formatDistanceToNow(new Date(lead.postedAt || lead.createdAt), { addSuffix: true })}
            </div>
          )}
          {vis.propertySize !== false && lead.propertySize && (
            <div className="flex items-center gap-1.5 text-ink-3 text-xs">
              <RiBuilding4Line className="text-violet-500 text-sm" />
              {lead.propertySize}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-violet-100 to-transparent mx-5" />

      {/* Client info */}
      <div className="px-5 py-3">
        {isPurchased && vis.clientName !== false ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 text-[10px] font-bold">{lead.clientName?.[0]}</span>
              </div>
              <span className="text-emerald-700 text-sm font-bold">{lead.clientName}</span>
              <span className="badge bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] ml-auto">
                <RiCheckLine /> Unlocked
              </span>
            </div>
            {vis.clientPhone !== false && <p className="text-ink text-xs font-mono font-semibold">{lead.clientPhone}</p>}
            {vis.clientEmail !== false && lead.clientEmail && <p className="text-ink-2 text-xs">{lead.clientEmail}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <RiLockPasswordLine className="text-ink-3 text-sm flex-shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
              <div className="h-3 w-28 rounded-full bg-violet-50 shimmer-effect" />
              <div className="h-2.5 w-36 rounded-full bg-violet-50/70 shimmer-effect" />
            </div>
            <span className="text-ink-3 text-[10px]">Protected</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 pb-5 pt-3 flex items-center justify-between gap-3 border-t border-violet-50">
        {vis.budget !== false ? (
          <div>
            <p className="text-ink-3 text-[10px] uppercase tracking-wider mb-0.5">Budget</p>
            <p className="text-ink font-extrabold text-base">{formatBudget(lead.budget?.min, lead.budget?.max)}</p>
          </div>
        ) : <div />}

        <div className="flex items-center gap-2">
          {isPurchased ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-bold hover:bg-emerald-200 transition-all"
            >
              <RiCheckLine /> View Details
            </button>
          ) : (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {buying
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <RiFlashlightLine className="text-base" />
              }
              <span>{buying ? 'Buying...' : vis.price !== false ? `Buy ₹${lead.price}` : 'Buy Lead'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
