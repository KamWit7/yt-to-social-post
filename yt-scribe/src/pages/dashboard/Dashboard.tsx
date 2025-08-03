'use client'

import { Card } from '@/components/ui/card'
import { Fragment, useState } from 'react'
import TranscriptionForm from './TranscriptionForm/TranscriptionForm'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'

export default function Dashboard() {
  const [url, setUrl] = useState('')

  return (
    <Fragment>
      <Card className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 mb-8'>
        <TranscriptionForm url={url} setUrl={setUrl} />
      </Card>
      <TranscriptionResults url={url} />
    </Fragment>
  )
}
