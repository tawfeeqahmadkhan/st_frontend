import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Floating 3D orb
function Orb({ size, color, x, y, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color, filter: 'blur(80px)', opacity: 0.35 }}
      animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// Small floating particle
function Particle({ x, y, delay, size = 4 }) {
  return (
    <motion.div
      className="absolute rounded-full bg-violet-400/30 pointer-events-none"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -60, 0], opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// 3D grid lines
function GridLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 0%, transparent 80%)',
      }}
    />
  )
}

// Animated ring
function Ring({ size, x, y, delay, color = 'rgba(124,58,237,0.12)' }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none border"
      style={{ width: size, height: size, left: x, top: y, borderColor: color, marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.2, 0.05, 0.2], rotate: [0, 180, 360] }}
      transition={{ duration: 8 + Math.random() * 4, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// Floating card
function FloatingMiniCard({ x, y, delay, title, value, color }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -18, 0], rotate: [-1.5, 1.5, -1.5] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="bg-white/80 backdrop-blur-xl border border-violet-100 rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgba(124,58,237,0.15)]"
        style={{ transform: 'perspective(600px) rotateX(5deg) rotateY(-5deg)' }}
      >
        <p className="text-ink-3 text-[10px] font-bold uppercase tracking-wider mb-0.5">{title}</p>
        <p className={`font-extrabold text-lg ${color}`}>{value}</p>
      </div>
    </motion.div>
  )
}

// Shooting star — use consistent pixel values (no mixed % / vw)
function ShootingStar({ delay, topPct, repeatDelay }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: `${topPct}%`,
        left: 0,
        width: 140,
        height: 1.5,
        background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.55), transparent)',
        borderRadius: 2,
      }}
      animate={{ x: [-200, 1600], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, repeatDelay, ease: 'easeInOut' }}
    />
  )
}

export default function Background3D({ showCards = false }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* Grid */}
      <GridLines />

      {/* Main orbs */}
      <Orb size={600} color="radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(124,58,237,0.2) 50%, transparent 70%)" x="10%" y="-5%" delay={0} duration={20} />
      <Orb size={500} color="radial-gradient(circle, rgba(196,181,253,0.35) 0%, rgba(109,40,217,0.15) 50%, transparent 70%)" x="60%" y="20%" delay={3} duration={25} />
      <Orb size={400} color="radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(79,70,229,0.1) 50%, transparent 70%)" x="5%" y="60%" delay={6} duration={22} />
      <Orb size={350} color="radial-gradient(circle, rgba(196,181,253,0.25) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)" x="75%" y="70%" delay={2} duration={18} />

      {/* Accent orbs */}
      <Orb size={200} color="radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)" x="85%" y="15%" delay={4} duration={15} />
      <Orb size={180} color="radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)" x="20%" y="80%" delay={8} duration={17} />
      <Orb size={150} color="radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)" x="50%" y="90%" delay={5} duration={20} />

      {/* Rings */}
      <Ring size={500} x="15%" y="10%" delay={0} />
      <Ring size={350} x="80%" y="40%" delay={2} color="rgba(124,58,237,0.08)" />
      <Ring size={250} x="40%" y="70%" delay={4} color="rgba(79,70,229,0.1)" />

      {/* Particles */}
      {[...Array(20)].map((_, i) => (
        <Particle
          key={i}
          x={`${5 + Math.random() * 90}%`}
          y={`${10 + Math.random() * 80}%`}
          delay={i * 0.4}
          size={2 + Math.random() * 4}
        />
      ))}

      {/* Shooting stars */}
      <ShootingStar delay={2} topPct={12} repeatDelay={8} />
      <ShootingStar delay={9} topPct={25} repeatDelay={11} />
      <ShootingStar delay={16} topPct={18} repeatDelay={14} />

      {/* Floating 3D mini cards (only on hero) */}
      {showCards && (
        <>
          <FloatingMiniCard x="3%" y="35%" delay={0} title="New Lead" value="Mumbai" color="text-violet-600" />
          <FloatingMiniCard x="82%" y="55%" delay={2} title="Budget" value="₹25L+" color="text-emerald-600" />
          <FloatingMiniCard x="5%" y="65%" delay={4} title="Verified" value="100%" color="text-blue-600" />
        </>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-page to-transparent" />
    </div>
  )
}
