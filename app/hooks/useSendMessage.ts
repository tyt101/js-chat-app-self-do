import { useCallback } from "react";
import type { SendMessageProps } from "../types/send";
export function useSendMessage({
  addUserMessage,
  addAIMessage,
  updateAIMessage,
  completeAIMessage,
  addErrorMessage,
  updateToolCalls,
  updateToolCallResults,
  updateToolCallError,
  setIsLoading,
}: SendMessageProps) {

  /**
   * 发送消息并处理响应
   *
   * 流程:
   * 1. 添加用户消息到列表
   * 2. 发送 POST 请求到 /api/chat
   * 3. 更新会话名称(如果是第一条消息)
   * 4. 创建空的 AI 消息
   * 5. 读取流式响应并逐步更新消息内容
   * 6. 完成后移除打字光标
   *
   * @param input - 用户输入的消息内容
   * @param selectedTools - 用户选择的工具 ID 列表（可选）
   * @param selectedModel - 用户选择的模型 ID（可选）
   * @param images - 上传的图片文件列表（可选）
   */

  const sendMessage = useCallback((message: string) => {
    console.log('sendMessage', message);
  }, []);

  return {
    sendMessage
  }
}