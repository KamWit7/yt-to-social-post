import { cn } from '@/lib/utils'
import { MindMapNodeData } from '@/types'
import { ChevronDown, ChevronRight, Copy } from 'lucide-react'
import { memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

const MindMapNode = memo(
  ({ data, isConnectable }: NodeProps<MindMapNodeData>) => {
    const getNodeStyles = () => {
      switch (data.type) {
        case 'root':
          return {
            container:
              'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 shadow-lg',
            text: 'text-purple-900 font-semibold',
            icon: 'text-purple-600',
          }
        case 'branch':
          return {
            container:
              'bg-gradient-to-br from-cyan-400/20 to-cyan-500/20 border-cyan-400/30 shadow-md',
            text: 'text-cyan-900 font-medium',
            icon: 'text-cyan-600',
          }
        case 'leaf':
          return {
            container:
              'bg-gradient-to-br from-amber-400/20 to-amber-500/20 border-amber-400/30 shadow-sm',
            text: 'text-amber-900 font-normal',
            icon: 'text-amber-600',
          }
        default:
          return {
            container: 'bg-white/60 border-gray-300',
            text: 'text-gray-900',
            icon: 'text-gray-600',
          }
      }
    }

    const styles = getNodeStyles()

    const handleCopy = () => {
      if (data.originalValue !== undefined) {
        const text =
          typeof data.originalValue === 'object'
            ? JSON.stringify(data.originalValue, null, 2)
            : String(data.originalValue)
        navigator.clipboard.writeText(text)
      } else {
        navigator.clipboard.writeText(data.label)
      }
    }

    const getNodeSize = () => {
      switch (data.type) {
        case 'root':
          return 'min-w-[200px] min-h-[80px] text-base'
        case 'branch':
          return 'min-w-[160px] min-h-[60px] text-sm'
        case 'leaf':
          return 'min-w-[120px] min-h-[40px] text-xs'
        default:
          return 'min-w-[120px] min-h-[40px] text-sm'
      }
    }

    return (
      <div
        className={cn(
          'relative rounded-2xl border backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:shadow-xl group',
          styles.container,
          getNodeSize()
        )}>
        {/* Input Handle */}
        {data.type !== 'root' && (
          <Handle
            type='target'
            position={Position.Left}
            isConnectable={isConnectable}
            className='w-3 h-3 !bg-white !border-2 !border-gray-300 hover:!border-purple-500'
          />
        )}

        {/* Node Content */}
        <div className='p-3 flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            {/* Collapse/Expand Icon for nodes with children */}
            {data.children && data.children.length > 0 && (
              <div className={cn('flex-shrink-0', styles.icon)}>
                {data.isCollapsed ? (
                  <ChevronRight className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </div>
            )}

            {/* Node Label */}
            <div className={cn('truncate', styles.text)}>{data.label}</div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={cn(
              'flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20',
              styles.icon
            )}
            title='Kopiuj wartość'>
            <Copy className='w-3 h-3' />
          </button>
        </div>

        {/* Level Indicator */}
        {data.level > 0 && (
          <div className='absolute -top-1 -right-1 w-4 h-4 bg-gray-500/20 rounded-full flex items-center justify-center'>
            <span className='text-[10px] font-medium text-gray-600'>
              {data.level}
            </span>
          </div>
        )}

        {/* Output Handle */}
        {data.children && data.children.length > 0 && (
          <Handle
            type='source'
            position={Position.Right}
            isConnectable={isConnectable}
            className='w-3 h-3 !bg-white !border-2 !border-gray-300 hover:!border-purple-500'
          />
        )}
      </div>
    )
  }
)

MindMapNode.displayName = 'MindMapNode'

export default MindMapNode
