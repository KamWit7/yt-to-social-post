import { List } from 'lucide-react'
import CopyButton from '../../../common/CopyButton'
import CustomCard from '../../../common/CustomCard'
import SkeletonLoader from '../../../common/SkeletonLoader'
import TopicsList from './TopicsList'

interface TopicsCardProps {
  isLoading: boolean
  topics: string[]
}

function TopicsCard({ isLoading, topics }: TopicsCardProps) {
  return (
    <CustomCard
      icon={<List className='w-6 h-6 text-green-500' />}
      title='Główne tematy'
      copyAction={
        !isLoading &&
        topics.length > 0 && <CopyButton text={topics.join('\n')} />
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
