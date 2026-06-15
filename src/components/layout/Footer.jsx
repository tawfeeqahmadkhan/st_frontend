import { Link } from 'react-router-dom'
import { FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi'
import { RiMailLine, RiPhoneLine, RiMapPinLine, RiWhatsappLine } from 'react-icons/ri'
import { useCMS } from '../../context/CMSContext'
import logo from '../../public/logo.png'

const footerLinks = {
  Product: [{ label: 'Browse Leads', href: '/leads' }, { label: 'How It Works', href: '/#how-it-works' },  { label: 'Join as Designer', href: '/register' }],
  Legal: [{ label: 'Privacy Policy', href: '#' }, { label: 'Cookie Policy', href: '#' }],
}

export default function Footer() {
  const { cms } = useCMS()
  const footer = cms.footer
  const header = cms.header
  const social = cms.social || {}

  return (
    <>
    {/* WhatsApp Floating Button */}
    <a
      href="https://wa.me/918123084151"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.5)] hover:scale-110 hover:shadow-[0_6px_32px_rgba(37,211,102,0.7)] transition-all duration-300"
      title="Chat on WhatsApp"
    >
      <RiWhatsappLine className="text-white text-3xl" />
    </a>

    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Subtle violet glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src={logo} alt={`${header.brandName}${header.brandSuffix} logo`} className="w-20 h-20 object-contain rounded-xl" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {footer.tagline}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Product</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.Product.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/40 text-sm hover:text-violet-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Legal</h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.Legal.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/40 text-sm hover:text-violet-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              {[{ Icon: RiMailLine, text: footer.email }, { Icon: RiPhoneLine, text: footer.phone }, { Icon: RiMapPinLine, text: footer.address }].map(({ Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2 text-white/40 text-xs">
                  <Icon className="text-violet-400 text-sm flex-shrink-0 mt-0.5" />{text}
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">Follow Us</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { Icon: FiInstagram, label: 'Instagram', href: social.instagram || '#' },
                { Icon: FiLinkedin, label: 'LinkedIn', href: social.linkedin || '#' },
                { Icon: FiTwitter, label: 'Twitter', href: social.twitter || '#' },
                { Icon: FiYoutube, label: 'YouTube', href: social.youtube || '#' },
              ].map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 text-sm hover:text-violet-400 transition-colors">
                  <Icon className="text-sm" /> {label}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">{footer.copyright}</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-white/30 text-xs">All systems operational</span>
          </div>
          <p className="text-white/30 text-xs">Made with ♥ in India</p>
        </div>
      </div>
    </footer>
    </>
  )
}
