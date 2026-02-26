'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className="flex-1 overflow-y-auto custom-scroll px-4 py-4 space-y-2"
      style={{ background: 'var(--bg-chat)' }}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
