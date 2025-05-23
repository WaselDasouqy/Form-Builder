'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
  href?: string
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  href,
  className = '',
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary-light text-white shadow-md',
    secondary: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/70 dark:text-indigo-300',
    outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
  }

  const sizes = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  }

  const loadingSpinner = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )

  const buttonClasses = `
    inline-flex items-center justify-center
    rounded-xl font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900
    disabled:opacity-60 disabled:pointer-events-none
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `

  // Base button content
  const buttonContent = (
    <>
      {isLoading && loadingSpinner}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </>
  )

  // If href is provided, render a Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        <motion.span 
          className="flex items-center justify-center w-full h-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {buttonContent}
        </motion.span>
      </Link>
    )
  }

  // Otherwise render a button
  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <motion.span 
        className="flex items-center justify-center w-full h-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {buttonContent}
      </motion.span>
    </button>
  )
} 