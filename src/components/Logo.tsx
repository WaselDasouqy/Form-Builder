'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Logo = ({ 
  size = 'default',
  includeLink = false 
}: { 
  size?: 'small' | 'default' | 'large',
  includeLink?: boolean
}) => {
  const logoSize = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-3xl',
  }

  const iconSize = {
    small: 'w-7 h-7',
    default: 'w-8 h-8',
    large: 'w-10 h-10',
  }

  const LogoContent = () => (
    <div className="flex items-center gap-2 group">
      <motion.div
        className={`relative ${iconSize[size]} bg-gradient-to-br from-primary to-indigo-700 dark:from-indigo-600 dark:to-primary-light rounded-xl flex items-center justify-center overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white"
        >
          <path
            d="M15.5 7H8.5C8.22 7 8 7.22 8 7.5V8.5C8 8.78 8.22 9 8.5 9H15.5C15.78 9 16 8.78 16 8.5V7.5C16 7.22 15.78 7 15.5 7Z"
            fill="currentColor"
          />
          <path
            d="M16.5 11H7.5C7.22 11 7 11.22 7 11.5V12.5C7 12.78 7.22 13 7.5 13H16.5C16.78 13 17 12.78 17 12.5V11.5C17 11.22 16.78 11 16.5 11Z"
            fill="currentColor"
          />
          <path
            d="M14.5 15H9.5C9.22 15 9 15.22 9 15.5V16.5C9 16.78 9.22 17 9.5 17H14.5C14.78 17 15 16.78 15 16.5V15.5C15 15.22 14.78 15 14.5 15Z"
            fill="currentColor"
          />
          <path
            d="M18.85 3.35L17.15 1.65C16.76 1.26 16.02 1 15.5 1H5C3.34 1 2 2.34 2 4V20C2 21.66 3.34 23 5 23H19C20.66 23 22 21.66 22 20V6.5C22 5.98 21.74 5.24 21.35 4.85L18.85 3.35ZM17 2.70C17.05 2.74 17.1 2.79 17.15 2.85L18.65 4.35C18.69 4.39 18.75 4.44 18.8 4.5H17V2.70ZM20 20C20 20.55 19.55 21 19 21H5C4.45 21 4 20.55 4 20V4C4 3.45 4.45 3 5 3H15V5C15 6.10 15.9 7 17 7H20V20Z"
            fill="currentColor"
          />
        </motion.svg>
        
        {/* Animated dot accent */}
        <motion.div 
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/90"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        />
      </motion.div>
      
      <motion.div
        className={`font-bold ${logoSize[size]} text-gray-900 dark:text-white tracking-tight`}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <span className="bg-gradient-to-r from-primary to-primary-light dark:from-indigo-400 dark:to-primary bg-clip-text text-transparent">Form</span>
        <span>Wave</span>
        <motion.span 
          className="inline-block text-primary ml-0.5"
          animate={{ 
            y: [0, -3, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: 'loop',
            ease: 'easeInOut',
            repeatDelay: 3,
            type: 'tween'
          }}
        >
          ~
        </motion.span>
      </motion.div>
    </div>
  )

  // Return with or without link wrapper based on prop
  return includeLink ? (
    <Link href="/">
      <LogoContent />
    </Link>
  ) : (
    <LogoContent />
  )
} 