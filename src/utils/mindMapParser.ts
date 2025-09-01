import { MindMapNodeData } from '@/types'
import { Edge, Node, Position } from 'reactflow'

export interface ParsedMindMapData {
  nodes: Node<MindMapNodeData>[]
  edges: Edge[]
}

export function parseMindMapToFlow(
  mindMap: Record<string, unknown>
): ParsedMindMapData {
  const nodes: Node<MindMapNodeData>[] = []
  const edges: Edge[] = []
  let nodeIdCounter = 0

  const createNodeId = () => `node-${nodeIdCounter++}`

  function createNode(
    id: string,
    label: string,
    type: 'root' | 'branch' | 'leaf',
    level: number,
    position: { x: number; y: number },
    originalValue?: unknown,
    children?: string[]
  ): Node<MindMapNodeData> {
    return {
      id,
      position,
      data: {
        label,
        type,
        level,
        originalValue,
        children,
      },
      type: 'custom',
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }
  }

  function createEdge(source: string, target: string, animated = false): Edge {
    return {
      id: `edge-${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
      animated,
      style: {
        strokeWidth: 2,
        stroke: animated ? '#8B5CF6' : '#E2E8F0',
      },
    }
  }

  function calculatePosition(
    index: number,
    total: number,
    level: number,
    parentX = 0,
    parentY = 0
  ): { x: number; y: number } {
    const baseRadius = 200 + level * 150
    const angleStep = (2 * Math.PI) / Math.max(total, 1)
    const angle = angleStep * index - Math.PI / 2 // Start from top

    if (level === 0) {
      // Root node in center
      return { x: 400, y: 300 }
    } else if (level === 1) {
      // First level nodes arranged in circle around center
      return {
        x: 400 + baseRadius * Math.cos(angle),
        y: 300 + baseRadius * Math.sin(angle),
      }
    } else {
      // Deeper levels spread out from parent
      const offset = 150
      return {
        x: parentX + offset * Math.cos(angle),
        y: parentY + offset * Math.sin(angle),
      }
    }
  }

  function processValue(
    key: string,
    value: unknown,
    level: number,
    parentId?: string,
    siblingIndex = 0,
    totalSiblings = 1,
    parentX = 0,
    parentY = 0
  ): string {
    const nodeId = createNodeId()
    const position = calculatePosition(
      siblingIndex,
      totalSiblings,
      level,
      parentX,
      parentY
    )

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        // Handle arrays
        const label = `${key} (${value.length} items)`
        const childIds: string[] = []

        nodes.push(
          createNode(
            nodeId,
            label,
            level === 0 ? 'root' : 'branch',
            level,
            position,
            value,
            childIds
          )
        )

        // Process array items
        value.forEach((item, index) => {
          const childId = processValue(
            `${index + 1}`,
            item,
            level + 1,
            nodeId,
            index,
            value.length,
            position.x,
            position.y
          )
          childIds.push(childId)
          edges.push(createEdge(nodeId, childId))
        })
      } else {
        // Handle objects
        const entries = Object.entries(value)
        const label = level === 0 ? key : `${key} (${entries.length})`
        const childIds: string[] = []

        nodes.push(
          createNode(
            nodeId,
            label,
            level === 0 ? 'root' : 'branch',
            level,
            position,
            value,
            childIds
          )
        )

        // Process object properties
        entries.forEach(([childKey, childValue], index) => {
          const childId = processValue(
            childKey,
            childValue,
            level + 1,
            nodeId,
            index,
            entries.length,
            position.x,
            position.y
          )
          childIds.push(childId)
          edges.push(createEdge(nodeId, childId))
        })
      }
    } else {
      // Handle primitive values
      const displayValue = value === null ? 'null' : String(value)
      const label = `${key}: ${
        displayValue.length > 50
          ? displayValue.slice(0, 50) + '...'
          : displayValue
      }`

      nodes.push(createNode(nodeId, label, 'leaf', level, position, value))
    }

    return nodeId
  }

  // Start processing from root level
  const rootEntries = Object.entries(mindMap)
  rootEntries.forEach(([key, value], index) => {
    processValue(key, value, 0, undefined, index, rootEntries.length)
  })

  // If no nodes were created, create a placeholder
  if (nodes.length === 0) {
    nodes.push(
      createNode(
        createNodeId(),
        'Empty Mind Map',
        'root',
        0,
        { x: 400, y: 300 },
        mindMap
      )
    )
  }

  return { nodes, edges }
}

export function validateMindMapData(
  data: unknown
): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
}
