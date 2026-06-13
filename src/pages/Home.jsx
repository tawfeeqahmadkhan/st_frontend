import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import heroimg from'../public/hero-bg.png'
import {
  RiShieldCheckLine, RiFlashlightLine, RiLockPasswordLine, RiStarLine,
  RiFilterLine, RiBellLine, RiArrowRightLine, RiCheckLine, RiMapPin2Line,
  RiTimeLine, RiUserStarLine, RiMoneyDollarCircleLine, RiDoubleQuotesL,
  RiBuilding4Line, RiCustomerService2Line, RiShoppingCartLine,
} from 'react-icons/ri'
import { HiStar } from 'react-icons/hi'
import { useCMS } from '../context/CMSContext'

// ── Icon maps (visual config stays in code, text comes from CMS) ──────────────

const statIcons = [
  { icon: RiFlashlightLine, color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: RiMapPin2Line, color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: RiTimeLine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: RiMoneyDollarCircleLine, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const stepIcons = [
  { icon: RiUserStarLine, color: 'bg-violet-500' },
  { icon: RiFilterLine, color: 'bg-blue-500' },
  { icon: RiShoppingCartLine, color: 'bg-amber-500' },
  { icon: RiBellLine, color: 'bg-emerald-500' },
  { icon: RiStarLine, color: 'bg-pink-500' },
]

const featureIcons = [
  { icon: RiShieldCheckLine, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
  { icon: RiFlashlightLine, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  { icon: RiLockPasswordLine, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  { icon: RiBuilding4Line, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  { icon: RiFilterLine, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
  { icon: RiCustomerService2Line, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100' },
]

const testimonialGrads = [
  'from-violet-400 to-purple-600',
  'from-pink-400 to-rose-600',
  'from-blue-400 to-indigo-600',
]

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
  const { cms } = useCMS()
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

  const hero = cms.hero
  const statsData = cms.stats
  const hiw = cms.howItWorks
  const why = cms.whyUs
  const pricingData = cms.pricing
  const testimonialsData = cms.testimonials
  const faqData = cms.faq
  const cta = cms.ctaSection

  return (
    <div className="bg-mesh">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background: full-width interior image with shade overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={heroimg}
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
                {hero.badge}
              </div>

              <h1 className="text-4xl lg:text-[58px] font-extrabold leading-[1.06] tracking-tight text-white">
                {hero.heading1}<br />
                <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#818cf8 60%,#a78bfa 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s linear infinite' }}>
                  {hero.heading2}
                </span><br />
                {hero.heading3}
              </h1>

              <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-[480px]">
                {hero.subtext}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/leads" className="btn-primary inline-flex items-center gap-3 px-7 py-3.5 text-sm lg:text-base">
                  {hero.cta1} <RiArrowRightLine className="text-lg" />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-3 px-7 py-3.5 text-sm lg:text-base font-bold rounded-[14px] border-2 border-white/30 text-white hover:bg-white/10 transition-all">
                  {hero.cta2}
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
                  <p className="text-white/60 text-xs">{hero.socialProof}</p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                {[
                  [hero.stat1Value, hero.stat1Label],
                  [hero.stat2Value, hero.stat2Label],
                  [hero.stat3Value, hero.stat3Label],
                ].map(([v,l]) => (
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
            {(statsData || []).map(({ value, label }, idx) => {
              const { icon: Icon, color, bg } = statIcons[idx] || statIcons[0]
              return (
                <div key={label} className="flex flex-col items-center py-8 px-6 text-center hover:bg-violet-50/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`text-xl ${color}`} />
                  </div>
                  <p className="text-ink font-extrabold text-3xl tracking-tight">{value}</p>
                  <p className="text-ink-3 text-xs font-semibold uppercase tracking-wider mt-1">{label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <Section id="how-it-works" className="py-28" alt>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-5">{hiw.tag}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              {hiw.heading.split(' — ')[0]} — <span className="gradient-text">{hiw.heading.split(' — ')[1]}</span>
            </h2>
            <p className="text-ink-2 text-lg max-w-lg mx-auto">{hiw.subtext}</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-violet-200 via-violet-400 to-violet-200" />
            {(hiw.steps || []).map((step, i) => {
              const { icon: StepIcon, color } = stepIcons[i] || stepIcons[0]
              return (
                <div key={i} className="flex flex-col items-center text-center group" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="relative mb-5">
                    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <StepIcon className="text-white text-2xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-white border-2 border-violet-200 flex items-center justify-center text-violet-700 text-xs font-extrabold z-20 shadow-sm">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-ink font-bold text-sm mb-2">{step.title}</h3>
                  <p className="text-ink-2 text-xs leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* ── WHY SCALE STUDIO ────────────────────────────────────────────── */}
      <Section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-tag mb-5">{why.tag}</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-5 tracking-tight leading-tight">
                {why.heading1}<br />your <span className="gradient-text">{why.heading2}</span>
              </h2>
              <p className="text-ink-2 text-lg leading-relaxed mb-8">
                {why.subtext}
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {(why.bullets || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <RiCheckLine className="text-violet-600 text-xs" />
                    </div>
                    <span className="text-ink-2 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 text-sm">
                {why.cta} <RiArrowRightLine />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(why.features || []).map((f, i) => {
                const { icon: FeatIcon, color, bg } = featureIcons[i] || featureIcons[0]
                return (
                  <div key={f.title} className="glass-card rounded-2xl p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${bg}`}>
                      <FeatIcon className={`text-xl ${color}`} />
                    </div>
                    <h3 className="text-ink font-bold text-sm mb-1.5">{f.title}</h3>
                    <p className="text-ink-2 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ── PRICING ─────────────────────────────────────────────────────── */}
      <Section id="pricing" className="py-28" alt>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-5">{pricingData.tag}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              {pricingData.heading1} <span className="gradient-text">{pricingData.heading2}</span>
            </h2>
            <p className="text-ink-2 text-lg max-w-lg mx-auto">{pricingData.subtext}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(pricingData.plans || []).map((plan, i) => (
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
                  {(plan.features || []).map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <RiCheckLine className={`text-base mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-violet-300' : 'text-violet-500'}`} />
                      <span className={plan.highlight ? 'text-violet-100' : 'text-ink-2'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/leads" className={`py-3 rounded-xl font-bold text-sm text-center transition-all ${
                  plan.highlight ? 'bg-white text-violet-700 hover:bg-violet-50' : 'btn-ghost'
                }`}>
                  {pricingData.cta}
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
            <div className="section-tag mx-auto mb-5">{testimonialsData.tag}</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              {testimonialsData.heading1} <span className="gradient-text">{testimonialsData.heading2}</span>
            </h2>
            <p className="text-ink-2 text-lg">{testimonialsData.subtext}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(testimonialsData.items || []).map((t, idx) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 flex flex-col gap-4 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <RiDoubleQuotesL className="text-violet-300 text-4xl" />
                <p className="text-ink-2 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-0.5 my-1">
                  {[...Array(5)].map((_, j) => <HiStar key={j} className="text-amber-400 text-sm" />)}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-violet-50">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.grad || testimonialGrads[idx % testimonialGrads.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.initials || t.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
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
            <div className="section-tag mx-auto mb-5">{faqData.tag}</div>
            <h2 className="text-4xl font-extrabold text-ink mb-4 tracking-tight">
              {faqData.heading.split('questions')[0]}<span className="gradient-text">questions</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {(faqData.items || []).map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
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
                <RiFlashlightLine /> {cta.badge}
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
                {cta.heading1}<br />{cta.heading2}
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-md mx-auto">
                {cta.subtext}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="bg-white text-violet-700 font-bold rounded-2xl px-8 py-4 text-base hover:bg-violet-50 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2.5">
                  {cta.cta1} <RiArrowRightLine className="text-lg" />
                </Link>
                <Link to="/leads" className="border-2 border-white/30 text-white font-bold rounded-2xl px-8 py-4 text-base hover:bg-white/10 transition-all inline-flex items-center gap-2.5">
                  {cta.cta2}
                </Link>
              </div>
              <p className="text-violet-300 text-xs mt-6">{cta.footnote}</p>
            </div>
          </div>
        </div>
      </Section>

    </div>
  )
}
