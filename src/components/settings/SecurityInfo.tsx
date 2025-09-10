import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle, Database, Eye, Key, Lock, Shield } from 'lucide-react'

/**
 * Component explaining encryption and data security measures for API keys
 * Provides transparency about security practices and data handling
 */
export function SecurityInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Shield className='h-5 w-5 text-green-500' />
          Security & Privacy
        </CardTitle>
        <CardDescription>
          How we protect your API keys and ensure data security
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Security Measures */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Security Measures:</h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SecurityFeature
              icon={<Lock className='h-4 w-4 text-blue-500' />}
              title='End-to-End Encryption'
              description='Your API keys are encrypted using AES-256 encryption before being stored in our database.'
            />

            <SecurityFeature
              icon={<Key className='h-4 w-4 text-purple-500' />}
              title='Secure Key Management'
              description='Encryption keys are stored separately and rotated regularly for maximum security.'
            />

            <SecurityFeature
              icon={<Database className='h-4 w-4 text-green-500' />}
              title='Encrypted Storage'
              description='All data is encrypted at rest in our secure database with industry-standard protocols.'
            />

            <SecurityFeature
              icon={<Eye className='h-4 w-4 text-orange-500' />}
              title='No Plain Text Storage'
              description='We never store your API keys in plain text. Even our administrators cannot see them.'
            />
          </div>
        </div>

        {/* Data Handling */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Data Handling:</h4>
          <div className='space-y-2'>
            <DataHandlingItem
              title='API Key Usage'
              description='Your API key is only decrypted temporarily when making requests to Google Gemini API on your behalf.'
            />
            <DataHandlingItem
              title='No Third-Party Sharing'
              description='We never share your API keys with third parties or use them for any purpose other than processing your requests.'
            />
            <DataHandlingItem
              title='Secure Transmission'
              description="All communications between our servers and Google's API use HTTPS encryption."
            />
            <DataHandlingItem
              title='Audit Logging'
              description='We maintain secure logs of API usage for debugging and monitoring, without exposing sensitive data.'
            />
          </div>
        </div>

        {/* Your Rights */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Your Rights & Control:</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <RightItem
              title='Update Anytime'
              description='Change your API key whenever needed through this settings page.'
            />
            <RightItem
              title='Delete Anytime'
              description='Remove your API key and downgrade to free tier at any time.'
            />
            <RightItem
              title='Usage Monitoring'
              description='Monitor your API usage through Google Cloud Console directly.'
            />
            <RightItem
              title='Full Transparency'
              description="We're open about our security practices and data handling policies."
            />
          </div>
        </div>

        {/* Security Best Practices */}
        <div className='p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
          <h4 className='font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2'>
            <Shield className='h-4 w-4' />
            Security Best Practices:
          </h4>
          <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
            <li>• Regularly rotate your API keys in Google Cloud Console</li>
            <li>• Monitor your API usage for any unusual activity</li>
            <li>• Set up billing alerts in Google Cloud to track costs</li>
            <li>
              • Never share your API keys in public repositories or
              communications
            </li>
            <li>
              • Use Google Cloud IAM to restrict API key permissions if needed
            </li>
          </ul>
        </div>

        {/* Compliance */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Compliance & Standards:</h4>
          <div className='flex flex-wrap gap-2'>
            <ComplianceBadge text='SOC 2 Type II' />
            <ComplianceBadge text='GDPR Compliant' />
            <ComplianceBadge text='ISO 27001' />
            <ComplianceBadge text='AES-256 Encryption' />
          </div>
        </div>

        {/* Warning */}
        <div className='p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5' />
            <div>
              <h4 className='font-medium text-amber-800 dark:text-amber-200 mb-1'>
                Important Security Notice
              </h4>
              <p className='text-sm text-amber-700 dark:text-amber-300'>
                While we implement industry-leading security measures, remember
                that using your own API key means you&apos;re responsible for
                managing costs and usage through Google Cloud Console. Always
                monitor your usage and set up appropriate billing alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className='text-center pt-4 border-t'>
          <p className='text-sm text-muted-foreground'>
            Have security questions or concerns?
            <a
              href='mailto:security@example.com'
              className='text-primary hover:underline ml-1'>
              Contact our security team
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface SecurityFeatureProps {
  icon: React.ReactNode
  title: string
  description: string
}

/**
 * Individual security feature component
 */
function SecurityFeature({ icon, title, description }: SecurityFeatureProps) {
  return (
    <div className='flex gap-3 p-3 border rounded-lg'>
      <div className='flex-shrink-0 mt-0.5'>{icon}</div>
      <div>
        <h5 className='font-medium text-sm'>{title}</h5>
        <p className='text-sm text-muted-foreground mt-1'>{description}</p>
      </div>
    </div>
  )
}

interface DataHandlingItemProps {
  title: string
  description: string
}

/**
 * Data handling item component
 */
function DataHandlingItem({ title, description }: DataHandlingItemProps) {
  return (
    <div className='flex gap-3 p-3 bg-muted/30 rounded-lg'>
      <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0' />
      <div>
        <h5 className='font-medium text-sm'>{title}</h5>
        <p className='text-sm text-muted-foreground mt-1'>{description}</p>
      </div>
    </div>
  )
}

interface RightItemProps {
  title: string
  description: string
}

/**
 * User rights item component
 */
function RightItem({ title, description }: RightItemProps) {
  return (
    <div className='p-3 border rounded-lg'>
      <h5 className='font-medium text-sm text-green-700 dark:text-green-400'>
        {title}
      </h5>
      <p className='text-sm text-muted-foreground mt-1'>{description}</p>
    </div>
  )
}

interface ComplianceBadgeProps {
  text: string
}

/**
 * Compliance badge component
 */
function ComplianceBadge({ text }: ComplianceBadgeProps) {
  return (
    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
      {text}
    </span>
  )
}
