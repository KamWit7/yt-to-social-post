interface TopicsListProps {
  topics: string[]
}

function TopicsList({ topics }: TopicsListProps) {
  if (!topics.length) return null

  return (
    <ul className='space-y-2'>
      {topics.map((topic, index) => (
        <li key={`${topic}-${index}`} className='flex items-start'>
          <span className='text-green-500 mr-2 mt-1' aria-hidden='true'>
            ✓
          </span>
          <span>{topic}</span>
        </li>
      ))}
    </ul>
  )
}

export default TopicsList
