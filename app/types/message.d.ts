import { BaseMessage } from "@langchain/core/messages";

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  output?: any;
  error?: string;
}

export interface Message extends BaseMessage {
  isStreaming?: boolean;
  tool_calls?: ToolCall[];
  toolCallResults?: ToolCall[];
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export interface MessageBubbleProps {
  message: Message;
  index: number;
}