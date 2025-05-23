'use client'
import { useState } from 'react'
import { FormField, FieldStyles } from './DraggableField'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { motion, AnimatePresence } from 'framer-motion'

interface FieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onClose: () => void
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate, onClose }) => {
  const [currentField, setCurrentField] = useState<FormField>({ ...field })
  const [activeTab, setActiveTab] = useState<'properties' | 'styles'>('properties')

  // Helper to update the field and propagate changes
  const updateField = (updates: Partial<FormField>) => {
    const updatedField = { ...currentField, ...updates }
    setCurrentField(updatedField)
    onUpdate(updatedField)
  }

  // Helper to update styles
  const updateStyles = (updates: Partial<FieldStyles>) => {
    updateField({
      styles: {
        ...currentField.styles,
        ...updates
      }
    })
  }

  // Handle adding an option to select, checkbox, or radio fields
  const addOption = () => {
    if (!currentField.options) return

    const newOptions = [...currentField.options, `Option ${currentField.options.length + 1}`]
    updateField({ options: newOptions })
  }

  // Handle removing an option
  const removeOption = (index: number) => {
    if (!currentField.options) return
    
    const newOptions = currentField.options.filter((_, i) => i !== index)
    updateField({ options: newOptions })
  }

  // Handle updating an option's text
  const updateOption = (index: number, value: string) => {
    if (!currentField.options) return
    
    const newOptions = [...currentField.options]
    newOptions[index] = value
    updateField({ options: newOptions })
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'properties'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'styles'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('styles')}
        >
          Appearance
        </button>
      </div>

      {/* Properties Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'properties' && (
          <motion.div
            key="properties"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Input
              label="Field Label"
              value={currentField.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter field label"
            />

            <Input
              label="Placeholder Text"
              value={currentField.placeholder || ''}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />

            <Textarea
              label="Help Text"
              value={currentField.helpText || ''}
              onChange={(e) => updateField({ helpText: e.target.value })}
              placeholder="Enter help text (optional)"
              rows={3}
            />

            {/* Options for select, radio, checkbox fields */}
            {(currentField.type === 'select' || currentField.type === 'radio' || currentField.type === 'checkbox') && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Options
                </label>
                {currentField.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-md"
                      disabled={currentField.options?.length === 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-primary hover:text-primary-light text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Option
                </button>
              </div>
            )}

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="required-field"
                checked={currentField.required}
                onChange={(e) => updateField({ required: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/20"
              />
              <label htmlFor="required-field" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Required field
              </label>
            </div>
          </motion.div>
        )}

        {/* Styles Tab */}
        {activeTab === 'styles' && (
          <motion.div
            key="styles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Field Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Field Width
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`p-2 border rounded-md text-sm ${
                    currentField.styles.width === 'full'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => updateStyles({ width: 'full' })}
                >
                  Full Width
                </button>
                <button
                  type="button"
                  className={`p-2 border rounded-md text-sm ${
                    currentField.styles.width === '3/4'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => updateStyles({ width: '3/4' })}
                >
                  75% Width
                </button>
                <button
                  type="button"
                  className={`p-2 border rounded-md text-sm ${
                    currentField.styles.width === '1/2'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => updateStyles({ width: '1/2' })}
                >
                  50% Width
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`p-2 border rounded-md text-sm ${
                    currentField.styles.fontSize === 'sm'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => updateStyles({ fontSize: 'sm' })}
                >
                  Small
                </button>
                <button
                  type="button"
                  className={`p-2 border rounded-md text-sm ${
                    currentField.styles.fontSize === 'base'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => updateStyles({ fontSize: 'base' })}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`p-2 border rounded-md text-sm ${
                    currentField.styles.fontSize === 'lg'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => updateStyles({ fontSize: 'lg' })}
                >
                  Large
                </button>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Text Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['#111827', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-full h-8 rounded-md border ${
                      currentField.styles.textColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateStyles({ textColor: color })}
                    aria-label={`Set text color to ${color}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Background Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['#FFFFFF', '#F3F4F6', '#E5E7EB', '#F0FDF4', '#FEF3C7', '#FEE2E2'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-full h-8 rounded-md border ${
                      currentField.styles.backgroundColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateStyles({ backgroundColor: color })}
                    aria-label={`Set background color to ${color}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Border Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['#E5E7EB', '#D1D5DB', '#9CA3AF', '#4F46E5', '#10B981', '#EF4444'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-full h-8 rounded-md border ${
                      currentField.styles.borderColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateStyles({ borderColor: color })}
                    aria-label={`Set border color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  )
} 