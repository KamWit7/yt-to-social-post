'use client'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Activity, Calendar, Clock, TrendingUp } from 'lucide-react'

interface UsageHistoryItem {
  date: Date
  count: number
  type: 'summary' | 'generation'
}

interface UsageHistoryProps {
  history?: UsageHistoryItem[]
  isLoading?: boolean
}

function HistorySkeleton() {
  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <div className='space-y-2'>
          <div className='h-6 bg-muted rounded animate-pulse' />
          <div className='h-4 bg-muted rounded w-2/3 animate-pulse' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between p-3 rounded-lg border'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-muted rounded-full animate-pulse' />
                <div className='space-y-1'>
                  <div className='h-4 bg-muted rounded w-24 animate-pulse' />
                  <div className='h-3 bg-muted rounded w-16 animate-pulse' />
                </div>
              </div>
              <div className='h-6 bg-muted rounded w-12 animate-pulse' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Mock data for demonstration - in real app, this would come from props
const mockHistory: UsageHistoryItem[] = [
  { date: new Date(), count: 3, type: 'summary' },
  { date: new Date(Date.now() - 86400000), count: 2, type: 'summary' },
  { date: new Date(Date.now() - 172800000), count: 1, type: 'summary' },
  { date: new Date(Date.now() - 259200000), count: 4, type: 'summary' },
  { date: new Date(Date.now() - 345600000), count: 2, type: 'summary' },
]

export function UsageHistory({
  history = mockHistory,
  isLoading = false,
}: UsageHistoryProps) {
  if (isLoading) {
    return <HistorySkeleton />
  }

  const totalUsage = history.reduce((sum, item) => sum + item.count, 0)
  const averageDaily = totalUsage / Math.max(history.length, 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}>
      <Card className='w-full max-w-2xl mx-auto group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-background via-background to-muted/30 backdrop-blur-sm relative overflow-hidden'>
        {/* Animated background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

        <CardHeader className='relative z-10 pb-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2'>
                <Activity className='w-5 h-5 text-primary' />
                Recent Activity
              </CardTitle>
              <CardDescription className='text-muted-foreground/80'>
                Your usage history over the past few days
              </CardDescription>
            </div>

            <div className='text-right space-y-1'>
              <div className='text-sm text-muted-foreground'>Daily Average</div>
              <div className='text-lg font-semibold text-primary'>
                {averageDaily.toFixed(1)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='relative z-10 space-y-4'>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-8 space-y-3'>
              <div className='w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center'>
                <Calendar className='w-8 h-8 text-muted-foreground' />
              </div>
              <div className='space-y-1'>
                <h3 className='font-medium text-foreground'>No activity yet</h3>
                <p className='text-sm text-muted-foreground'>
                  Start creating summaries to see your usage history here
                </p>
              </div>
            </motion.div>
          ) : (
            <div className='space-y-3'>
              {history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className='flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md group/item'>
                  <div className='flex items-center gap-4'>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className='relative'>
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-lg' />
                      <div className='relative w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center border border-primary/20 group-hover/item:border-primary/40 transition-colors'>
                        <Clock className='w-5 h-5 text-primary' />
                      </div>
                    </motion.div>

                    <div className='space-y-1'>
                      <div className='font-medium text-foreground group-hover/item:text-primary transition-colors'>
                        {item.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                      <div className='text-sm text-muted-foreground flex items-center gap-2'>
                        <span>
                          {item.date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                        <span className='w-1 h-1 bg-muted-foreground/50 rounded-full' />
                        <span className='capitalize'>
                          {item.type}s generated
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <Badge
                      variant='secondary'
                      className='bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      {item.count}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick stats */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='pt-4 border-t border-muted/50'>
              <div className='grid grid-cols-2 gap-4 text-center'>
                <div className='space-y-1'>
                  <div className='text-2xl font-bold text-primary'>
                    {totalUsage}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Total Usage
                  </div>
                </div>
                <div className='space-y-1'>
                  <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                    {history.length}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Active Days
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
