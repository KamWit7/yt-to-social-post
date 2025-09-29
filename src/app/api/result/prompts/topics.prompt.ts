export const getPrompt = (
  transcript?: string,
  language?: string
) => `You are tasked with analyzing a transcript and extracting the key topics discussed in the specified language. 
Follow these steps carefully:

1. Read the following transcript:

<transcript>
${transcript}
</transcript>

<language>
${language}
</language>

2. Analyze the transcript thoroughly, paying attention to recurring themes, main points of discussion, and significant ideas presented.

3. Identify the key topics from the transcript. 
Key topics are the main subjects or themes that are central to the discussion. 
They should be broad enough to encompass related subtopics but specific enough to convey the essence of what was discussed.

4. Create a list of these key topics in the specified language. Each topic should be:
   - Concise (preferably no more than 5-7 words)
   - Representative of a significant portion of the discussion
   - Distinct from other topics (avoid redundancy)

5. Format your list of key topics as follows:
   - Each topic should be on a new line
   - Each line should start with a dash (-)
   - Do not use numbering or any other bullet point style

6. Review your list to ensure it accurately represents the main points of the transcript without omitting any crucial topics or including overly specific or minor points.

Your final output should only include the list of key topics in the specified language, formatted as instructed. 
Do not include any additional commentary, explanations, or the transcript itself in your response. 
Begin your response with "Key topics:" on a separate line, followed by your bulleted list.`
