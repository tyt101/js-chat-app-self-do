import type { Tool } from "./tool";
import type { Model } from "./model";
import type { Message, ToolCall } from "./message";

export interface SendMessageProps {
  addUserMessage: (content: string | Array<any>) => Message;
  addAIMessage: () => Message;
  updateAIMessage: (messageId: string, content: string) => void;
  completeAIMessage: (messageId: string) => void;
  addErrorMessage: () => void;
  updateToolCalls: (messageId: string, toolCalls: ToolCall[]) => void;
  updateToolCallResults: (messageId: string, toolName: string, output: any) => void;
  updateToolCallError: (messageId: string, toolName: string, error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}


export interface ChatInputHandle {
  setInput: (value: string) => void;
  focus: () => void;
}

export interface ChatInputProps {
  onSend: (input: string, selectedTools?: string[], selectedModel?: string, images?: File[]) => void;
  disabled: boolean;
  availableTools: Tool[];
  availableModels: Model[];
  currentModel: string;
  onModelChange: (model: string) => void;
}