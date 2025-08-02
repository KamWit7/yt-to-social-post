import { FileText } from 'lucide-react'
import CollapsibleCard from '../../../common/CollapsibleCard'
import CopyButton from '../../../common/CopyButton'
import SkeletonLoader from '../../../common/SkeletonLoader'
import { CopyType } from './types'

interface TranscriptCardProps {
  isLoading: boolean
  transcript: string
  isVisible: boolean
  onToggle: () => void
  onCopy: (text: string, type: CopyType) => void
  copiedItem: CopyType | null
}

function TranscriptCard({
  isLoading,
  transcript,
  isVisible,
  onToggle,
  onCopy,
  copiedItem,
}: TranscriptCardProps) {
  return (
    <CollapsibleCard
      icon={<FileText className='w-6 h-6 text-blue-500' />}
      title='Pełna transkrypcja'
      isVisible={isVisible}
      onToggle={onToggle}
      copyAction={
        !isLoading &&
        transcript && (
          <CopyButton
            onCopy={() => onCopy(transcript, 'transcript')}
            isCopied={copiedItem === 'transcript'}
          />
        )
      }>
      {isLoading && !transcript ? (
        <SkeletonLoader lines={8} />
      ) : (
        <p className='whitespace-pre-wrap'>{transcript}</p>
      )}
    </CollapsibleCard>
  )
}

export default TranscriptCard
