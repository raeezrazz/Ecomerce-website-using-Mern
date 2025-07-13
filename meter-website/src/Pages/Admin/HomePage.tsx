// File: src/components/admin/Sidebar.tsx
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '../../lib/utils'

const links = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'ph:grid-four-duotone' },
  { name: 'Users', path: '/admin/users', icon: 'ph:users-duotone' },
  { name: 'Products', path: '/admin/products', icon: 'ph:shopping-bag-duotone' },
  { name: 'Analytics', path: '/admin/analytics', icon: 'ph:chart-line-up-duotone' },
  { name: 'Messages', path: '/admin/messages', icon: 'ph:chats-teardrop-duotone' },
]

export default function HomePage() {
  const { pathname } = useLocation()

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed h-screen w-72 p-5 border-r border-white/10 bg-gradient-to-b from-black to-gray-950 backdrop-blur-lg"
    >
      {/* Logo with glow effect */}
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="relative">
          <div className="absolute -inset-3 bg-blue-500/30 rounded-full blur-md" />
          <Icon 
            icon="ph:lightning-duotone" 
            className="relative text-3xl text-blue-400" 
          />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          RS METER
        </h1>
      </div>

      {/* Navigation with 3D hover effect */}
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              'group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
              pathname === link.path 
                ? 'bg-white/5 text-white shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={cn(
                'p-2 rounded-lg bg-gradient-to-br',
                pathname === link.path
                  ? 'from-blue-500 to-cyan-400 text-white'
                  : 'from-gray-800 to-gray-900 group-hover:from-blue-900/50 group-hover:to-blue-800/50'
              )}
            >
              <Icon icon={link.icon} className="text-xl" />
            </motion.span>
            
            <span className="font-medium">{link.name}</span>
            
            {pathname === link.path && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 h-full w-1 bg-blue-400 rounded-r-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Floating user card */}
      <div className="absolute bottom-6 left-5 right-5">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 p-4 border border-gray-800">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/20 blur-xl" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Icon icon="ph:user-duotone" className="text-lg text-white" />
            </div>
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-xs text-gray-400">superuser@rsmeter.com</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}