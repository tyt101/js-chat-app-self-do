import { useEffect, useRef } from "react";
import type { MessageListProps } from "../types/message";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";
export function MessageList({ 
  messages, 
  isLoading 
}: MessageListProps) {

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return <EmptyState />
  }

  return (
    <div className="w-full max-w-5xl mx-autp [x=4 flex flex-col pb-32">
      {/* 消息列表 */}
      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} index={index} />
      ))}
    </div>
  );
}