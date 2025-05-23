'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/authContext'
import { supabase } from '@/lib/supabaseClient'

type Form = {
  id: string
  title: string
  description: string | null
  type: string
  created_at: string
  response_count: number
}

export default function FormsList() {
  const { user } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadForms() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('forms')
          .select(`
            id,
            title,
            description,
            type,
            created_at,
            submissions(count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        const transformedForms = data.map(form => ({
          id: form.id,
          title: form.title,
          description: form.description,
          type: form.type,
          created_at: form.created_at,
          response_count: form.submissions?.length || 0
        }))

        setForms(transformedForms)
      } catch (error) {
        console.error('Error loading forms:', error)
      } finally {
        setLoading(false)
      }
    }

    loadForms()
  }, [user])

  const deleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form? All responses will be deleted.')) {
      return
    }

    try {
      // Delete the form - Supabase cascading delete will handle related data
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Update the local state
      setForms(forms.filter(form => form.id !== id))
    } catch (error) {
      console.error('Error deleting form:', error)
      alert('Failed to delete the form. Please try again.')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading forms...</div>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <Link
          href="/dashboard/forms/new"
          className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Form
        </Link>
      </div>

      {forms.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Form
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Responses
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {forms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {form.title}
                          </div>
                          {form.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {form.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {form.type || 'Survey'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(form.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {form.response_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/forms/${form.id}`}
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/forms/${form.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Results
                        </Link>
                        <Link
                          href={`/dashboard/forms/${form.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteForm(form.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No forms yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first form to start collecting responses from your users.
          </p>
          <Link
            href="/dashboard/forms/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Form
          </Link>
        </div>
      )}
    </div>
  )
} 