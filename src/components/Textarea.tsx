'use client'
import { TextareaHTMLAttributes, useState, useRef, useEffect, forwardRef, useCallback } from 'react'

type TextareaProps = {
  label?: string
  error?: string
  hint?: string
  fullWidth?: boolean
  autoResize?: boolean
  maxHeight?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { 
      label, 
      error, 
      hint, 
      fullWidth = true, 
      className = '', 
      autoResize = true,
      maxHeight = 400,
      ...props 
    }, 
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    
    // Handle ref forwarding with our local ref
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current)
      } else if (ref) {
        ref.current = textareaRef.current
      }
    }, [ref])

    // Auto-resize functionality
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      // Reset height to calculate scrollHeight correctly
      textarea.style.height = 'auto'
      
      // Apply new height but respect maxHeight
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = `${newHeight}px`
      
      // Add overflow if content exceeds maxHeight
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
    }, [autoResize, maxHeight])

    useEffect(() => {
      if (autoResize) {
        adjustHeight()
      }
    }, [props.value, autoResize, adjustHeight])

    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            className={`
              input-field auto-resize-textarea
              ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            onChange={(e) => {
              props.onChange?.(e)
              if (autoResize) {
                adjustHeight()
              }
            }}
            {...props}
          />

          {isFocused && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none border-2 border-primary animate-[focusRing_0.2s_ease-in-out_forwards]"
              style={{ opacity: 0 }}
            />
          )}
        </div>

        {(error || hint) && (
          <div className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {error || hint}
          </div>
        )}
      </div>
    )
  }
)

// Add display name to prevent ESLint warning
Textarea.displayName = 'Textarea' 