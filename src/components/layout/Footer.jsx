import { Link } from 'react-router-dom'
import { FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi'
import { RiMailLine, RiPhoneLine, RiMapPinLine } from 'react-icons/ri'

const footerLinks = {
  Product: [{ label: 'Browse Leads', href: '/leads' }, { label: 'How It Works', href: '/#how-it-works' }, { label: 'Pricing', href: '/#pricing' }, { label: 'Join as Designer', href: '/register' }],
  Company: [{ label: 'About Us', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }],
  Support: [{ label: 'Help Center', href: '#' }, { label: 'Contact Us', href: '#' }, { label: 'Refund Policy', href: '#' }, { label: 'Report a Lead', href: '#' }],
  Legal: [{ label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }, { label: 'Cookie Policy', href: '#' }, { label: 'Disclaimer', href: '#' }],
}

export default function Footer() {
  return (
    <footer className="border-t border-violet-100 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12L8 4L14 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-ink font-extrabold text-lg">Scale<span className="text-violet-600">Studio</span></span>
            </Link>
            <p className="text-ink-2 text-sm leading-relaxed mb-6 max-w-xs">
              The premium marketplace where top interior designers find high-quality, verified client leads.
            </p>
            <div className="flex items-center gap-2.5 mb-6">
              {[FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-ink-3 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-100 transition-all">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {[{ Icon: RiMailLine, text: 'hello@scalestudio.in' }, { Icon: RiPhoneLine, text: '+91 98765 00000' }, { Icon: RiMapPinLine, text: 'Mumbai, Maharashtra' }].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-ink-3 text-xs">
                  <Icon className="text-violet-500 text-sm flex-shrink-0" />{text}
                </div>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-ink font-bold text-sm mb-4">{section}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-ink-3 text-sm hover:text-ink transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-violet-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ink-3 text-xs">© 2025 Scale Studio. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-ink-3 text-xs">All systems operational</span>
          </div>
          <p className="text-ink-3 text-xs">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
  )
}
