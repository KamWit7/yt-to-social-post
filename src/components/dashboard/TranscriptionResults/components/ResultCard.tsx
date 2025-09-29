import {
  AIProcessingV2Error,
  AIProcessingV2Loading,
} from '@/api/hooks/useAIProcessingV2'
import { Dictionary, PurposeValue } from '@/app/api/dictionaries'
import { CopyButton } from '@/components/common'
import { MarkdownParser } from '@/components/MarkdownParser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { ErrorSectionHandler } from './ErrorSectionHandler'

interface PurposeData {
  purpose?: string
  customPrompt?: string
}

interface ResultCardProps {
  sectionName: string
  title: string
  content: string
  icon: LucideIcon
  purpose: string
  aiErrors?: AIProcessingV2Error
  ariaLabel: string
  purposeData?: PurposeData
  className?: string
  aiLoading?: AIProcessingV2Loading
}

function shouldShowSection(
  purpose: string,
  purposeData?: PurposeData
): boolean {
  // Always visible sections
  const alwaysVisible: Array<string> = [
    Dictionary.Purpose.Summary,
    Dictionary.Purpose.Topics,
  ]

  if (alwaysVisible.includes(purpose)) {
    return true
  }

  // Social media section - show if purpose is SocialMedia or if it's explicitly requested
  if (purpose === Dictionary.Purpose.SocialMedia) {
    return purposeData?.purpose === Dictionary.Purpose.SocialMedia
  }

  // Custom output section - show if purpose is Custom or if there's a custom prompt
  if (purpose === Dictionary.Purpose.Custom) {
    return purposeData?.purpose === Dictionary.Purpose.Custom
  }

  return false
}

export default function ResultCard({
  sectionName,
  title,
  content,
  icon: Icon,
  purpose,
  aiErrors,
  ariaLabel,
  purposeData,
  className,
  aiLoading,
}: ResultCardProps) {
  // Check if section should be visible
  const isVisible = shouldShowSection(purpose, purposeData)

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  // Find the specific error and loading state for this purpose
  const aiError = aiErrors?.[purpose as PurposeValue]
  const isLoading = aiLoading?.[purpose as PurposeValue]

  console.log('content', content)
  return (
    <ErrorSectionHandler
      sectionName={sectionName}
      aiError={aiError}
      isLoading={isLoading}>
      <Card
        className={cn(
          `border border-border/60 shadow-sm hover:shadow-md transition-shadow flex-1 overflow-y-auto ${
            className || ''
          }`
        )}>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Icon className='w-5 h-5' />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between items-start gap-4'>
            <div className='flex-1'>
              <MarkdownParser text={content || ''}/>
            </div>
            <CopyButton
              text={content || ''}
              className='shrink-0'
              aria-label={ariaLabel}
            />
          </div>
        </CardContent>
      </Card>
    </ErrorSectionHandler>
  )
}
