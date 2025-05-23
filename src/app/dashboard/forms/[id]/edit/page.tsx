'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import { supabase } from '@/lib/supabaseClient'

type QuestionType = 'text' | 'multiple_choice'

interface Question {
  id: string
  type: QuestionType
  title: string
  required: boolean
  options?: string[]
  position: number
  form_id: string
  // Add this to track if it's a new question (not in DB yet)
  isNew?: boolean
}

export default function EditFormPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState('survey')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFormData() {
      if (!user) return

      try {
        // Check if the form belongs to the current user
        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('id, title, description, type')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (formError) {
          if (formError.code === 'PGRST116') {
            setError('Form not found or you do not have permission to edit it')
          } else {
            throw formError
          }
          return
        }

        // Fetch the form questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('id, title, type, required, options, position, form_id')
          .eq('form_id', params.id)
          .order('position', { ascending: true })

        if (questionsError) throw questionsError

        setFormTitle(formData.title)
        setFormDescription(formData.description || '')
        setFormType(formData.type)
        setQuestions(questionsData)
      } catch (error) {
        console.error('Error loading form data:', error)
        setError('Failed to load form data')
      } finally {
        setLoading(false)
      }
    }

    loadFormData()
  }, [params.id, user])

  // Add a new question to the form
  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `new_${Date.now()}`,
      type,
      title: '',
      required: false,
      options: type === 'multiple_choice' ? ['Option 1'] : undefined,
      position: questions.length,
      form_id: params.id as string,
      isNew: true
    }
    setQuestions([...questions, newQuestion])
  }

  // Update a question's properties
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, ...updates } : q)))
  }

  // Remove a question from the form
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  // Add an option to a multiple choice question
  const addOption = (questionId: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const options = [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`]
          return { ...q, options }
        }
        return q
      })
    )
  }

  // Remove an option from a multiple choice question
  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options) {
          const options = q.options.filter((_, index) => index !== optionIndex)
          return { ...q, options }
        }
        return q
      })
    )
  }

  // Update an option's text
  const updateOption = (questionId: string, optionIndex: number, text: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options) {
          const options = [...q.options]
          options[optionIndex] = text
          return { ...q, options }
        }
        return q
      })
    )
  }

  // Save the form to Supabase
  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formTitle.trim()) {
      setError('Form title is required')
      return
    }

    if (questions.length === 0) {
      setError('You need to add at least one question')
      return
    }

    // Validate that all questions have titles
    for (const question of questions) {
      if (!question.title.trim()) {
        setError('All questions must have a title')
        return
      }
      
      // For multiple choice, ensure there are at least 2 options
      if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
        setError('Multiple choice questions must have at least 2 options')
        return
      }
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Update the form
      const { error: formError } = await supabase
        .from('forms')
        .update({
          title: formTitle,
          description: formDescription,
          type: formType,
        })
        .eq('id', params.id)

      if (formError) throw formError

      // Find questions to add, update, or delete
      const existingQuestions = questions.filter(q => !q.isNew)
      const newQuestions = questions.filter(q => q.isNew)
      
      // Get IDs of questions that should remain in the database
      const remainingIds = existingQuestions.map(q => q.id)
      
      // Delete questions that are no longer in the form
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('form_id', params.id)
        .not('id', 'in', remainingIds.length > 0 ? remainingIds : ['dummy-id'])

      if (deleteError) throw deleteError

      // Update existing questions
      for (const question of existingQuestions) {
        const { error: updateError } = await supabase
          .from('questions')
          .update({
            title: question.title,
            type: question.type,
            required: question.required,
            options: question.options || [],
            position: questions.indexOf(question)
          })
          .eq('id', question.id)

        if (updateError) throw updateError
      }

      // Insert new questions
      if (newQuestions.length > 0) {
        const questionsToInsert = newQuestions.map((q, i) => ({
          form_id: params.id,
          title: q.title,
          type: q.type,
          required: q.required,
          options: q.options || [],
          position: existingQuestions.length + i
        }))

        const { error: insertError } = await supabase
          .from('questions')
          .insert(questionsToInsert)

        if (insertError) throw insertError
      }

      // Redirect to the form's detail page
      router.push(`/dashboard/forms/${params.id}`)
    } catch (err: any) {
      console.error('Error updating form:', err)
      setError(err.message || 'Failed to update form')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading form data...</div>
  }

  if (error && error.includes('permission')) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Form</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={saveForm} className="space-y-8">
        {/* Form details section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Form Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="formTitle" className="block text-sm font-medium mb-1">
                Form Title <span className="text-red-500">*</span>
              </label>
              <input
                id="formTitle"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md p-2"
                placeholder="e.g., Customer Feedback Survey"
                required
              />
            </div>

            <div>
              <label htmlFor="formDescription" className="block text-sm font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                id="formDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md p-2 h-24"
                placeholder="Describe what this form is for..."
              />
            </div>

            <div>
              <label htmlFor="formType" className="block text-sm font-medium mb-1">
                Form Type
              </label>
              <select
                id="formType"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md p-2"
              >
                <option value="survey">Survey</option>
                <option value="registration">Registration</option>
                <option value="contact">Contact Form</option>
                <option value="quiz">Quiz</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Questions</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => addQuestion('text')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              >
                Add Text Question
              </button>
              <button
                type="button"
                onClick={() => addQuestion('multiple_choice')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Add Multiple Choice
              </button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No questions yet. Use the buttons above to add questions to your form.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-500 dark:text-gray-400">
                        {index + 1}.
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {question.type === 'text' ? 'Text' : 'Multiple Choice'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Question Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={question.title}
                        onChange={(e) =>
                          updateQuestion(question.id, { title: e.target.value })
                        }
                        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md p-2"
                        placeholder="Enter your question here"
                        required
                      />
                    </div>

                    {question.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium mb-1">Options</label>
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(question.id, optionIndex, e.target.value)
                              }
                              className="flex-1 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md p-2"
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="text-red-500 hover:text-red-700"
                              disabled={question.options?.length === 1}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    <div className="flex items-center">
                      <input
                        id={`required-${question.id}`}
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) =>
                          updateQuestion(question.id, { required: e.target.checked })
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`required-${question.id}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
} 