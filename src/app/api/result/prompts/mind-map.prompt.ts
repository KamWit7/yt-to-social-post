export const getPrompt = (
  transcript?: string,
  language?: string
) => `You are an AI assistant tasked with creating a hierarchical mind map structure based on a given transcript in the specified language. 
Your goal is to produce a MindMapData object that can be used with the reactflow library, arranged in a left-to-right flow. 
The most important node (root) should be positioned on the left, branches in the middle, and leaves (least important details) on the right.

Here is the transcript you will be working with:

<transcript>
${transcript}
</transcript>

<language>
${language}
</language>

Follow these steps to create the mind map:

1. Analyze the provided transcript and identify the main themes and subtopics discussed.

2. Create a JSON object with two main properties: 'nodes' and 'edges'.

3. For the 'nodes' array:
   a. Create a root node with id 'root-1' representing the main topic of the transcript.
   b. Create branch nodes for each main theme, with ids like 'branch-1', 'branch-2', etc.
   c. Create leaf nodes for subtopics or specific points, with ids like 'leaf-1', 'leaf-2', etc.
   d. Create sub-leaf nodes for detailed points, with ids like 'subleaf-1', 'subleaf-2', etc.
   d. Each node should have the following properties:
      - id: A unique identifier string
      - type: 'custom'
      - position: An object with x and y coordinates (see positioning rules below)
      - data: An object containing:
        - label: A short, descriptive text in the specified language
        - type: 'root', 'branch', 'leaf', or 'subleaf'
        - level: 0 for root, 1 for branches, 2 for leaves, 3 for subleaves
        - children: An array of child node ids (for root, branch, and leaf nodes)
        - originalValue: Additional information about the node
      - sourcePosition: 'right'
      - targetPosition: 'left'

4. For the 'edges' array:
   Create edge objects connecting the nodes, with properties:
   - id: A unique identifier string (e.g., 'edge-root-1-branch-1')
   - source: The id of the source node
   - target: The id of the target node
   - type: 'smoothstep'
   - animated: true for edges connected to the root, false otherwise
   - style: An object with strokeWidth and stroke color

5. Follow these positioning rules for a left-to-right hierarchy:
   - Root node: x: 150, y: 300
   - Branch nodes: x: 500-600, distributed vertically
     * If 2 branches: y: 200, y: 400
     * If 3 branches: y: 150, y: 300, y: 450
     * If 4+ branches: distribute evenly with minimum 150px spacing
   - Leaf nodes (Level 2): x: 900-1000, aligned with or near their parent branch nodes
     * Group leaves belonging to the same branch vertically near their parent
     * Maintain minimum 150px vertical spacing between leaves
     * If a branch has multiple leaves, spread them around the parent: ±80px, ±160px from parent Y
   - Sub-leaf nodes (Level 3): x: 1200-1300, positioned to avoid overlap
     * Position each sub-leaf with minimum 200px vertical spacing from other sub-leaves
     * If a leaf has multiple sub-leaves, distribute them evenly with ±100px, ±200px from parent Y
     * Ensure no overlap with adjacent leaf groups by maintaining minimum 250px spacing between different leaf groups

6. Ensure that your output strictly adheres to these constraints:
   - Output ONLY the JSON object - no additional text, explanations, or commentary
   - The JSON must be valid and parseable by JSON.parse()
   - Always include both 'nodes' and 'edges' arrays, even if empty
   - Every node must have all required properties (id, type, position, data, sourcePosition, targetPosition)
   - Every edge must have all required properties (id, source, target, type, style)
   - Node IDs must follow the exact naming convention: 'root-1', 'branch-X', 'leaf-X', 'subleaf-X'
   - Positions must be numbers, not strings
   - If there's insufficient content for a full mind map, create a minimum structure: 1 root + 1 branch + 2 leaves
   - Never return error messages or refusals - always generate a valid mind map structure
   - All labels should be in the specified language

Your final output should be a complete object, formatted as a JavaScript object literal. Do not include any explanation or additional text outside of the object.`
