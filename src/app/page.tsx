// app/page.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import '../app/globals.css'

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [scrollY, setScrollY] = useState(0)
  
  // References for scroll animations
  const featuresSectionRef = useRef(null)
  const statsSectionRef = useRef(null)
  const testimonialsSectionRef = useRef(null)
  const heroRef = useRef(null)
  
  // Check if sections are in view
  const isFeaturesInView = useInView(featuresSectionRef, { once: true, amount: 0.2 })
  const isStatsInView = useInView(statsSectionRef, { once: true, amount: 0.3 })
  const isTestimonialsInView = useInView(testimonialsSectionRef, { once: true, amount: 0.3 })
  const isHeroInView = useInView(heroRef, { once: true })
  
  // Scroll-based transformations
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
        setIsConnected(error ? false : true)
      } catch (err) {
        setIsConnected(false)
        console.error('Supabase connection error:', err)
      }
    }

    testConnection()

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const parallaxValue = -scrollY * 0.15

  // Stats data
  const stats = [
    { value: '10K+', label: 'Forms Created' },
    { value: '1M+', label: 'Form Submissions' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '200+', label: 'Template Options' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-indigo-400/5 dark:bg-indigo-400/10 blur-2xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            ref={heroRef}
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <motion.div className="mb-6" variants={itemVariants}>
              <span className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full inline-block mb-2">
                New: AI form suggestions now available
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-primary">
                Create Beautiful Forms in Minutes
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Build responsive forms with our drag-and-drop builder, collect submissions, and analyze results — all in one place.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              variants={itemVariants}
            >
              <Button 
                href="/auth/signup" 
                size="lg"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              >
                Get Started for Free
              </Button>
              <Button 
                href="#features" 
                size="lg" 
                variant="outline"
              >
                See how it works
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Browser frame mockup */}
          <motion.div 
            className="relative rounded-2xl shadow-2xl mx-auto bg-white dark:bg-gray-800 overflow-hidden max-w-5xl border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ transform: `translateY(${-parallaxValue * 0.5}px)` }}
          >
            {/* Browser header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-grow mx-auto max-w-sm">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-6 px-3 text-xs flex items-center justify-center text-gray-600 dark:text-gray-300">
                  formwave.app/forms/example
                </div>
              </div>
            </div>
            
            {/* Form preview */}
            <div className="px-6 py-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Customer Feedback Form
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                    We value your feedback! Please help us improve our service by filling out this short form.
                  </p>
                </div>
                
                {/* Form fields */}
                <div className="space-y-6 max-w-xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                      placeholder="johndoe@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      How would you rate your experience?
                    </label>
                    <div className="flex justify-between items-center">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button key={num} className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-medium hover:border-primary hover:text-primary transition-colors">
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Comments
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-20"
                      placeholder="Share your thoughts with us..."
                      rows={4}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-center">
                    <button className="bg-primary hover:bg-primary-light text-white font-medium rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200">
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section ref={statsSectionRef} className="py-20 px-4 md:px-6 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.h3 
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ scale: 0.8 }}
                  animate={isStatsInView ? { scale: 1 } : { scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {stat.value}
                </motion.h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" ref={featuresSectionRef} className="py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              Everything You Need to Create Amazing Forms
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Powerful features to help you build and manage forms with ease
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Drag-and-Drop Builder",
                description: "Create forms visually without writing a single line of code.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )
              },
              {
                title: "AI Form Suggestions",
                description: "Get intelligent suggestions based on your form's purpose and content.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Beautiful Templates",
                description: "Start with professionally designed templates for any purpose.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )
              },
              {
                title: "Advanced Logic",
                description: "Create conditional logic for smarter, more personalized forms.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )
              },
              {
                title: "Form Analytics",
                description: "Gain insights with detailed submission and performance analytics.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: "Smart Integrations",
                description: "Connect with your favorite tools including Slack, Zapier, and Google Sheets.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsSectionRef} className="py-24 px-4 md:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what our customers have to say about FormWave
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "FormWave transformed how we collect customer feedback. The interface is intuitive, and the analytics help us make data-driven decisions.",
                author: "Sarah Johnson",
                role: "Product Manager at TechCorp",
                image: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                quote: "We've tried many form builders, but FormWave stands out with its powerful features and ease of use. Our conversion rates have increased by 35%.",
                author: "Michael Chen",
                role: "Marketing Director at GrowthLabs",
                image: "https://randomuser.me/api/portraits/men/46.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-600"
                initial={{ opacity: 0, y: 30 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <svg className="w-12 h-12 text-primary/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                    <img src={testimonial.image} alt={testimonial.author} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-indigo-600 to-primary-light text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build amazing forms?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users creating beautiful, functional forms with FormWave.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              href="/auth/signup" 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Get Started for Free
            </Button>
            <Button 
              href="/templates" 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Browse Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
