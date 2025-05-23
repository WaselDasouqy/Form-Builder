'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import { supabase } from '@/lib/supabaseClient'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { FormBuilder } from '@/components/FormBuilder/FormBuilder'
import { FormField } from '@/components/FormBuilder/DraggableField'

export default function CreateFormPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState('survey')
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'details' | 'builder'>('details')

  // Handle moving to the builder step
  const handleContinueToBuilder = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formTitle.trim()) {
      setError('Form title is required')
      return
    }

    setError('')
    setStep('builder')
  }

  // Save the form to Supabase
  const saveForm = async () => {
    if (!formTitle.trim()) {
      setError('Form title is required')
      return
    }

    if (formFields.length === 0) {
      setError('You need to add at least one field')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Insert the form
      const { data: formData, error: formError } = await supabase
        .from('forms')
        .insert({
          title: formTitle,
          description: formDescription,
          type: formType,
          user_id: user.id,
          settings: {}
        })
        .select()
        .single()

      if (formError) throw formError

      // Convert form fields to questions format for database
      const questionsToInsert = formFields.map((field, index) => ({
        form_id: formData.id,
        title: field.label,
        type: field.type === 'textarea' ? 'text' : field.type, // Map textarea to text type in DB
        required: field.required,
        options: field.options || [],
        position: index
      }))

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)

      if (questionsError) throw questionsError

      // Redirect to the form's detail page
      router.push(`/dashboard/forms/${formData.id}`)
    } catch (err: any) {
      console.error('Error creating form:', err)
      setError(err.message || 'Failed to create form')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {step === 'details' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Form</h1>
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Form Details</h2>
            <form onSubmit={handleContinueToBuilder} className="space-y-4">
              <Input
                label="Form Title"
                id="formTitle"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Customer Feedback Survey"
                required
                hint="This will be displayed as the title of your form"
              />

              <Textarea
                label="Description (optional)"
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe what this form is for..."
                hint="This helps your users understand the purpose of the form"
                autoResize
              />

              <div>
                <label htmlFor="formType" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Form Type
                </label>
                <select
                  id="formType"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="input-field"
                >
                  <option value="survey">Survey</option>
                  <option value="registration">Registration</option>
                  <option value="contact">Contact Form</option>
                  <option value="quiz">Quiz</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button type="submit">
                  Continue to Form Builder
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{formTitle}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Drag and drop fields to build your form</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('details')}
              >
                Back to Details
              </Button>
              <Button
                onClick={saveForm}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Form'}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <FormBuilder 
              onSave={(fields) => {
                setFormFields(fields)
                saveForm()
              }}
              initialFields={formFields}
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
} 