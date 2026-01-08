import { useCallback, useState } from "react";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { Message } from "../types/message";
export function useChatMessages() {
  // 消息列表
  const [messages, setMessages] = useState<Message[]>([]);
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 添加用户消息
   */

  const addUserMessage = useCallback((content: string | Array<any>) : Message => {
    const userMessage = new HumanMessage({
      content,
      id: Date.now().toString()
    }) as Message

    setMessages((prev) => [...prev, userMessage])
    return userMessage;
  }, []);
  
  /**
   * 添加AI消息
   */
  const addAIMessage = useCallback(() : Message => {
    const aiMessage = new AIMessage({
      content: '',
      id: (Date.now() + 1).toString()
    }) as Message

    const streamingMessage = {
      ...aiMessage,
      isStreaming: true,
    } as Message

    setMessages((prev) => [...prev, streamingMessage])
    return streamingMessage;
  }, []);
  
  /**
   * 更新AI消息
   * AI 流式回复时，更新消息内容
   */
  const updateAIMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) => prev.map((msg) => {
      if (msg.id === messageId) {
        const currentMessage = typeof msg.content === 'string' ? msg.content : ''
        const updateMessage = new AIMessage({
          content: currentMessage + content,
          id: msg.id
        }) as Message
        updateMessage.isStreaming = true;
        updateMessage.tool_calls = msg.tool_calls;
        updateMessage.toolCallResults = msg.toolCallResults;
        return updateMessage;
      }
      return msg;
    }))
  }, []);

  /**
   * 完成AI消息
   * 流式回复结束，更新消息状态为完成
   */

  const completeAIMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.map((msg) => {
      if (msg.id === messageId) {
        const updated = {
          ...msg,
          isStreaming: false,
        } as Message
        return updated;
      }
      return msg;
    }))
  }, []);

  /**
   * 添加错误消息
   */

  const addErrorMessage = useCallback(() => {
    const errorMessage = new AIMessage({
      content: '抱歉，发送消息时出现错误，请稍后重试。。。',
      id: (Date.now() + 1).toString()
    }) as Message

    setMessages((prev) => [...prev, errorMessage])
  }, [])


  /**
   * 清空消息
   */

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * 加载消息列表
   */

  const loadMessages = useCallback((historyMessages: Message[]) => {
    setMessages(historyMessages.length > 0 ? historyMessages : []);
  }, []);

  /**
   * 更新消息的工具调用信息
   */

  const updateToolCalls = useCallback((messageId: string, toolCalls: ToolCall[]) => {
    setMessages((prev) => prev.map(msg => {
      if (msg.id === messageId) {
        const updatedMsg = {
          ...msg,
          toolCallResults: toolCalls,
        } as Message
        return updatedMsg;
      }
      return msg;
    }))
  }, [])


  /**
   * 更新工具调用结果
   */

  const updateToolCallResults = useCallback((messageId: string, toolName: string, output: any) => {
    setMessages((prev)=>prev.map(msg => {
      if (msg.id === messageId) {
        const toolCalls = msg.toolCallResults || []
        const updatedToolCalls = toolCalls.map(toolCall =>{
          return toolCall.name === toolName ? {
            ...toolCall,
            output
          } : toolCall;
        })
        const updatedMsg = {
          ...msg,
          toolCallResults: updatedToolCalls,
        } as Message
        return updatedMsg;
      }
      return msg;
    }))
  }, [])

  /**
   * 更新工具调用错误
   */

  const updateToolCallError = useCallback((messageId: string, toolName: string, error: string) => {
    setMessages((prev)=>prev.map(msg => {
      if (msg.id === messageId) {
        const toolCalls = msg.toolCallResults || []
        const updatedToolCalls = toolCalls.map(toolCall =>{
          return toolCall.name === toolName ? {
            ...toolCall,
            error
          } : toolCall;
        })
        const updatedMsg = {
          ...msg,
          toolCallResults: updatedToolCalls,
        } as Message
        return updatedMsg;
      }
      return msg;
    }))
  }, [])
  return { 
    messages, 
    isLoading,
    addUserMessage,
    addAIMessage,
    updateAIMessage,
    completeAIMessage,
    addErrorMessage,
    clearMessages,
    loadMessages,
    updateToolCalls,
    updateToolCallResults,
    updateToolCallError,
    setIsLoading,
  };
} 