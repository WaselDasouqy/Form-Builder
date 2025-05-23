'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/authContext'
import { supabase } from '@/lib/supabaseClient'

type FormData = {
  id: string
  title: string
  description: string | null
  type: string
  created_at: string
  questions: Array<{
    id: string
    title: string
    type: string
    required: boolean
    options: string[]
    position: number
  }>
}

type Submission = {
  id: string
  submitted_at: string
  answers: Array<{
    question_id: string
    value: string
  }>
}

type QuestionSummary = {
  questionId: string
  title: string
  type: string
  options?: string[]
  answers: {
    [value: string]: number
  }
  total: number
}

export default function FormResultsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState<FormData | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [summaries, setSummaries] = useState<QuestionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'summary' | 'responses'>('summary')

  useEffect(() => {
    async function fetchFormData() {
      if (!user) return

      try {
        // Check if the form belongs to the current user
        const { data: formData, error: formError } = await supabase
          .from('forms')
          .select('id, title, description, type, created_at')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single()

        if (formError) {
          if (formError.code === 'PGRST116') {
            setError('Form not found or you do not have permission to view it')
          } else {
            throw formError
          }
          return
        }

        // Fetch the form questions
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('id, title, type, required, options, position')
          .eq('form_id', params.id)
          .order('position', { ascending: true })

        if (questionsError) throw questionsError

        // Fetch submissions
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('submissions')
          .select('id, submitted_at')
          .eq('form_id', params.id)
          .order('submitted_at', { ascending: false })

        if (submissionsError) throw submissionsError

        // Fetch all answers
        const { data: answersData, error: answersError } = await supabase
          .from('answers')
          .select('submission_id, question_id, value')
          .in(
            'submission_id',
            submissionsData.map(s => s.id)
          )

        if (answersError) throw answersError

        // Process submissions with their answers
        const processedSubmissions = submissionsData.map(submission => {
          const submissionAnswers = answersData.filter(
            answer => answer.submission_id === submission.id
          )
          return {
            id: submission.id,
            submitted_at: submission.submitted_at,
            answers: submissionAnswers.map(a => ({
              question_id: a.question_id,
              value: a.value
            }))
          }
        })

        // Generate summaries for each question
        const questionSummaries = questions.map(question => {
          const summary: QuestionSummary = {
            questionId: question.id,
            title: question.title,
            type: question.type,
            options: question.type === 'multiple_choice' ? question.options : undefined,
            answers: {},
            total: 0
          }

          // Count answers for this question
          const questionAnswers = answersData.filter(a => a.question_id === question.id)
          questionAnswers.forEach(answer => {
            try {
              let value = answer.value
              
              // Handle multiple choice answers (stored as JSON strings)
              if (question.type === 'multiple_choice') {
                const choices = JSON.parse(answer.value)
                if (Array.isArray(choices)) {
                  choices.forEach(choice => {
                    summary.answers[choice] = (summary.answers[choice] || 0) + 1
                  })
                  summary.total++
                  return
                }
              }
              
              // Text answers
              summary.answers[value] = (summary.answers[value] || 0) + 1
              summary.total++
            } catch (e) {
              console.error('Error processing answer:', e)
            }
          })

          return summary
        })

        setForm({ ...formData, questions })
        setSubmissions(processedSubmissions)
        setSummaries(questionSummaries)
      } catch (error) {
        console.error('Error fetching form data:', error)
        setError('Failed to load form data')
      } finally {
        setLoading(false)
      }
    }

    fetchFormData()
  }, [params.id, user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading form data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>Form not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{form.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {submissions.length} {submissions.length === 1 ? 'response' : 'responses'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/forms/${form.id}`}
            target="_blank"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View Form
          </Link>
          <Link
            href={`/dashboard/forms/${form.id}/edit`}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Edit Form
          </Link>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No responses yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Share your form to collect responses.
          </p>
          <div className="flex justify-center">
            <div className="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 w-full max-w-md">
              <input
                type="text"
                value={typeof window !== 'undefined' ? `${window.location.origin}/forms/${form.id}` : ''}
                readOnly
                className="bg-transparent border-none w-full text-sm focus:outline-none dark:text-white"
              />
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(`${window.location.origin}/forms/${form.id}`)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  viewMode === 'summary'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('summary')}
              >
                Summary
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  viewMode === 'responses'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setViewMode('responses')}
              >
                Individual Responses
              </button>
            </div>

            {viewMode === 'summary' ? (
              <div className="p-4 space-y-8">
                {summaries.map((summary) => (
                  <div key={summary.questionId} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <h3 className="text-lg font-medium mb-2">{summary.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {summary.total} {summary.total === 1 ? 'response' : 'responses'}
                    </p>

                    {summary.type === 'multiple_choice' && summary.options ? (
                      <div className="space-y-3">
                        {summary.options.map((option) => {
                          const count = summary.answers[option] || 0
                          const percentage = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0
                          
                          return (
                            <div key={option} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{option}</span>
                                <span>
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                        {Object.keys(summary.answers).length > 0 ? (
                          <ul className="space-y-2">
                            {Object.entries(summary.answers).map(([value, count], index) => (
                              <li key={index} className="text-sm">
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded mr-2">
                                  {count}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{value}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">No responses</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">
                        Response #{submissions.indexOf(submission) + 1}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(submission.submitted_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {form.questions.map((question) => {
                        const answer = submission.answers.find(
                          (a) => a.question_id === question.id
                        )
                        let displayValue = answer?.value || 'No answer'

                        // Format multiple choice answers
                        if (question.type === 'multiple_choice' && answer) {
                          try {
                            const choices = JSON.parse(answer.value)
                            if (Array.isArray(choices)) {
                              displayValue = choices.join(', ')
                            }
                          } catch (e) {
                            console.error('Error parsing multiple choice answer:', e)
                          }
                        }

                        return (
                          <div key={question.id} className="border-t border-gray-100 dark:border-gray-800 pt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {question.title}
                            </h4>
                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                              {displayValue}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
} 