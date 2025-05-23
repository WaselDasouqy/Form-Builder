'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FormTemplate, FormField } from '@/lib/dataFetching'
import { Button } from './Button'
import { Input } from './Input'

export const FormRenderer = ({ template }: { template: FormTemplate }) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
    
    // In a real app, this would send the data to your backend
    // For now, we'll just simulate a success message
  }
  
  // Apply the theme
  const themeStyle = {
    '--primary-color': template.theme.primaryColor,
    '--background-color': template.theme.backgroundColor,
    '--text-color': template.theme.textColor,
    '--accent-color': template.theme.accentColor,
  } as React.CSSProperties
  
  // Render a specific field based on its type
  const renderField = (field: FormField) => {
    switch(field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
        return (
          <Input
            key={field.id}
            id={field.id}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            hint={field.description}
          />
        )
        
      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium mb-1" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              rows={4}
              style={{ 
                borderColor: `${template.theme.accentColor}40`,
                backgroundColor: `${template.theme.backgroundColor}`,
                color: template.theme.textColor
              }}
            />
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      case 'select':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium mb-1" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={field.id}
              required={field.required}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
              style={{ 
                borderColor: `${template.theme.accentColor}40`,
                backgroundColor: `${template.theme.backgroundColor}`,
                color: template.theme.textColor
              }}
            >
              <option value="">Select an option</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      case 'radio':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}-${option}`}
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    required={field.required}
                    className="mr-2"
                    style={{ accentColor: template.theme.primaryColor }}
                  />
                  <label 
                    htmlFor={`${field.id}-${option}`}
                    className="text-sm"
                    style={{ color: template.theme.textColor }}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      case 'checkbox':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(option => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.id}-${option}`}
                    name={field.id}
                    value={option}
                    checked={Array.isArray(formData[field.id]) ? formData[field.id]?.includes(option) : false}
                    onChange={(e) => {
                      const currentValues = Array.isArray(formData[field.id]) ? [...formData[field.id]] : []
                      if (e.target.checked) {
                        handleChange(field.id, [...currentValues, option])
                      } else {
                        handleChange(field.id, currentValues.filter(val => val !== option))
                      }
                    }}
                    className="mr-2"
                    style={{ accentColor: template.theme.primaryColor }}
                  />
                  <label 
                    htmlFor={`${field.id}-${option}`}
                    className="text-sm"
                    style={{ color: template.theme.textColor }}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      case 'file':
        return (
          <div key={field.id} className="mb-6">
            <label htmlFor={field.id} className="block text-sm font-medium mb-1" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              id={field.id}
              required={field.required}
              onChange={(e) => handleChange(field.id, e.target.files?.[0])}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
              style={{ 
                borderColor: `${template.theme.accentColor}40`,
                backgroundColor: `${template.theme.backgroundColor}`,
                color: template.theme.textColor
              }}
            />
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      case 'rating':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex space-x-4 py-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none"
                  style={{ 
                    backgroundColor: formData[field.id] === value ? template.theme.primaryColor : template.theme.backgroundColor,
                    color: formData[field.id] === value ? '#fff' : template.theme.textColor,
                    border: `2px solid ${formData[field.id] === value ? template.theme.primaryColor : `${template.theme.accentColor}40`}`
                  }}
                  onClick={() => handleChange(field.id, value)}
                >
                  {value}
                </button>
              ))}
            </div>
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      case 'scale':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: template.theme.textColor }}>
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex space-x-1 py-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="h-10 flex-1 rounded flex items-center justify-center transition-all duration-200 focus:outline-none text-sm"
                  style={{ 
                    backgroundColor: formData[field.id] === value ? template.theme.primaryColor : template.theme.backgroundColor,
                    color: formData[field.id] === value ? '#fff' : template.theme.textColor,
                    border: `2px solid ${formData[field.id] === value ? template.theme.primaryColor : `${template.theme.accentColor}40`}`
                  }}
                  onClick={() => handleChange(field.id, value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: `${template.theme.textColor}80` }}>
              <span>Not likely at all</span>
              <span>Extremely likely</span>
            </div>
            {field.description && (
              <p className="mt-1 text-sm" style={{ color: `${template.theme.textColor}80` }}>
                {field.description}
              </p>
            )}
          </div>
        )
        
      default:
        return (
          <div key={field.id} className="mb-6">
            <p className="text-sm">Unsupported field type: {field.type}</p>
          </div>
        )
    }
  }
  
  if (formSubmitted) {
    return (
      <motion.div 
        className="text-center py-12 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ color: template.theme.textColor }}
      >
        <svg 
          className="w-16 h-16 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          style={{ color: template.theme.primaryColor }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-lg mb-8">Your form has been submitted successfully.</p>
        <Button 
          onClick={() => setFormSubmitted(false)}
          style={{
            backgroundColor: template.theme.primaryColor,
            color: '#fff',
            border: `1px solid ${template.theme.primaryColor}`
          }}
        >
          Submit Another Response
        </Button>
      </motion.div>
    )
  }
  
  return (
    <div 
      className="rounded-xl overflow-hidden shadow-lg max-w-3xl mx-auto"
      style={{ backgroundColor: template.theme.backgroundColor, ...themeStyle }}
    >
      <div className="px-6 py-8 md:p-10">
        <div className="text-center mb-10">
          <h2 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: template.theme.textColor }}
          >
            {template.title}
          </h2>
          {template.description && (
            <p 
              className="text-lg"
              style={{ color: `${template.theme.textColor}80` }}
            >
              {template.description}
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.fields.map(renderField)}
          
          <div className="pt-4 text-center">
            <Button 
              type="submit"
              style={{
                backgroundColor: template.theme.primaryColor,
                color: '#fff',
                border: `1px solid ${template.theme.primaryColor}`
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 