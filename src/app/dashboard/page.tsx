'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/Button'

type DashboardStats = {
  formCount: number
  responseCount: number
  recentForms: Array<{
    id: string
    title: string
    created_at: string
    response_count: number
  }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    formCount: 0,
    responseCount: 0,
    recentForms: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // In a real app, we'd fetch user data from Supabase
        // For demo purposes, let's use mock data
        setStats({
          formCount: 12,
          responseCount: 247,
          recentForms: [
            {
              id: '1',
              title: 'Customer Feedback Survey',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              response_count: 42
            },
            {
              id: '2',
              title: 'Product Registration Form',
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              response_count: 84
            },
            {
              id: '3',
              title: 'Event Registration',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              response_count: 121
            }
          ]
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back to your forms dashboard</p>
        </div>
        <Button 
          href="/dashboard/forms/new"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Create Form
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
              This Month
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Forms</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">{stats.formCount}</p>
              <span className="ml-2 text-sm font-medium text-green-500">+16%</span>
            </div>
          </div>
          <Link href="/dashboard/forms" className="mt-4 text-primary text-sm font-medium inline-flex items-center">
            View all forms
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
              This Month
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Responses</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">{stats.responseCount}</p>
              <span className="ml-2 text-sm font-medium text-green-500">+24%</span>
            </div>
          </div>
          <Link href="/dashboard/responses" className="mt-4 text-primary text-sm font-medium inline-flex items-center">
            View all responses
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow sm:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Response Rate</h3>
            <div className="flex items-center text-sm">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
              <span className="text-gray-600 dark:text-gray-400">This month</span>
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold inline-block text-primary">
                  65%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-500 dark:text-gray-400">
                  Target: 75%
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
              <p className="font-medium text-gray-800 dark:text-gray-200">245</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
              <p className="font-medium text-gray-800 dark:text-gray-200">159</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
              <p className="font-medium text-gray-800 dark:text-gray-200">86</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Abandoned</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Recent forms */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Forms</h2>
          <Link href="/dashboard/forms" className="text-sm text-primary font-medium hover:text-primary-light transition-colors">
            View all
          </Link>
        </div>
        
        {stats.recentForms.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentForms.map(form => (
              <div 
                key={form.id} 
                className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{form.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={form.created_at}>
                          {new Date(form.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                      </p>
                      <span className="text-sm font-medium text-primary bg-primary/5 rounded-full px-2.5 py-0.5 inline-flex items-center">
                        {form.response_count} responses
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-auto">
                  <Button
                    href={`/dashboard/forms/${form.id}/edit`}
                    variant="ghost"
                    size="sm"
                    icon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    href={`/dashboard/forms/${form.id}`}
                    variant="secondary"
                    size="sm"
                  >
                    View results
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No forms yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Get started by creating your first form to collect responses from your audience.
            </p>
            <Button 
              href="/dashboard/forms/new"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Create your first form
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
} 