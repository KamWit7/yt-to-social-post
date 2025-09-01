'use client'

import { CopyButton } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MindMapData } from '@/types'
import { parseMindMapToFlow, validateMindMapData } from '@/utils/mindMapParser'
import { Brain, Eye, EyeOff } from 'lucide-react'
import { useMemo, useState } from 'react'
import MindMapFlow from './MindMapFlow'

interface MindMapCardProps {
  mindMap: MindMapData
}

export default function MindMapCard({ mindMap }: MindMapCardProps) {
  const [showRawData, setShowRawData] = useState(false)

  // Transform the mindMap data for ReactFlow
  const { nodes, edges, rawData, hasValidData } = useMemo(() => {
    try {
      if (!mindMap || (!mindMap.nodes && !mindMap.edges)) {
        return {
          nodes: [],
          edges: [],
          rawData: {},
          hasValidData: false,
        }
      }

      // If mindMap already has nodes and edges (new format), use them directly
      if (mindMap.nodes && mindMap.edges) {
        return {
          nodes: mindMap.nodes,
          edges: mindMap.edges,
          rawData: mindMap,
          hasValidData: mindMap.nodes.length > 0,
        }
      }

      // If mindMap is a raw object (old format), parse it
      const mindMapAsRecord = mindMap as unknown as Record<string, unknown>
      if (validateMindMapData(mindMapAsRecord)) {
        const parsed = parseMindMapToFlow(mindMapAsRecord)
        return {
          nodes: parsed.nodes,
          edges: parsed.edges,
          rawData: mindMapAsRecord,
          hasValidData: parsed.nodes.length > 0,
        }
      }

      return {
        nodes: [],
        edges: [],
        rawData: mindMap,
        hasValidData: false,
      }
    } catch (error) {
      console.error('Error parsing mind map data:', error)
      return {
        nodes: [],
        edges: [],
        rawData: mindMap,
        hasValidData: false,
      }
    }
  }, [mindMap])

  const copyableContent = useMemo(() => {
    return JSON.stringify(rawData, null, 2)
  }, [rawData])

  if (!hasValidData) {
    return (
      <Card className='border border-border/60 shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Brain className='w-5 h-5 text-purple-500' />
            Mapa myśli
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-96 bg-gray-50 rounded-2xl flex items-center justify-center'>
            <div className='text-center text-gray-500'>
              <Brain className='w-16 h-16 mx-auto mb-4 opacity-50' />
              <p className='font-medium'>Brak danych mapy myśli</p>
              <p className='text-sm mt-1'>
                Dane mapy myśli są puste lub nieprawidłowe
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <Brain className='w-5 h-5 text-purple-500' />
            Mapa myśli
            {nodes.length > 0 && (
              <span className='text-sm font-normal text-muted-foreground'>
                ({nodes.length} węzłów)
              </span>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowRawData(!showRawData)}
              className='p-1 rounded hover:bg-gray-100 transition-colors'
              title={showRawData ? 'Pokaż wizualizację' : 'Pokaż surowe dane'}>
              {showRawData ? (
                <Eye className='w-4 h-4 text-gray-600' />
              ) : (
                <EyeOff className='w-4 h-4 text-gray-600' />
              )}
            </button>

            <CopyButton
              text={copyableContent}
              className='shrink-0'
              aria-label='Kopiuj mapę myśli'
            />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {showRawData ? (
          <div className='bg-gray-50 rounded-2xl p-4 max-h-[500px] overflow-auto'>
            <pre className='text-xs text-gray-800 font-mono whitespace-pre-wrap'>
              {copyableContent}
            </pre>
          </div>
        ) : (
          <div className='h-96 rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-purple-50/50 to-cyan-50/50'>
            <MindMapFlow
              nodes={nodes}
              edges={edges}
              className='w-full h-full'
            />
          </div>
        )}

        {!showRawData && (
          <div className='mt-4 flex items-center justify-between text-xs text-muted-foreground'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <div className='w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full'></div>
                <span>Główne tematy</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full'></div>
                <span>Podtematy</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full'></div>
                <span>Szczegóły</span>
              </div>
            </div>
            <div>Przeciągnij i powiększaj • Kliknij węzeł, aby skopiować</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
