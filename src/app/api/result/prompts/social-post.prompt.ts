export const getPrompt = (
  transcript?: string,
  language?: string
) => `Here is the transcript to analyze:

<transcript>
${transcript}
</transcript>

<language>
${language}
</language>

Carefully read and analyze the transcript to identify the most interesting, educational, or discussion-worthy topic. Choose ONLY ONE main topic to focus on.

Now, create a detailed social media post about your selected topic in the specified language, following these guidelines:
1. Keep the post between 800-1200 characters for detailed coverage.
2. Focus on ONE specific topic from the transcript - do not try to cover multiple topics.
3. Provide detailed information, examples, or insights about the chosen topic.
4. Use clear, engaging language that educates and informs your audience.
5. Include specific examples or details from the transcript to support your points.
6. Frame the content in a way that encourages interaction and discussion.
7. If applicable, include a call-to-action that prompts readers to share their thoughts or experiences.

After crafting the main content of the post, add relevant hashtags that will increase its visibility and reach the appropriate audience.

Present your final social media post in the following format:

[Your detailed post about the selected topic here]

[Relevant hashtags]

Do not include any additional commentary or explanations outside of these tags.`
