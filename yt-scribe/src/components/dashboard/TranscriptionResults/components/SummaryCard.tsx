import { Bot } from 'lucide-react'
import CopyButton from '../../../../components/common/CopyButton'
import CustomCard from '../../../../components/common/CustomCard'
import SkeletonLoader from '../../../../components/common/SkeletonLoader'

interface SummaryCardProps {
  isLoading: boolean
  summary: string
}

function SummaryCard({ isLoading, summary }: SummaryCardProps) {
  return (
    <CustomCard
      icon={<Bot className='w-6 h-6 text-purple-500' />}
      title='Streszczenie AI'
      copyAction={!isLoading && summary && <CopyButton text={summary} />}>
      {isLoading && !summary ? <SkeletonLoader lines={5} /> : summary}
    </CustomCard>
  )
}

export default SummaryCard
