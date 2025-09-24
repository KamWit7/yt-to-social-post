'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import {
  ChatInput,
  MessageBubble,
  WelcomeMessage,
  type Message,
} from '../../components/chat'

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [currentResponse, setCurrentResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse])

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setCurrentResponse('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          history: messages.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })),
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = (await reader?.read()) ?? {
          done: true,
          value: null,
        }

        if (done) {
          break
        }

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('data: ').filter((line) => line.trim() !== '')

        for (const line of lines) {
          if (line === '[DONE]') {
            break
          }

          const data = JSON.parse(line)
          if (data.text) {
            fullResponse += data.text
            setCurrentResponse(fullResponse)
          }
        }
      }

      // Add the complete response to messages
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setCurrentResponse('')
    } catch (error) {
      console.error('Chat API error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
      {/* Messages Container */}
      <Card className='flex-1 flex flex-col bg-card/50 backdrop-blur-sm shadow-xl border-border/50'>
        <CardContent className='flex-1 overflow-hidden p-0'>
          <div className='h-full overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6'>
            {messages.length === 0 && <WelcomeMessage />}

            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {currentResponse && (
              <MessageBubble
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: currentResponse,
                  timestamp: new Date(),
                }}
                isStreaming
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input Area */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  )
}
