import { useCallback } from "react";
import type { SendMessageProps } from "../types/send";
import { getApp } from "../agent";
import { Message } from "@langchain/core/messages";
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

  const sendMessage = useCallback(async (
    input: string,
    selectedTools: string[],
    selectedModel: string,
    images: File[],
  ) => {
    console.log('sendMessage', input, selectedTools, selectedModel, images);


    try {
      setIsLoading(true);

      // 添加用户消息（文本或图片）
      let messageContent :String | Array<any> = input;
      const imageData : Array<{ data: string, mimeType: string }> = []

      if (images && images.length > 0) {
        // 将图片转换为 base64 数据
        for (const image of images) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result as string;
              const base64Data = result.split(',')[1];
              resolve(base64Data);
            }
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(image);
          });
          imageData.push({ data: base64, mimeType: image.type });
        }
      }

      messageContent = [{
        type: 'text',
        text: input,
      }, ...imageData.map((image) => ({
        type: 'image_url',
        image_url: {
          url: `data:${image.mimeType};base64,${image.data}`,
        },
      }))]


      addUserMessage(messageContent);

      // 创建AI消息占位

      const aiMessage = addAIMessage() as Message
      // 发送请求
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          model: selectedModel,
          tools: selectedTools,
          messages: messageContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      // 读取流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader');
      }
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log('value', value);
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              console.log('data', data);
              if (data.type === 'chunk') {
                updateAIMessage(aiMessage.id!, data.content);
              } else if (data.type === 'tool_calls') {
                updateToolCalls(aiMessage.id!, data.tool_calls);
              } else if (data.type === 'tool_result') {
                updateToolCallResults(aiMessage.id!, data.name, data.data);
              } else if (data.type === 'tool_error') {
                updateToolCallError(aiMessage.id!, data.name, data.data);
              } else if (data.type === 'end') {
                completeAIMessage(aiMessage.id!);
              } else {
                console.error('未知数据类型:', data);
              }
            } catch (error) {
              console.error('解析流数据错误:', error)
            }
          }
        }
      }


      
    } catch (error) {
      console.error('发送消息时出错:', error)
      addErrorMessage();
    } finally {
      setIsLoading(false);
    }

  }, []);

  return {
    sendMessage
  }
}