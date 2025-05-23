'use client'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

type PageLayoutProps = {
  children: React.ReactNode
  title: string
  subtitle?: string
  backgroundClass?: string
}

export const PageLayout = ({ 
  children, 
  title, 
  subtitle,
  backgroundClass = "from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
}: PageLayoutProps) => {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`pt-28 pb-16 px-4 md:px-6 bg-gradient-to-br ${backgroundClass}`}
      >
        <motion.div 
          className="container mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </section>
      
      {/* Content Section */}
      <section className="py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          {children}
        </div>
      </section>
      
      <Footer />
    </div>
  )
} 