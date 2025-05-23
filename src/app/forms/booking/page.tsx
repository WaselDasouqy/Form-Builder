'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FormRenderer } from '@/components/FormRenderer'
import { getFormTemplate, FormTemplate } from '@/lib/dataFetching'
import { Skeleton } from '@/components/Skeleton'

export default function BookingFormPage() {
  const [template, setTemplate] = useState<FormTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getFormTemplate('hotel-booking')
        if (data) {
          setTemplate(data)
        } else {
          setError('Booking form template not found')
        }
      } catch (err) {
        console.error('Error fetching booking form template:', err)
        setError('Failed to load template')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTemplate()
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Link 
              href="/templates" 
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to templates
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-400 dark:to-pink-400">
              Hotel Booking Form
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              A complete booking form for hotels, vacation rentals, and other accommodations.
            </p>
          </div>
          
          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-16 w-2/3 mx-auto rounded-xl" />
              <Skeleton className="h-96 max-w-3xl mx-auto rounded-xl" />
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {error}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                We couldn't load the booking form template.
              </p>
              <Link 
                href="/templates" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Browse all templates
              </Link>
            </div>
          ) : template ? (
            <div>
              <FormRenderer template={template} />
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 