import { Edge, Node } from 'reactflow'

interface MindMapNodeData {
  label: string
  type: 'root' | 'branch' | 'leaf'
  level: number
  isCollapsed?: boolean
  children?: string[]
  originalValue?: unknown
}

export interface ApiResponse<T, E = string> {
  success: boolean
  data?: T
  error?: E
  details?: string
}

export type MindMapData = {
  nodes: Node<MindMapNodeData>[]
  edges: Edge[]
}
