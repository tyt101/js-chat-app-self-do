'use client';
import { useMemo, useRef, useState } from "react";
import { ChatInputHandle } from "./types/send";

import SessionSidebar from "./components/SessionSidebar";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { Tool } from "./types/tool";
import { Model } from "./types/model";
import { useChatMessages } from "./hooks/useChatMessages";
import { useSendMessage } from "./hooks/useSendMessage";

export default function ChatPage() {

  // 消息管理
  const { 
    messages,       
    isLoading,
    setIsLoading,
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
  } = useChatMessages();

  // 消息发送
  const { sendMessage } = useSendMessage({
    addUserMessage,
    addAIMessage,
    updateAIMessage,
    completeAIMessage,
    addErrorMessage,
    updateToolCalls,
    updateToolCallResults,
    updateToolCallError,
    setIsLoading,
  });

  // 消息输入框引用
  const chatInputRef = useRef<ChatInputHandle>(null);

  // 可用工具
  const availableTools = useMemo<Tool[]>(() => {
    return []
  }, []);
  // 可用模型
  const availableModels = useMemo<Model[]>(
    () => [
      // Google Gemini 模型
      {
        id: 'google:gemini-3-pro-preview',
        name: 'Gemini 3 Pro Preview',
        description: '最强大的 Gemini 3 预览版，顶级性能和推理能力',
      },
      {
        id: 'google:gemini-3-flash-preview',
        name: 'Gemini 3 Flash Preview',
        description: 'Gemini 3 快速预览版，高性能与快速响应的平衡',
      },
      {
        id: 'google:gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: '强大的多模态模型，平衡性能与速度',
      },
      {
        id: 'google:gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: '快速响应，适合日常对话',
      },
      {
        id: 'google:gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite',
        description: '超快速的轻量级模型',
      },
      // 通义千问模型（OpenAI 兼容模式）
      {
        id: 'openai:qwen3-max',
        name: '通义千问 3 Max',
        description: '最新 Qwen3 旗舰模型，超强推理能力',
      },
      {
        id: 'openai:qwen-plus',
        name: '通义千问 Plus',
        description: '平衡性能与成本的高性能模型',
      },
      {
        id: 'openai:qwen-flash',
        name: '通义千问 Flash',
        description: '快速响应，高性价比',
      },
      {
        id: 'openai:qwen3-vl-plus',
        name: '通义千问 3 VL Plus',
        description: '多模态视觉语言模型，支持图文理解',
      },
      // DeepSeek 模型（OpenAI 兼容模式）
      {
        id: 'openai:deepseek-v3.2',
        name: 'DeepSeek V3.2',
        description: 'DeepSeek 最新模型，强大的推理能力',
      },
    ],
    []
  );
  // 当前模型
  const [currentModel, setCurrentModel] = useState<string>('openai:qwen3-max');

  return (
    <main className="flex-1 flex flex-row relative h-full overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 tech-grid-bg z-0 pointer-events-none"></div>
      <div className="ambient-glow"></div>
      {/* 左侧历史侧边栏 */}
      <SessionSidebar />
      {/* 右侧主题聊天内容区域 */}
      <div className="flex-1 flex flex-col z-10 overflow-hidden relative h-full">
        {/* 顶部导航栏 */}
        <ChatHeader />
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* 消息列表 */}
          <div
            className='flex-1 overflow-y-auto scrollbar-hide scroll-smooth flex flex-col z-10 pb-32'
            id='chat-container'
          >
            <MessageList messages={messages} isLoading={isLoading} />
          </div>
          {/* 消息输入框 */}
          <div className='absolute bottom-8 left-0 right-0 px-4 md:px-8 flex justify-center z-30'>
            <ChatInput 
              ref={chatInputRef}
              onSend={sendMessage} 
              disabled={isLoading}
              availableTools={availableTools}
              availableModels={availableModels}
              currentModel={currentModel}
              onModelChange={setCurrentModel}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
