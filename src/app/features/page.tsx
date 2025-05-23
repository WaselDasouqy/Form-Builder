'use client'
import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { ContentSection } from '@/components/ContentSection'
import { getPageContent, ContentItem } from '@/lib/dataFetching'
import { Skeleton } from '@/components/Skeleton'

export default function FeaturesPage() {
  const [pageData, setPageData] = useState<{
    title: string
    subtitle: string
    backgroundClass?: string
    sections: ContentItem[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPageContent('features')
        setPageData(data)
      } catch (error) {
        console.error('Error fetching features page data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) {
    return (
      <PageLayout title="Features" subtitle="Loading...">
        <div className="space-y-10">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </PageLayout>
    )
  }
  
  if (!pageData) {
    return (
      <PageLayout title="Features" subtitle="Error loading page content">
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load page content. Please try again later.
          </p>
        </div>
      </PageLayout>
    )
  }
  
  return (
    <PageLayout 
      title={pageData.title} 
      subtitle={pageData.subtitle}
      backgroundClass={pageData.backgroundClass}
    >
      {pageData.sections.map((section, index) => (
        <ContentSection
          key={index}
          title={section.title}
          content={section.content}
          imageUrl={section.imageUrl}
          imageAlt={section.imageAlt}
          index={index}
          direction={index % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </PageLayout>
  )
} 