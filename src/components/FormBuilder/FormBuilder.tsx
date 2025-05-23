'use client'
import React, { useState } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { DraggableField, FormField, FieldType } from './DraggableField'
import { FieldEditor } from '.'
import { v4 as uuidv4 } from 'uuid'

// Define tool palette items (available field types)
const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4.75 19.25L19.25 19.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 15.25V4.75"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 8.25L15.25 8.25"
        />
      </svg>
    ),
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V6.75C18.25 5.64543 17.3546 4.75 16.25 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 8.75H15.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 11.75H15.25"
        />
      </svg>
    ),
  },
  {
    type: 'number',
    label: 'Number',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 4.75H15.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 19.25H15.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8.75 12H15.25"
        />
      </svg>
    ),
  },
  {
    type: 'email',
    label: 'Email',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5.5 6.5L12 12L18.5 6.5"
        />
      </svg>
    ),
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5.75 5.75H18.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M5.75 18.25H18.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M19.25 12H4.75"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M15.25 8.75L19.25 12L15.25 15.25"
        />
      </svg>
    ),
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.75 12.75L11.25 14.25L14.25 9.75"
        />
      </svg>
    ),
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25Z"
        />
      </svg>
    ),
  },
  {
    type: 'date',
    label: 'Date',
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4.75 8.75C4.75 7.64543 5.64543 6.75 6.75 6.75H17.25C18.3546 6.75 19.25 7.64543 19.25 8.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V8.75Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8 4.75V8.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M16 4.75V8.25"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M7.75 10.75H16.25"
        />
      </svg>
    ),
  },
]

interface FormBuilderProps {
  onSave?: (fields: FormField[]) => void
  initialFields?: FormField[]
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ 
  onSave,
  initialFields = []
}) => {
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  // Get the selected field data
  const selectedField = fields.find(field => field.id === selectedFieldId) || null

  // Handle dropping a field from the palette
  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      required: false,
      styles: {
        fontSize: 'base',
        width: 'full',
      },
    }

    // Add default options for fields that need them
    if (type === 'select' || type === 'checkbox' || type === 'radio') {
      newField.options = ['Option 1', 'Option 2', 'Option 3']
    }

    setFields([...fields, newField])
    setSelectedFieldId(newField.id)
    setIsEditorOpen(true)
  }

  // Handle reordering fields
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result

    // If dropped outside the list or no change
    if (!destination || (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )) {
      return
    }

    const newFields = Array.from(fields)
    const [removed] = newFields.splice(source.index, 1)
    newFields.splice(destination.index, 0, removed)

    setFields(newFields)
  }

  // Handle editing a field
  const handleEditField = (id: string) => {
    setSelectedFieldId(id)
    setIsEditorOpen(true)
  }

  // Handle deleting a field
  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
    
    // Close editor if the deleted field was selected
    if (selectedFieldId === id) {
      setSelectedFieldId(null)
      setIsEditorOpen(false)
    }
  }

  // Handle updating a field from the editor
  const handleFieldUpdate = (updatedField: FormField) => {
    setFields(fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    ))
  }

  // Handle save form
  const handleSave = () => {
    if (onSave) {
      onSave(fields)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Field palette */}
      <div className="w-full lg:w-64 lg:min-w-64 shrink-0">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Field Types</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {fieldTypes.map((fieldType) => (
              <motion.div
                key={fieldType.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 p-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg w-full"
                  onClick={() => handleAddField(fieldType.type)}
                >
                  <span className="text-primary">{fieldType.icon}</span>
                  {fieldType.label}
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              className="w-full bg-primary hover:bg-primary-light text-white rounded-lg py-2 px-4 text-sm font-medium"
              onClick={handleSave}
            >
              Save Form
            </button>
          </div>
        </div>
      </div>

      {/* Form editor area */}
      <div className="flex-1 min-w-0">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="form-fields">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[400px] bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700"
              >
                {fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                    <svg 
                      className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    <p className="mb-2 text-lg">No fields added yet</p>
                    <p className="text-sm">Drag fields from the palette to add them to your form</p>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      index={index}
                      onEdit={handleEditField}
                      onDelete={handleDeleteField}
                      isSelected={selectedFieldId === field.id}
                    />
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Field editor panel */}
      <AnimatePresence>
        {isEditorOpen && selectedField && (
          <div className="lg:fixed lg:top-0 lg:right-0 lg:bottom-0 lg:w-96 lg:z-10 bg-white dark:bg-gray-800 lg:shadow-xl border-l border-gray-200 dark:border-gray-700 overflow-auto">
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Field</h3>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setIsEditorOpen(false)}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17.25 6.75L6.75 17.25"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M6.75 6.75L17.25 17.25"
                    />
                  </svg>
                </button>
              </div>
              
              <FieldEditor
                field={selectedField}
                onUpdate={handleFieldUpdate}
                onClose={() => setIsEditorOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 