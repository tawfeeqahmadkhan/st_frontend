import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const DEFAULT_CMS = {
  header: {
    brandName: 'Scale',
    brandSuffix: 'Studio',
    loginBtn: 'Login',
    joinBtn: 'Join as Designer',
  },
  hero: {
    badge: 'Scale Studio — Premium Lead Marketplace',
    heading1: 'Buy High-Quality',
    heading2: 'Design Leads',
    heading3: 'That Convert.',
    subtext: 'Verified homeowner enquiries with real budgets, project scope, and purchase-ready intent. Pay only for the leads you want.',
    cta1: 'Browse Leads',
    cta2: 'Join as Designer',
    socialProof: 'Trusted by 1,200+ designers',
    stat1Value: '12,00+', stat1Label: 'Monthly Leads',
    stat2Value: '5', stat2Label: 'Active Cities',
    stat3Value: '₹20Cr+', stat3Label: 'Project Value',
  },
  stats: [
    { value: '12,00+', label: 'Monthly Leads' },
    { value: '5', label: 'Active Cities' },
    { value: '4 min', label: 'Avg. Alert Time' },
    { value: '₹20Cr+', label: 'Project Value' },
  ],
  howItWorks: {
    tag: 'How It Works',
    heading: 'From signup to site visit — fast',
    subtext: 'No subscription needed. Buy only the leads you want, when you want them.',
    steps: [
      { title: 'Create Account', desc: 'Sign up free in 60 seconds — no credit card required.' },
      { title: 'Browse Verified Leads', desc: 'Filter by city, budget & project category to find ideal clients.' },
      { title: 'Buy a Lead Directly', desc: 'One-time fee per lead. No subscriptions, no hidden charges.' },
      { title: 'Contact the Client', desc: 'Get full details instantly. Call or email them right away.' },
      { title: 'Win the Project', desc: 'Book a site visit, show your portfolio, and close the deal.' },
    ],
  },
  whyUs: {
    tag: 'Why Scale Studio',
    heading1: 'Everything to grow',
    heading2: 'your design business',
    subtext: 'Built for interior designers who want a reliable, premium source of qualified client leads — without expensive subscriptions.',
    bullets: [
      'Pay per lead — from ₹299',
      'Full refund policy if unresponsive',
      'Instant client contact unlock',
      '48+ cities across India',
    ],
    cta: 'Start for Free',
    features: [
      { title: 'Verified Leads', desc: 'Every lead is manually verified before listing.' },
      { title: 'Instant Access', desc: 'Full client details unlocked the moment you purchase.' },
      { title: 'Secure Payments', desc: 'Bank-grade SSL encryption on every transaction.' },
      { title: 'Premium Projects', desc: 'High-budget clients from Tier-1 cities who are ready to hire.' },
      { title: 'Smart Filters', desc: 'Target by city, budget, and project specialty.' },
      { title: 'Dedicated Support', desc: 'Our team helps you close more deals, every step of the way.' },
    ],
  },
  pricing: {
    tag: 'Pricing',
    heading1: 'No subscriptions.',
    heading2: 'Buy per lead.',
    subtext: 'Pay a small one-time fee for each lead you want. Full contact details unlocked instantly.',
    cta: 'Browse Leads',
    plans: [
      { name: 'Starter', price: '₹299', perLead: 'per lead', features: ['All lead categories', 'Filter by city & budget', 'Instant contact unlock', 'Email support'] },
      { name: 'Buy Any Lead', tag: 'How It Works', price: '₹299–₹1499', perLead: 'one-time per lead', highlight: true, features: ['Pay only for what you want', 'No monthly subscription', 'Instant access to contact', 'Full refund policy', 'Priority alerts available'] },
      { name: 'Bulk Leads', tag: 'High Volume', price: 'Custom', perLead: 'negotiate the best rate', features: ['10+ leads / month', 'Dedicated account manager', 'Exclusive high-budget leads', 'Custom city targeting', 'Analytics dashboard'] },
    ],
  },
  testimonials: {
    tag: 'Testimonials',
    heading1: 'Designers love',
    heading2: 'Scale Studio',
    subtext: 'Real results from real designers across India.',
    items: [
      { name: 'Ravi Sharma', role: 'Senior Interior Designer', city: 'Mumbai', quote: "Scale Studio helped me get 3 new projects in my first month. The leads are genuinely verified — best ROI I've had.", result: '₹12L in new projects', initials: 'RS', grad: 'from-violet-400 to-purple-600' },
      { name: 'Priya Kapoor', role: 'Studio Owner', city: 'Delhi', quote: "The quality here is unlike anything else. Within 6 months I closed deals worth ₹45L+ through Scale Studio.", result: '₹45L+ closed', initials: 'PK', grad: 'from-pink-400 to-rose-600' },
      { name: 'Vikram Nair', role: 'Architect & Designer', city: 'Bangalore', quote: "Every single lead I purchased converted into at least a site visit. The targeting is spot-on. Highly recommended!", result: '8/10 leads converted', initials: 'VN', grad: 'from-blue-400 to-indigo-600' },
    ],
  },
  faq: {
    tag: 'FAQ',
    heading: 'Frequently asked questions',
    items: [
      { q: 'What types of design leads are available?', a: 'Full home interiors, modular kitchens, offices, restaurants, retail stores, individual rooms, landscape & exteriors, and 3D visualizations — across 48+ cities in India.' },
      { q: 'How are leads verified before listing?', a: 'Our team manually calls each lead to confirm identity, project scope, and budget before approval. Only genuine enquiries reach the marketplace.' },
      { q: "Can I get a refund if a lead doesn't respond?", a: 'Yes. If a client is unresponsive within 48 hours, you can raise a refund request within 7 days of purchase. Our team reviews each case within 24 hours.' },
      { q: 'How much does a lead cost?', a: 'Lead prices range from ₹299 to ₹1,499 depending on project budget size. You pay only for leads you want — no subscriptions, no lock-in.' },
      { q: 'How quickly do I get client details after purchase?', a: 'Instantly — full name, phone, email, and project requirements are unlocked the moment your purchase completes.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. 256-bit SSL encryption on all transactions. We do not store card details. Payments go through certified gateways.' },
    ],
  },
  ctaSection: {
    badge: 'Get Started Today — Free',
    heading1: 'Ready to grow your',
    heading2: 'design business?',
    subtext: 'Join 1,200+ designers closing projects every week with Scale Studio leads.',
    cta1: 'Join Free',
    cta2: 'Browse Leads',
    footnote: 'No subscription · Pay per lead · Cancel anytime',
  },
  footer: {
    tagline: 'The premium marketplace where top interior designers find high-quality, verified client leads.',
    email: 'hello@scalestudio.in',
    phone: '+91 98765 00000',
    address: 'Mumbai, Maharashtra',
    copyright: '© 2025 Scale Studio. All rights reserved.',
  },
  social: {
    instagram: '#',
    linkedin: '#',
    twitter: '#',
    youtube: '#',
  },
}

export const DEFAULT_LEAD_VISIBILITY = {
  public: {
    category: true, title: true, projectDescription: true,
    propertySize: true, budget: true, city: true, area: true,
    postedAt: true, price: true,
    clientName: false, clientPhone: false, clientEmail: false,
  },
  loggedIn: {
    category: true, title: true, projectDescription: true,
    propertySize: true, budget: true, city: true, area: true,
    postedAt: true, price: true,
    clientName: false, clientPhone: false, clientEmail: false,
  },
  purchased: {
    category: true, title: true, projectDescription: true,
    propertySize: true, budget: true, city: true, area: true,
    postedAt: true, price: true,
    clientName: true, clientPhone: true, clientEmail: true,
  },
}

const CMSContext = createContext({
  cms: DEFAULT_CMS,
  visibility: DEFAULT_LEAD_VISIBILITY,
  updateCMS: () => {},
  updateVisibility: () => {},
  cmsLoading: false,
})

export function CMSProvider({ children }) {
  const [cms, setCMS] = useState(DEFAULT_CMS)
  const [visibility, setVisibility] = useState(DEFAULT_LEAD_VISIBILITY)
  const [cmsLoading, setCMSLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/config/cms').then(r => setCMS(r.data)).catch(() => {}),
      api.get('/config/lead-visibility').then(r => setVisibility(r.data)).catch(() => {}),
    ]).finally(() => setCMSLoading(false))
  }, [])

  const updateCMS = async (newCMS) => {
    await api.put('/admin/cms', newCMS)
    setCMS(newCMS)
  }

  const updateVisibility = async (newVisibility) => {
    await api.put('/admin/lead-visibility', newVisibility)
    setVisibility(newVisibility)
  }

  return (
    <CMSContext.Provider value={{ cms, visibility, updateCMS, updateVisibility, cmsLoading }}>
      {children}
    </CMSContext.Provider>
  )
}

export const useCMS = () => useContext(CMSContext)
