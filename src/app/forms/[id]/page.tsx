'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type FormData = {
  id: string
  title: string
  description: string | null
  questions: Array<{
    id: string
    title: string
    type: string
    required: boolean
    options: string[]
    position: number
  }>
}

type FormAnswers = {
  [questionId: string]: string | string[]
}

export default function PublicFormPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<FormData | null>(null)
  const [answers, setAnswers] = useState<FormAnswers>({})
  const [errors, setErrors] = useState<{ [questionId: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchForm() {
      try {
        // Fetch the form
        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('id, title, description')
          .eq('id', params.id)
          .single()

        if (formError) throw formError

        // Fetch the form questions
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('id, title, type, required, options, position')
          .eq('form_id', params.id)
          .order('position', { ascending: true })

        if (questionsError) throw questionsError

        setForm({
          ...formData,
          questions: questions
        })

        // Initialize answers object
        const initialAnswers: FormAnswers = {}
        questions.forEach(question => {
          initialAnswers[question.id] = question.type === 'multiple_choice' ? [] : ''
        })
        setAnswers(initialAnswers)
      } catch (error) {
        console.error('Error fetching form:', error)
        setFormError('Form not found or no longer available')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchForm()
    }
  }, [params.id])

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] as string[]
      let newAnswers: string[]

      if (checked) {
        newAnswers = [...currentAnswers, option]
      } else {
        newAnswers = currentAnswers.filter(item => item !== option)
      }

      return { ...prev, [questionId]: newAnswers }
    })

    // Clear error when user makes a selection
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleRadioChange = (questionId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: [option]
    }))

    // Clear error when user makes a selection
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    if (!form) return false

    const newErrors: { [questionId: string]: string } = {}
    let isValid = true

    form.questions.forEach(question => {
      if (question.required) {
        const answer = answers[question.id]
        
        if (question.type === 'text' && (!answer || (answer as string).trim() === '')) {
          newErrors[question.id] = 'This field is required'
          isValid = false
        }
        
        if (question.type === 'multiple_choice' && (!answer || (answer as string[]).length === 0)) {
          newErrors[question.id] = 'Please select at least one option'
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create the submission record
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          form_id: params.id,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (submissionError) throw submissionError

      // Prepare the answers to insert
      const answersToInsert = Object.entries(answers).map(([questionId, value]) => ({
        submission_id: submission.id,
        question_id: questionId,
        value: typeof value === 'string' ? value : JSON.stringify(value)
      }))

      // Insert all answers
      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersToInsert)

      if (answersError) throw answersError

      setSubmitSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ general: 'Failed to submit the form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400">Loading form...</p>
        </div>
      </div>
    )
  }

  if (formError) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{formError}</p>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-md text-center">
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="mb-6">Your response has been successfully submitted.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Form not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600 dark:text-gray-300">{form.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.questions.map((question) => (
          <div
            key={question.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="mb-4">
              <label className="block text-lg font-medium mb-1">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>

            {question.type === 'text' ? (
              <div>
                <textarea
                  value={answers[question.id] as string}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  className={`w-full border rounded-md p-3 h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors[question.id] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Type your answer here..."
                />
                {errors[question.id] && (
                  <p className="mt-1 text-red-500 text-sm">{errors[question.id]}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`option-${question.id}-${index}`}
                      type="checkbox"
                      checked={(answers[question.id] as string[]).includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(question.id, option, e.target.checked)
                      }
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`option-${question.id}-${index}`}
                      className="ml-2 block text-gray-700 dark:text-gray-300"
                    >
                      {option}
                    </label>
                  </div>
                ))}
                {errors[question.id] && (
                  <p className="mt-1 text-red-500 text-sm">{errors[question.id]}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>{errors.general}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
} 