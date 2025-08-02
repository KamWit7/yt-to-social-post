import { List } from 'lucide-react'
import CopyButton from '../../../../components/common/CopyButton'
import CustomCard from '../../../../components/common/CustomCard'
import SkeletonLoader from '../../../../components/common/SkeletonLoader'
import TopicsList from './TopicsList'
import { CopyType } from './types'

interface TopicsCardProps {
  isLoading: boolean
  topics: string[]
  onCopy: (text: string, type: CopyType) => void
  copiedItem: CopyType | null
}

function TopicsCard({
  isLoading,
  topics,
  onCopy,
  copiedItem,
}: TopicsCardProps) {
  return (
    <CustomCard
      icon={<List className='w-6 h-6 text-green-500' />}
      title='Główne tematy'
      copyAction={
        !isLoading &&
        topics.length > 0 && (
          <CopyButton
            onCopy={() => onCopy(topics.join('\n'), 'topics')}
            isCopied={copiedItem === 'topics'}
          />
        )
      }>
      {isLoading && topics.length === 0 ? (
        <SkeletonLoader lines={5} type='list' />
      ) : (
        <TopicsList topics={topics} />
      )}
    </CustomCard>
  )
}

export default TopicsCard
