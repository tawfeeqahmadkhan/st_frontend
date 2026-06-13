import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  RiShieldCheckLine, RiFlashlightLine, RiLockPasswordLine, RiStarLine,
  RiFilterLine, RiBellLine, RiArrowRightLine, RiCheckLine, RiMapPin2Line,
  RiTimeLine, RiUserStarLine, RiMoneyDollarCircleLine, RiDoubleQuotesL,
  RiBuilding4Line, RiCustomerService2Line, RiShoppingCartLine,
} from 'react-icons/ri'
import { HiStar } from 'react-icons/hi'

// ── Data ─────────────────────────────────────────────────────────────────────

const heroLeads = [
  { id: 1, name: 'Priya S.', city: 'Mumbai', budget: '18–25L', project: '4BHK Full Home Interior', ago: '2 min' },
  { id: 2, name: 'Rahul M.', city: 'Delhi', budget: '8–12L', project: 'Modular Kitchen + Dining', ago: '5 min' },
  { id: 3, name: 'Arjun K.', city: 'Bangalore', budget: '30–40L', project: 'Corporate Office — 5000 sqft', ago: '8 min' },
  { id: 4, name: 'Sneha T.', city: 'Pune', budget: '5–8L', project: 'Master Bedroom & Wardrobe', ago: '11 min' },
  { id: 5, name: 'Vikram J.', city: 'Hyderabad', budget: '25–35L', project: 'Restaurant Interior Design', ago: '15 min' },
  { id: 6, name: 'Ananya R.', city: 'Chennai', budget: '15–22L', project: '3BHK Full Home Design', ago: '19 min' },
  { id: 7, name: 'Karan S.', city: 'Ahmedabad', budget: '6–10L', project: 'Living Room + Foyer', ago: '23 min' },
  { id: 8, name: 'Neha P.', city: 'Vadodara', budget: '8–10L', project: 'Wardrobe + Bedroom Makeover', ago: '27 min' },
]

const stats = [
  { value: '2,400+', label: 'Monthly Leads', icon: RiFlashlightLine, color: 'text-violet-600', bg: 'bg-violet-50' },
  { value: '48', label: 'Active Cities', icon: RiMapPin2Line, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: '4 min', label: 'Avg. Alert Time', icon: RiTimeLine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: '₹45Cr+', label: 'Project Value', icon: RiMoneyDollarCircleLine, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const steps = [
  { num: 1, title: 'Create Account', desc: 'Sign up free in 60 seconds — no credit card required.', icon: RiUserStarLine, color: 'bg-violet-500' },
  { num: 2, title: 'Browse Verified Leads', desc: 'Filter by city, budget & project category to find ideal clients.', icon: RiFilterLine, color: 'bg-blue-500' },
  { num: 3, title: 'Buy a Lead Directly', desc: 'One-time fee per lead. No subscriptions, no hidden charges.', icon: RiShoppingCartLine, color: 'bg-amber-500' },
  { num: 4, title: 'Contact the Client', desc: 'Get full details instantly. Call or email them right away.', icon: RiBellLine, color: 'bg-emerald-500' },
  { num: 5, title: 'Win the Project', desc: 'Book a site visit, show your portfolio, and close the deal.', icon: RiStarLine, color: 'bg-pink-500' },
]

const features = [
  { icon: RiShieldCheckLine, title: 'Verified Leads', desc: 'Every lead is manually verified before listing.', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
  { icon: RiFlashlightLine, title: 'Instant Access', desc: 'Full client details unlocked the moment you purchase.', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  { icon: RiLockPasswordLine, title: 'Secure Payments', desc: 'Bank-grade SSL encryption on every transaction.', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  { icon: RiBuilding4Line, title: 'Premium Projects', desc: 'High-budget clients from Tier-1 cities who are ready to hire.', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  { icon: RiFilterLine, title: 'Smart Filters', desc: 'Target by city, budget, and project specialty.', color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
  { icon: RiCustomerService2Line, title: 'Dedicated Support', desc: 'Our team helps you close more deals, every step of the way.', color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
]

const testimonials = [
  { name: 'Ravi Sharma', role: 'Senior Interior Designer', city: 'Mumbai', quote: "Scale Studio helped me get 3 new projects in my first month. The leads are genuinely verified — best ROI I've had.", result: '₹12L in new projects', initials: 'RS', grad: 'from-violet-400 to-purple-600' },
  { name: 'Priya Kapoor', role: 'Studio Owner', city: 'Delhi', quote: "The quality here is unlike anything else. Within 6 months I closed deals worth ₹45L+ through Scale Studio.", result: '₹45L+ closed', initials: 'PK', grad: 'from-pink-400 to-rose-600' },
  { name: 'Vikram Nair', role: 'Architect & Designer', city: 'Bangalore', quote: "Every single lead I purchased converted into at least a site visit. The targeting is spot-on. Highly recommended!", result: '8/10 leads converted', initials: 'VN', grad: 'from-blue-400 to-indigo-600' },
]

const faqs = [
  { q: 'What types of design leads are available?', a: 'Full home interiors, modular kitchens, offices, restaurants, retail stores, individual rooms, landscape & exteriors, and 3D visualizations — across 48+ cities in India.' },
  { q: 'How are leads verified before listing?', a: 'Our team manually calls each lead to confirm identity, project scope, and budget before approval. Only genuine enquiries reach the marketplace.' },
  { q: "Can I get a refund if a lead doesn't respond?", a: 'Yes. If a client is unresponsive within 48 hours, you can raise a refund request within 7 days of purchase. Our team reviews each case within 24 hours.' },
  { q: 'How much does a lead cost?', a: 'Lead prices range from ₹299 to ₹1,499 depending on project budget size. You pay only for leads you want — no subscriptions, no lock-in.' },
  { q: 'How quickly do I get client details after purchase?', a: 'Instantly — full name, phone, email, and project requirements are unlocked the moment your purchase completes.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. 256-bit SSL encryption on all transactions. We do not store card details. Payments go through certified gateways.' },
]

const pricingPlans = [
  { name: 'Starter', price: '₹299', tag: null, perLead: 'per lead', highlight: false, features: ['All lead categories', 'Filter by city & budget', 'Instant contact unlock', 'Email support'] },
  { name: 'Buy Any Lead', price: '₹299–₹1499', tag: 'How It Works', perLead: 'one-time per lead', highlight: true, features: ['Pay only for what you want', 'No monthly subscription', 'Instant access to contact', 'Full refund policy', 'Priority alerts available'] },
  { name: 'Bulk Leads', price: 'Custom', tag: 'High Volume', perLead: 'negotiate the best rate', highlight: false, features: ['10+ leads / month', 'Dedicated account manager', 'Exclusive high-budget leads', 'Custom city targeting', 'Analytics dashboard'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function useScrollVisible() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05, rootMargin: '-40px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Section({ children, className = '', id, alt = false }) {
  const [ref, visible] = useScrollVisible()
  return (
    <section
      ref={ref}
      id={id}
      className={`${alt ? 'bg-section-alt' : ''} ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {children}
    </section>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border-2 rounded-2xl overflow-hidden cursor-pointer transition-colors duration-300 ${
        open ? 'border-violet-300 bg-violet-50/50' : 'border-gray-100 hover:border-violet-200'
      }`}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between p-6 gap-4">
        <h3 className="font-semibold text-ink text-sm">{q}</h3>
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open ? 'bg-violet-600 rotate-45' : 'bg-gray-100'}`}>
          <span className={`text-xl leading-none font-light ${open ? 'text-white' : 'text-ink'}`}>+</span>
        </div>
      </div>
      <div style={{ maxHeight: open ? '300px' : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.25s ease' }}>
        <p className="text-ink-2 text-sm leading-relaxed px-6 pb-6">{a}</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [feedLeads, setFeedLeads] = useState(heroLeads.slice(0, 5))
  const [nextIdx, setNextIdx] = useState(4)
  const [animTick, setAnimTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setNextIdx(prev => {
        const idx = prev % heroLeads.length
        setFeedLeads(curr => [heroLeads[idx], ...curr.slice(0, 4)])
        setAnimTick(t => t + 1)
        return idx + 1
      })
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-mesh">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background: full-width interior image with shade overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Single semi-transparent dark shade over entire section */}
          <div className="absolute inset-0" style={{ background: 'rgba(10,5,30,0.62)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left — text directly on the shaded image */}
            <div className="hero-left flex flex-col gap-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-bold w-fit uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Scale Studio — Premium Lead Marketplace
              </div>

              <h1 className="text-4xl lg:text-[58px] font-extrabold leading-[1.06] tracking-tight text-white">
                Buy High-Quality<br />
                <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#818cf8 60%,#a78bfa 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s linear infinite' }}>
                  Design Leads
                </span><br />
                That Convert.
              </h1>

              <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-[480px]">
                Connect with clients actively searching for interior designers.
                Purchase individual verified leads — no subscription, no lock-in.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/leads" className="btn-primary inline-flex items-center gap-3 px-7 py-3.5 text-sm lg:text-base">
                  Browse Leads <RiArrowRightLine className="text-lg" />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-3 px-7 py-3.5 text-sm lg:text-base font-bold rounded-[14px] border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                  Join as Designer
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {['RS','PK','VN','AK','SM'].map((init, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white/40 bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <HiStar key={i} className="text-amber-400 text-sm" />)}
                  </div>
                  <p className="text-white/60 text-xs">Trusted by <span className="text-white font-bold">1,200+ designers</span></p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                {[['2,400+','Monthly Leads'],['48','Active Cities'],['₹45Cr+','Project Value']].map(([v,l]) => (
                  <div key={l}>
                    <p className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">{v}</p>
                    <p className="text-white/55 text-xs mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Lead Feed Card (bigger) */}
            <div className="hero-right relative w-full max-w-[560px] mx-auto lg:ml-auto">

              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-violet-400/30 via-purple-300/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-float">

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-purple-700">
                  <div>
                    <p className="text-violet-200 text-[10px] font-bold uppercase tracking-widest mb-0.5">Live Lead Feed</p>
                    <h2 className="text-white font-bold text-base">New enquiries right now</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-green-300" />
                      <div className="absolute inset-0 rounded-full bg-green-300 animate-ping-slow" />
                    </div>
                    <span className="text-white text-xs font-bold">Live</span>
                  </div>
                </div>

                {/* Fixed-height lead list */}
                <div className="relative" style={{ height: 340, overflow: 'hidden' }}>
                  <div className="p-3 flex flex-col gap-2.5">
                    {feedLeads.map((lead, i) => (
                      <div
                        key={i === 0 ? `n-${animTick}` : lead.id}
                        className={`bg-gray-50 border border-gray-100 rounded-xl p-3.5 hover:border-violet-200 hover:bg-violet-50/40 transition-colors cursor-pointer flex-shrink-0 ${i === 0 ? 'lead-new' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-ink font-bold text-xs flex-shrink-0">
                              {lead.name[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-ink font-bold text-xs">{lead.name}</span>
                                <span className="badge bg-gray-100 text-ink-3 text-[10px] py-0.5">{lead.city}</span>
                              </div>
                              <p className="text-ink-2 text-[11px] mt-0.5 leading-none">{lead.project}</p>
                            </div>
                          </div>
                          <span className="badge bg-violet-100 text-violet-700 border border-violet-200 flex-shrink-0 text-[10px]">
                            {lead.budget}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-ink-3 font-mono blur-[3px] select-none">+91 ••••• •••••</span>
                          <span className="text-[10px] text-ink-3 flex items-center gap-1">
                            <RiTimeLine className="text-xs" />{lead.ago} ago
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
                </div>

                {/* Unlock prompt */}
                <div className="mx-3 mb-3 p-3.5 rounded-xl border border-dashed border-violet-200 bg-violet-50/40 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-ink font-semibold text-xs">Unlock verified contact details</p>
                    <p className="text-ink-3 text-[11px] mt-0.5">Phone numbers protected until you purchase</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white border border-violet-100 shadow-sm flex items-center justify-center flex-shrink-0">
                    <RiLockPasswordLine className="text-violet-400 text-sm" />
                  </div>
                </div>

                {/* Pill row */}
                <div className="flex gap-2.5 px-3 pb-3">
                  <div className="flex-1 py-2.5 px-3 rounded-xl bg-violet-600 flex items-center gap-2">
                    <RiShieldCheckLine className="text-white/90 text-sm" />
                    <span className="text-white text-xs font-bold">Verified scope</span>
                  </div>
                  <div className="flex-1 py-2.5 px-3 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-2">
                    <RiFlashlightLine className="text-amber-600 text-sm" />
                    <span className="text-amber-700 text-xs font-bold">Fast alerts</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-5 -left-4 bg-white border border-violet-100 rounded-2xl px-3.5 py-2.5 shadow-card float-badge hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <RiCheckLine className="text-emerald-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-ink font-bold text-xs">New Lead!</p>
                    <p className="text-ink-3 text-[10px]">₹18–25L · Mumbai</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-4 bg-white border border-violet-100 rounded-2xl px-3.5 py-2.5 shadow-card float-badge-slow hidden sm:block">
                <div className="flex items-center gap-2">
                  <RiShieldCheckLine className="text-violet-600 text-base" />
                  <p className="text-ink font-bold text-xs">100% Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <Section className="py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white border border-violet-100 rounded-2xl shadow-card grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-violet-50 overflow-hidden">
            {stats.map(({ value, label, icon: Icon, color, bg }) => (
              <div key={label} className="flex flex-col items-center py-8 px-6 text-center hover:bg-violet-50/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`text-xl ${color}`} />
                </div>
                <p className="text-ink font-extrabold text-3xl tracking-tight">{value}</p>
                <p className="text-ink-3 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <Section id="how-it-works" className="py-28" alt>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5">How It Works</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              From signup to <span className="gradient-text">site visit</span> — fast
            </h2>
            <p className="text-ink-2 text-lg max-w-lg mx-auto">No subscription needed. Buy only the leads you want, when you want them.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-violet-200 via-violet-400 to-violet-200" />
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="relative mb-5">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <step.icon className="text-white text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-white border-2 border-violet-200 flex items-center justify-center text-violet-700 text-xs font-extrabold z-20 shadow-sm">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-ink font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-ink-2 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── WHY SCALE STUDIO ────────────────────────────────────────────── */}
      <Section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-tag mb-5">Why Scale Studio</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-5 tracking-tight leading-tight">
                Everything to grow<br />your <span className="gradient-text">design business</span>
              </h2>
              <p className="text-ink-2 text-lg leading-relaxed mb-8">
                Built for interior designers who want a reliable, premium source of qualified client leads — without expensive subscriptions.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {['Pay per lead — from ₹299', 'Full refund policy if unresponsive', 'Instant client contact unlock', '48+ cities across India'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine className="text-violet-600 text-xs" />
                    </div>
                    <span className="text-ink-2 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 text-sm">
                Start for Free <RiArrowRightLine />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={f.title} className="glass-card rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                    <f.icon className={`text-xl ${f.color}`} />
                  </div>
                  <h3 className="text-ink font-bold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-ink-2 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <Section id="pricing" className="py-28" alt>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">Pricing</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              No subscriptions. <span className="gradient-text">Buy per lead.</span>
            </h2>
            <p className="text-ink-2 text-lg max-w-lg mx-auto">Pay a small one-time fee for each lead you want. Full contact details unlocked instantly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 flex flex-col h-full border-2 transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-violet-600 to-purple-700 border-transparent shadow-glow'
                    : 'bg-white border-violet-100 shadow-card hover:border-violet-300 hover:shadow-card-hover'
                }`}
              >
                {plan.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${plan.highlight ? 'bg-amber-400 text-amber-900' : 'bg-violet-600 text-white'}`}>
                      {plan.tag}
                    </span>
                  </div>
                )}
                <div className="mb-6 mt-2">
                  <h3 className={`text-sm font-bold mb-1 ${plan.highlight ? 'text-violet-200' : 'text-ink-3'}`}>{plan.name}</h3>
                  <p className={`font-extrabold text-3xl ${plan.highlight ? 'text-white' : 'text-ink'}`}>{plan.price}</p>
                  <p className={`text-sm mt-1 ${plan.highlight ? 'text-violet-300' : 'text-violet-600'}`}>{plan.perLead}</p>
                </div>
                <ul className="flex flex-col gap-3 flex-1 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <RiCheckLine className={`text-base mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-violet-300' : 'text-violet-500'}`} />
                      <span className={plan.highlight ? 'text-violet-100' : 'text-ink-2'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/leads" className={`py-3 rounded-xl font-bold text-sm text-center transition-all ${
                  plan.highlight ? 'bg-white text-violet-700 hover:bg-violet-50' : 'btn-ghost'
                }`}>
                  Browse Leads
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <Section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">Testimonials</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              Designers love <span className="gradient-text">Scale Studio</span>
            </h2>
            <p className="text-ink-2 text-lg">Real results from real designers across India.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 flex flex-col gap-4 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <RiDoubleQuotesL className="text-violet-300 text-4xl" />
                <p className="text-ink-2 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-0.5 my-1">
                  {[...Array(5)].map((_, j) => <HiStar key={j} className="text-amber-400 text-sm" />)}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-violet-50">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.grad} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-bold text-sm">{t.name}</p>
                    <p className="text-ink-3 text-xs">{t.role} · {t.city}</p>
                  </div>
                  <p className="text-emerald-600 font-extrabold text-sm">{t.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <Section className="py-28" alt>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">FAQ</div>
            <h2 className="text-4xl font-extrabold text-ink mb-4 tracking-tight">
              Frequently asked <span className="gradient-text">questions</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => <FAQItem key={i} {...item} />)}
          </div>
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 shadow-glow">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="relative z-10 py-16 px-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-bold mb-6">
                <RiFlashlightLine /> Get Started Today — Free
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Ready to grow your<br />design business?
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-md mx-auto">
                Join 1,200+ designers closing projects every week with Scale Studio leads.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="bg-white text-violet-700 font-bold rounded-2xl px-8 py-4 text-base hover:bg-violet-50 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2.5">
                  Join Free <RiArrowRightLine className="text-lg" />
                </Link>
                <Link to="/leads" className="border-2 border-white/30 text-white font-bold rounded-2xl px-8 py-4 text-base hover:bg-white/10 transition-all inline-flex items-center gap-2.5">
                  Browse Leads
                </Link>
              </div>
              <p className="text-violet-300 text-xs mt-6">No subscription · Pay per lead · Cancel anytime</p>
            </div>
          </div>
        </div>
      </Section>

    </div>
  )
}
