'use client'
import { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'select' 
  | 'checkbox' 
  | 'radio' 
  | 'date'

export type FieldStyles = {
  textColor?: string
  backgroundColor?: string
  borderColor?: string
  fontSize?: 'sm' | 'base' | 'lg'
  width?: 'full' | '3/4' | '1/2'
}

export type FormField = {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  defaultValue?: string
  helpText?: string
  styles: FieldStyles
}

type DraggableFieldProps = {
  field: FormField
  index: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isSelected: boolean
}

export const DraggableField = ({ 
  field, 
  index, 
  onEdit, 
  onDelete,
  isSelected 
}: DraggableFieldProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get field width class based on the field's width setting
  const getWidthClass = () => {
    switch (field.styles.width) {
      case '1/2': return 'w-1/2'
      case '3/4': return 'w-3/4'
      default: return 'w-full'
    }
  }

  // Get font size class based on the field's fontSize setting
  const getFontSizeClass = () => {
    switch (field.styles.fontSize) {
      case 'sm': return 'text-sm'
      case 'lg': return 'text-lg'
      default: return 'text-base'
    }
  }

  // Map field type to its preview component
  const renderFieldPreview = () => {
    const baseStyles = `
      rounded-xl border p-3 ${getFontSizeClass()}
      focus:ring-2 focus:ring-primary/20 focus:border-primary
      ${field.styles.backgroundColor ? `bg-[${field.styles.backgroundColor}]` : 'bg-white dark:bg-gray-800'} 
      ${field.styles.borderColor ? `border-[${field.styles.borderColor}]` : 'border-gray-300 dark:border-gray-700'} 
      ${field.styles.textColor ? `text-[${field.styles.textColor}]` : 'text-gray-800 dark:text-gray-200'}
    `

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input 
            type={field.type} 
            placeholder={field.placeholder || `Enter ${field.label}`}
            className={`${baseStyles} ${getWidthClass()}`}
            disabled
          />
        )
      case 'textarea':
        return (
          <textarea 
            placeholder={field.placeholder || `Enter ${field.label}`}
            className={`${baseStyles} ${getWidthClass()} min-h-[100px]`}
            disabled
          />
        )
      case 'select':
        return (
          <select className={`${baseStyles} ${getWidthClass()}`} disabled>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'checkbox':
        return (
          <div className={`${getWidthClass()} space-y-2`}>
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`preview-${field.id}-${i}`}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  disabled
                />
                <label 
                  htmlFor={`preview-${field.id}-${i}`} 
                  className={`ml-2 ${getFontSizeClass()} ${field.styles.textColor ? `text-[${field.styles.textColor}]` : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )
      case 'radio':
        return (
          <div className={`${getWidthClass()} space-y-2`}>
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input 
                  type="radio" 
                  id={`preview-${field.id}-${i}`}
                  name={`preview-${field.id}`}
                  className="w-4 h-4 border-gray-300 text-primary focus:ring-primary/20"
                  disabled
                />
                <label 
                  htmlFor={`preview-${field.id}-${i}`} 
                  className={`ml-2 ${getFontSizeClass()} ${field.styles.textColor ? `text-[${field.styles.textColor}]` : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        )
      case 'date':
        return (
          <input 
            type="date" 
            className={`${baseStyles} ${getWidthClass()}`}
            disabled
          />
        )
      default:
        return null
    }
  }

  return (
    <Draggable draggableId={field.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 rounded-xl ${
            isSelected 
              ? 'ring-2 ring-primary' 
              : snapshot.isDragging 
                ? 'ring-2 ring-primary/50' 
                : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div 
              {...provided.dragHandleProps}
              className="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 mr-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M9 5L9 19M15 5L15 19"
                    />
                  </svg>
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </div>
              
              <div className="flex space-x-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    type="button"
                    className="p-1 text-gray-500 hover:text-primary rounded-md"
                    onClick={() => onEdit(field.id)}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.75 19.25L9 18.25L18.2929 8.95711C18.6834 8.56658 18.6834 7.93342 18.2929 7.54289L16.4571 5.70711C16.0666 5.31658 15.4334 5.31658 15.0429 5.70711L5.75 15L4.75 19.25Z"
                      />
                    </svg>
                  </button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    type="button"
                    className="p-1 text-gray-500 hover:text-red-500 rounded-md"
                    onClick={() => onDelete(field.id)}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M6.75 7.75L7.59115 17.4233C7.68102 18.4568 8.54622 19.25 9.58363 19.25H14.4164C15.4538 19.25 16.319 18.4568 16.4088 17.4233L17.25 7.75"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M9.75 7.5V6.75C9.75 5.64543 10.6454 4.75 11.75 4.75H12.25C13.3546 4.75 14.25 5.64543 14.25 6.75V7.5"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M5 7.75H19"
                      />
                    </svg>
                  </button>
                </motion.div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-2">
                <label className={`block mb-1 ${getFontSizeClass()} ${field.styles.textColor ? `text-[${field.styles.textColor}]` : 'text-gray-800 dark:text-gray-200'}`}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFieldPreview()}
                {field.helpText && (
                  <p className={`mt-1 ${getFontSizeClass() === 'text-lg' ? 'text-base' : 'text-sm'} text-gray-500 dark:text-gray-400`}>
                    {field.helpText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
} 