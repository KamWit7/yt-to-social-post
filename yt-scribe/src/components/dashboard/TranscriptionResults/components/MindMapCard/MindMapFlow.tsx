'use client'

import { MindMapNodeData } from '@/types'
import { useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import MindMapNode from './MindMapNode'

interface MindMapFlowProps {
  nodes: Node<MindMapNodeData>[]
  edges: Edge[]
  className?: string
}

const nodeTypes: NodeTypes = {
  custom: MindMapNode,
}

export default function MindMapFlow({
  nodes: initialNodes,
  edges: initialEdges,
  className,
}: MindMapFlowProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlowRef = useRef<ReactFlowInstance | null>(null)

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowRef.current = instance
    // Fit view on initial load
    instance.fitView({ duration: 300, padding: 0.1 })
  }, [])

  // Custom styles for different node types in minimap
  const minimapNodeColor = useCallback((node: Node<MindMapNodeData>) => {
    switch (node.data.type) {
      case 'root':
        return '#8B5CF6'
      case 'branch':
        return '#06B6D4'
      case 'leaf':
        return '#F59E0B'
      default:
        return '#6B7280'
    }
  }, [])

  const defaultViewport = useMemo(
    () => ({
      x: 0,
      y: 0,
      zoom: 0.8,
    }),
    []
  )

  const fitViewOptions = useMemo(
    () => ({
      duration: 300,
      padding: 0.1,
      includeHiddenNodes: false,
    }),
    []
  )

  const proOptions = useMemo(
    () => ({
      hideAttribution: true,
    }),
    []
  )

  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitViewOptions={fitViewOptions}
        minZoom={0.2}
        maxZoom={2}
        snapToGrid={true}
        snapGrid={[20, 20]}
        proOptions={proOptions}
        fitView
        attributionPosition='bottom-left'>
        {/* Background with dots pattern */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color='#E2E8F0'
        />

        {/* Controls for zoom, fit view, etc. */}
        <Controls
          className='!bg-white/80 !backdrop-blur-sm !border !border-gray-200 !rounded-lg !shadow-lg'
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          fitViewOptions={fitViewOptions}
        />

        {/* Minimap for navigation */}
        <MiniMap
          nodeColor={minimapNodeColor}
          className='!bg-white/80 !backdrop-blur-sm !border !border-gray-200 !rounded-lg'
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          }}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  )
}
