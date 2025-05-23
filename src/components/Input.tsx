'use client'
import { InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type InputProps = {
  label?: string
  icon?: ReactNode
  error?: string
  hint?: string
  fullWidth?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, hint, fullWidth = true, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

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
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              input-field
              ${icon ? 'pl-10' : ''}
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
            {...props}
          />

          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none border-2 border-primary"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            )}
          </AnimatePresence>
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
Input.displayName = 'Input' 