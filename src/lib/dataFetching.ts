// This file simulates a backend service that would provide content for pages
// In a real implementation, this would be an API call to your backend

// Shared placeholder image URLs
const placeholderImages = {
  about: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  features: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  privacy: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  security: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  pricing: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
}

// Type for a content section
export type ContentItem = {
  title: string
  content: string
  imageUrl?: string
  imageAlt?: string
}

// Types for page data
export type PageData = {
  title: string
  subtitle: string
  backgroundClass?: string
  sections: ContentItem[]
}

// Page content
const pageContent: Record<string, PageData> = {
  about: {
    title: "About FormWave",
    subtitle: "Building the future of form creation and data collection",
    sections: [
      {
        title: "Our Story",
        content: "FormWave began in 2021 with a simple mission: to make form building accessible to everyone. Our founders, experienced in UI/UX design and web development, were frustrated with the limitations of existing form builders. They envisioned a platform that combines powerful functionality with intuitive design.",
        imageUrl: placeholderImages.about,
        imageAlt: "FormWave team collaborating"
      },
      {
        title: "Our Mission",
        content: "At FormWave, we believe that collecting data should be simple, beautiful, and effective. We're committed to providing tools that help businesses of all sizes gather the information they need without sacrificing user experience or design quality."
      },
      {
        title: "Our Values",
        content: "Innovation, simplicity, and user empowerment drive everything we do. We're constantly improving our platform based on user feedback and emerging design trends, ensuring that FormWave remains at the cutting edge of form building technology."
      }
    ]
  },
  features: {
    title: "Features",
    subtitle: "Powerful tools for building amazing forms",
    backgroundClass: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    sections: [
      {
        title: "Drag-and-Drop Builder",
        content: "Our intuitive drag-and-drop interface makes form building accessible to everyone, regardless of technical skill. Simply drag elements onto your canvas, customize their appearance, and arrange them to create your perfect form.",
        imageUrl: placeholderImages.features,
        imageAlt: "Drag-and-drop form builder interface"
      },
      {
        title: "AI-Powered Suggestions",
        content: "FormWave's AI assistant analyzes your form's purpose and content to suggest improvements that can increase completion rates. From field order to question phrasing, our intelligent system helps optimize every aspect of your forms."
      },
      {
        title: "Advanced Logic & Conditionals",
        content: "Create dynamic forms that adapt to user input with our powerful conditional logic engine. Show or hide fields, skip sections, or customize messages based on previous answers for a personalized user experience."
      },
      {
        title: "Real-time Collaboration",
        content: "Work together with your team in real-time to design, test, and deploy forms. Our collaboration features include commenting, version history, and role-based permissions to streamline your workflow."
      }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we protect and handle your data",
    backgroundClass: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
    sections: [
      {
        title: "Data Collection & Use",
        content: "FormWave collects only the information necessary to provide our services. This includes account details, form responses, and usage statistics. We never sell your data to third parties and only use it to improve our platform and provide the services you've requested.",
        imageUrl: placeholderImages.privacy,
        imageAlt: "Data privacy illustration"
      },
      {
        title: "User Rights",
        content: "We respect your rights to access, correct, delete, and export your data. Our platform includes tools that make it easy to exercise these rights, and our support team is available to assist with any data-related requests."
      },
      {
        title: "Data Security",
        content: "All data transmitted through FormWave is encrypted using industry-standard protocols. We regularly review and update our security practices to ensure your information remains protected against emerging threats."
      },
      {
        title: "Cookies & Tracking",
        content: "FormWave uses cookies to enhance your experience and analyze platform usage. You can control cookie settings through your browser or our preference center. We're transparent about tracking technologies and provide options to limit data collection."
      }
    ]
  },
  security: {
    title: "Security",
    subtitle: "Our commitment to protecting your data",
    backgroundClass: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    sections: [
      {
        title: "Infrastructure Security",
        content: "FormWave is built on a secure cloud infrastructure with redundant systems, regular security audits, and continuous monitoring. Our platform is designed to maintain high availability while protecting against unauthorized access and data breaches.",
        imageUrl: placeholderImages.security,
        imageAlt: "Security infrastructure illustration"
      },
      {
        title: "Encryption & Data Protection",
        content: "We implement end-to-end encryption for all data in transit and at rest. Sensitive information is further protected through advanced hashing and secure key management protocols, ensuring that your data remains private."
      },
      {
        title: "Compliance & Certifications",
        content: "FormWave maintains compliance with international security standards including GDPR, CCPA, and SOC 2. We regularly undergo third-party security assessments and penetration testing to validate our security controls."
      },
      {
        title: "Incident Response",
        content: "Our dedicated security team has established comprehensive incident response procedures to quickly address potential threats. We maintain transparent communication with affected users in the unlikely event of a security incident."
      }
    ]
  },
  pricing: {
    title: "Pricing",
    subtitle: "Simple, transparent pricing for teams of all sizes",
    backgroundClass: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    sections: [
      {
        title: "Flexible Plans",
        content: "Whether you're an individual creator or a large enterprise, we have pricing plans designed to meet your needs. All plans include our core features, with premium tiers offering advanced functionality and increased resource allocations.",
        imageUrl: placeholderImages.pricing,
        imageAlt: "Pricing plans illustration"
      },
      {
        title: "Free Tier",
        content: "Get started with FormWave at no cost. Our free tier includes up to 3 forms, 100 monthly submissions, and basic analytics—perfect for individuals and small projects."
      },
      {
        title: "Professional",
        content: "At $29/month, unlock unlimited forms, 5,000 monthly submissions, advanced form logic, and remove FormWave branding. Ideal for growing businesses and professionals."
      },
      {
        title: "Enterprise",
        content: "Custom pricing based on your organization's needs. Includes dedicated support, SLA guarantees, custom branding, advanced security features, and integration with your existing systems."
      }
    ]
  },
  team: {
    title: "Our Team",
    subtitle: "Meet the people behind FormWave",
    backgroundClass: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
    sections: [
      {
        title: "Leadership",
        content: "Our leadership team brings decades of experience from leading technology companies. With backgrounds in design, engineering, and business development, they guide FormWave's strategic direction and foster a culture of innovation and excellence.",
        imageUrl: placeholderImages.team,
        imageAlt: "FormWave leadership team"
      },
      {
        title: "Engineering",
        content: "Our engineers are passionate about building reliable, scalable, and user-friendly software. With expertise in modern web technologies, cloud infrastructure, and AI, they're constantly pushing the boundaries of what's possible with form building technology."
      },
      {
        title: "Design",
        content: "FormWave's design team combines aesthetic sensibility with deep knowledge of user experience principles. They ensure that our platform is not only beautiful but also intuitive and accessible to users of all technical abilities."
      },
      {
        title: "Customer Success",
        content: "Dedicated to helping our customers achieve their goals, our customer success team provides personalized support, training, and strategic guidance. They're committed to ensuring that every FormWave user can maximize the value of our platform."
      }
    ]
  }
}

// Form templates
export type FormTemplate = {
  id: string
  title: string
  description: string
  category: string
  fields: FormField[]
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
  }
}

export type FormField = {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  description?: string
}

// Form templates data
const formTemplates: FormTemplate[] = [
  {
    id: 'contact',
    title: 'Contact Form',
    description: 'A simple contact form with name, email, and message fields.',
    category: 'Business',
    fields: [
      { id: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe', required: true },
      { id: 'email', type: 'email', label: 'Email Address', placeholder: 'john@example.com', required: true },
      { id: 'phone', type: 'tel', label: 'Phone Number', placeholder: '(123) 456-7890' },
      { id: 'message', type: 'textarea', label: 'Message', placeholder: 'How can we help you?', required: true }
    ],
    theme: {
      primaryColor: '#4f46e5',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      accentColor: '#818cf8'
    }
  },
  {
    id: 'customer-feedback',
    title: 'Customer Feedback',
    description: 'Collect detailed feedback from customers about your products or services.',
    category: 'Feedback',
    fields: [
      { id: 'name', type: 'text', label: 'Name', placeholder: 'Your name' },
      { id: 'email', type: 'email', label: 'Email', placeholder: 'Your email', required: true },
      { id: 'product', type: 'select', label: 'Which product are you providing feedback for?', required: true, options: ['Product A', 'Product B', 'Product C', 'Service X', 'Service Y'] },
      { id: 'rating', type: 'rating', label: 'How would you rate your experience?', required: true },
      { id: 'improvements', type: 'textarea', label: 'What could we improve?', placeholder: 'Share your suggestions...' },
      { id: 'recommend', type: 'radio', label: 'Would you recommend us to others?', options: ['Yes', 'No', 'Maybe'] }
    ],
    theme: {
      primaryColor: '#8b5cf6',
      backgroundColor: '#f5f3ff',
      textColor: '#1e1b4b',
      accentColor: '#c4b5fd'
    }
  },
  {
    id: 'event-registration',
    title: 'Event Registration',
    description: 'A comprehensive form for event registrations.',
    category: 'Events',
    fields: [
      { id: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'company', type: 'text', label: 'Company/Organization' },
      { id: 'jobTitle', type: 'text', label: 'Job Title' },
      { id: 'ticketType', type: 'select', label: 'Ticket Type', options: ['General Admission', 'VIP', 'Student'], required: true },
      { id: 'sessions', type: 'checkbox', label: 'Which sessions would you like to attend?', options: ['Keynote', 'Workshop A', 'Workshop B', 'Networking Lunch', 'Panel Discussion'] },
      { id: 'dietaryRestrictions', type: 'textarea', label: 'Dietary Restrictions' },
      { id: 'specialAccommodations', type: 'textarea', label: 'Special Accommodations' }
    ],
    theme: {
      primaryColor: '#0ea5e9',
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      accentColor: '#7dd3fc'
    }
  },
  {
    id: 'job-application',
    title: 'Job Application',
    description: 'A professional job application form with fields for experience, education, and file uploads.',
    category: 'Business',
    fields: [
      { id: 'firstName', type: 'text', label: 'First Name', required: true },
      { id: 'lastName', type: 'text', label: 'Last Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'tel', label: 'Phone Number', required: true },
      { id: 'position', type: 'text', label: 'Position Applied For', required: true },
      { id: 'experience', type: 'textarea', label: 'Work Experience', description: 'List your relevant work experience, including company names, positions, and dates.' },
      { id: 'education', type: 'textarea', label: 'Education', description: 'List your educational background, including institutions, degrees, and dates.' },
      { id: 'resume', type: 'file', label: 'Resume/CV', description: 'Upload your resume (PDF format preferred)', required: true },
      { id: 'coverLetter', type: 'file', label: 'Cover Letter', description: 'Upload your cover letter (optional)' },
      { id: 'startDate', type: 'date', label: 'Earliest Start Date' },
      { id: 'referral', type: 'text', label: 'How did you hear about this position?' }
    ],
    theme: {
      primaryColor: '#0f766e',
      backgroundColor: '#f0fdfa',
      textColor: '#134e4a',
      accentColor: '#5eead4'
    }
  },
  {
    id: 'survey',
    title: 'Customer Survey',
    description: 'A detailed survey to gather customer insights.',
    category: 'Feedback',
    fields: [
      { id: 'age', type: 'select', label: 'Age Group', options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
      { id: 'gender', type: 'radio', label: 'Gender', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
      { id: 'usageFrequency', type: 'radio', label: 'How often do you use our product/service?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First time'] },
      { id: 'satisfaction', type: 'rating', label: 'Overall satisfaction with our product/service', required: true },
      { id: 'features', type: 'checkbox', label: 'Which features do you value most?', options: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'] },
      { id: 'improvements', type: 'textarea', label: 'What improvements would you suggest?' },
      { id: 'recommendationLikelihood', type: 'scale', label: 'How likely are you to recommend us to others?', description: 'Scale of 0-10, where 0 is not likely at all and 10 is extremely likely' }
    ],
    theme: {
      primaryColor: '#7c3aed',
      backgroundColor: '#f5f3ff',
      textColor: '#4c1d95',
      accentColor: '#c4b5fd'
    }
  },
  {
    id: 'subscription',
    title: 'Newsletter Subscription',
    description: 'A simple form for newsletter subscriptions.',
    category: 'Marketing',
    fields: [
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'name', type: 'text', label: 'First Name', placeholder: 'Optional' },
      { id: 'interests', type: 'checkbox', label: 'Topics you\'re interested in', options: ['Product Updates', 'Industry News', 'Tips & Tutorials', 'Company Announcements', 'Events'] },
      { id: 'frequency', type: 'radio', label: 'How often would you like to receive our newsletter?', options: ['Weekly', 'Bi-weekly', 'Monthly'] }
    ],
    theme: {
      primaryColor: '#e11d48',
      backgroundColor: '#fff1f2',
      textColor: '#881337',
      accentColor: '#fda4af'
    }
  },
  {
    id: 'medical-intake',
    title: 'Medical Intake Form',
    description: 'Collect essential patient information for medical appointments.',
    category: 'Medical',
    fields: [
      { id: 'firstName', type: 'text', label: 'First Name', required: true },
      { id: 'lastName', type: 'text', label: 'Last Name', required: true },
      { id: 'dob', type: 'date', label: 'Date of Birth', required: true },
      { id: 'gender', type: 'radio', label: 'Gender', options: ['Male', 'Female', 'Other'], required: true },
      { id: 'phone', type: 'tel', label: 'Phone Number', required: true },
      { id: 'email', type: 'email', label: 'Email Address' },
      { id: 'address', type: 'textarea', label: 'Home Address', required: true },
      { id: 'insurance', type: 'text', label: 'Insurance Provider', required: true },
      { id: 'insuranceId', type: 'text', label: 'Insurance ID Number', required: true },
      { id: 'allergies', type: 'textarea', label: 'Allergies', placeholder: 'List any allergies to medications or other substances' },
      { id: 'currentMedications', type: 'textarea', label: 'Current Medications', placeholder: 'List all medications you are currently taking' },
      { id: 'medicalHistory', type: 'checkbox', label: 'Medical History', options: ['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Asthma', 'Cancer', 'Arthritis', 'Depression/Anxiety', 'Other'] },
      { id: 'reasonForVisit', type: 'textarea', label: 'Reason for Visit', required: true }
    ],
    theme: {
      primaryColor: '#0369a1',
      backgroundColor: '#f0f9ff',
      textColor: '#082f49',
      accentColor: '#7dd3fc'
    }
  },
  {
    id: 'hotel-booking',
    title: 'Hotel Booking Form',
    description: 'A complete hotel reservation form with room options and guest information.',
    category: 'Booking',
    fields: [
      { id: 'firstName', type: 'text', label: 'First Name', required: true },
      { id: 'lastName', type: 'text', label: 'Last Name', required: true },
      { id: 'email', type: 'email', label: 'Email Address', required: true },
      { id: 'phone', type: 'tel', label: 'Phone Number', required: true },
      { id: 'checkInDate', type: 'date', label: 'Check-in Date', required: true },
      { id: 'checkOutDate', type: 'date', label: 'Check-out Date', required: true },
      { id: 'roomType', type: 'select', label: 'Room Type', options: ['Standard', 'Deluxe', 'Suite', 'Executive Suite', 'Family Room'], required: true },
      { id: 'guests', type: 'number', label: 'Number of Guests', required: true },
      { id: 'specialRequests', type: 'textarea', label: 'Special Requests', placeholder: 'E.g., early check-in, accessible room, etc.' },
      { id: 'paymentMethod', type: 'radio', label: 'Payment Method', options: ['Credit Card', 'PayPal', 'Bank Transfer'], required: true }
    ],
    theme: {
      primaryColor: '#be123c',
      backgroundColor: '#fef2f2',
      textColor: '#881337',
      accentColor: '#fecdd3'
    }
  }
]

// Function to simulate fetching page content from a backend
export async function getPageContent(pageName: string): Promise<PageData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Return the content for the requested page, or null if not found
  return pageContent[pageName] || null
}

// Function to simulate fetching form templates from a backend
export async function getFormTemplates(category?: string): Promise<FormTemplate[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // If category is provided, filter templates by category
  if (category && category.toLowerCase() !== 'all') {
    return formTemplates.filter(template => 
      template.category.toLowerCase() === category.toLowerCase()
    )
  }
  
  // Otherwise return all templates
  return formTemplates
}

// Function to get a specific form template by ID
export async function getFormTemplate(id: string): Promise<FormTemplate | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Find the template with the matching ID
  const template = formTemplates.find(t => t.id === id)
  
  // Return the template or null if not found
  return template || null
} 