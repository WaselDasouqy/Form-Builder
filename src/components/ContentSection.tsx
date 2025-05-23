'use client'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

type ContentSectionProps = {
  title: string
  content: string | React.ReactNode
  imageUrl?: string
  imageAlt?: string
  index?: number
  direction?: 'left' | 'right'
}

export const ContentSection = ({
  title,
  content,
  imageUrl,
  imageAlt = "Section image",
  index = 0,
  direction = 'left'
}: ContentSectionProps) => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  
  return (
    <motion.div
      ref={sectionRef}
      className={`flex flex-col ${direction === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 py-12 border-b border-gray-200 dark:border-gray-800 last:border-0`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
        {typeof content === 'string' ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">{content}</p>
          </div>
        ) : (
          content
        )}
      </div>
      
      {imageUrl && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={imageUrl} 
              alt={imageAlt} 
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
} 