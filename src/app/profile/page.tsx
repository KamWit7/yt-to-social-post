import { UserProfile } from '@/components/auth/UserProfile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | YT Scribe',
  description: 'Manage your account settings and view your profile information',
}

export default function ProfilePage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Your Profile</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and information
          </p>
        </div>

        <UserProfile />
      </div>
    </div>
  )
}
