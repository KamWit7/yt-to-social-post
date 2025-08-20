import { FileText } from 'lucide-react'
import { useState } from 'react'
import CollapsibleCard from '../../../../components/common/CollapsibleCard'
import CopyButton from '../../../../components/common/CopyButton'
import SkeletonLoader from '../../../../components/common/SkeletonLoader'

interface TranscriptCardProps {
  isLoading: boolean
  transcript: string
}

function TranscriptCard({ isLoading, transcript }: TranscriptCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <CollapsibleCard
      icon={<FileText className='w-6 h-6 text-blue-500' />}
      title='Pełna transkrypcja'
      isVisible={isVisible}
      onToggle={() => setIsVisible(!isVisible)}
      copyAction={!isLoading && transcript && <CopyButton text={transcript} />}>
      {isLoading && !transcript ? (
        <SkeletonLoader lines={8} />
      ) : (
        <p className='whitespace-pre-wrap'>{transcript}</p>
      )}
    </CollapsibleCard>
  )
}

export default TranscriptCard
