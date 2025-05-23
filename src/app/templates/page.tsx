'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Footer } from '@/components/Footer'

// Template Card Component
const TemplateCard = ({ template, index }: { template: any, index: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  // Get the appropriate form URL based on category or ID
  const getFormUrl = () => {
    // For specific form categories, route to dedicated pages
    if (template.category === 'Medical') {
      return '/forms/medical'
    } else if (template.category === 'Booking') {
      return '/forms/booking'
    } else if (template.category === 'Business' && template.id === 'contact') {
      return '/forms/business'
    } else if (template.category === 'Marketing' && template.id === 'subscription') {
      return '/forms/marketing'
    } else if (template.category === 'Events' && template.id === 'event-registration') {
      return '/forms/events'
    }
    
    // Default to the template ID route
    return `/templates/${template.id}`
  }
  
  return (
    <motion.div
      ref={ref}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          {template.preview}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {template.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 h-20 line-clamp-3">
          {template.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {template.category}
          </span>
          <Button size="sm" href={getFormUrl()}>
            Use Template
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const [filter, setFilter] = useState('all')
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  
  // Mock templates data
  const templates = [
    {
      id: 'contact',
      title: 'Contact Form',
      description: 'A simple contact form with name, email, and message fields. Perfect for websites that need a straightforward way for visitors to reach out.',
      category: 'Business',
      preview: (
        <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9 6 9-6" />
        </svg>
      )
    },
    {
      id: 'customer-feedback',
      title: 'Customer Feedback',
      description: 'Collect detailed feedback from customers about your products or services. Includes rating scales and open-ended questions.',
      category: 'Feedback',
      preview: (
        <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 'event-registration',
      title: 'Event Registration',
      description: 'A comprehensive form for event registrations. Collects attendee information, preferences, and handles payment information securely.',
      category: 'Events',
      preview: (
        <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'job-application',
      title: 'Job Application',
      description: 'A professional job application form with fields for experience, education, and file uploads for resumes and cover letters.',
      category: 'Business',
      preview: (
        <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'survey',
      title: 'Customer Survey',
      description: 'A detailed survey to gather customer insights. Features multiple question types including multiple choice, ratings, and open-ended questions.',
      category: 'Feedback',
      preview: (
        <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 'subscription',
      title: 'Newsletter Subscription',
      description: 'A simple form for newsletter subscriptions. Collects email and preferences for content categories.',
      category: 'Marketing',
      preview: (
        <svg className="w-24 h-24 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]
  
  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category.toLowerCase() === filter.toLowerCase())
    
  const categories = ['all', ...new Set(templates.map(t => t.category.toLowerCase()))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-28 pb-16 px-4 md:px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
      >
        <motion.div 
          className="container mx-auto max-w-5xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Form Templates
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose from our professionally designed templates to quickly create beautiful, effective forms for any purpose.
          </p>
        </motion.div>
      </section>
      
      {/* Filters Section */}
      <section className="py-6 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  filter === category 
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Templates Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <TemplateCard key={template.id} template={template} index={index} />
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                No templates found for this category
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Try selecting a different category or check back later
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your custom form?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-3xl mx-auto">
            Create your own custom form from scratch with our powerful drag-and-drop form builder.
          </p>
          <Button 
            href="/dashboard/forms/new" 
            size="lg"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            Create Custom Form
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
} 