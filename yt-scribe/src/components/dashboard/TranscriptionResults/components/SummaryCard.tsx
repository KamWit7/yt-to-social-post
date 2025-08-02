import { Bot } from 'lucide-react'
import CopyButton from '../../../common/CopyButton'
import CustomCard from '../../../common/CustomCard'
import SkeletonLoader from '../../../common/SkeletonLoader'
import { CopyType } from './types'

interface SummaryCardProps {
  isLoading: boolean
  summary: string
  onCopy: (text: string, type: CopyType) => void
  copiedItem: CopyType | null
}

function SummaryCard({
  isLoading,
  summary,
  onCopy,
  copiedItem,
}: SummaryCardProps) {
  return (
    <CustomCard
      icon={<Bot className='w-6 h-6 text-purple-500' />}
      title='Streszczenie AI'
      copyAction={
        !isLoading &&
        summary && (
          <CopyButton
            onCopy={() => onCopy(summary, 'summary')}
            isCopied={copiedItem === 'summary'}
          />
        )
      }>
      {isLoading && !summary ? <SkeletonLoader lines={5} /> : summary}
    </CustomCard>
  )
}

export default SummaryCard
