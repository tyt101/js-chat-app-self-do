import type { MessageBubbleProps } from "../types/message";
export function MessageBubble({ message, index }: MessageBubbleProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">Message Bubble {index}</h1>
    </div>
  );
}