import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface CopyButtonProps {
  onCopy: () => void
  isCopied: boolean
}

export default function CopyButton({ onCopy, isCopied }: CopyButtonProps) {
  return (
    <Button
      onClick={onCopy}
      variant='ghost'
      size='sm'
      className={`flex items-center gap-1.5 px-2 py-1 text-xs transition-colors ${
        isCopied
          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
          : 'bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}>
      {isCopied ? (
        <Check className='w-3.5 h-3.5' />
      ) : (
        <Copy className='w-3.5 h-3.5' />
      )}
      <span>{isCopied ? 'Skopiowano' : 'Kopiuj'}</span>
    </Button>
  )
}
