// /api/chat接口实现
import { NextRequest, NextResponse } from "next/server";
import { getApp } from "@/app/agent";
import { HumanMessage } from "@langchain/core/messages";

// post /api/chat
export async function  POST(request: NextRequest) {
  try {
    console.log('POST /api/chat', request);
    const thread_id = 'ex1u23'
    const threadConfig = { configurable: { thread_id: thread_id } };
    const { model, tools, messages } = await request.json();
    
    // 将前端消息格式转换为 LangChain 消息格式
    const langChainMessages = [new HumanMessage({ content: messages })];
    
    let completeMessage: any = null;

    const stream = new ReadableStream({
      async start(controller) {
        const app = await getApp(model, tools);
        for await (const event of app.streamEvents(
          {messages: langChainMessages},
          { version: 'v2', ...threadConfig }
        )) {
          if (event.event === 'on_chat_model_stream') {
            const chunk = event.data?.chunk;
            if (chunk?.content) {
              // 发送内容片段（保持现有的流式体验）
              const data =
                JSON.stringify({
                  type: 'chunk',
                  content: chunk.content,
                }) + '\n';
              controller.enqueue(new TextEncoder().encode(data));
            }
          }
          // 捕获模型完成事件，获取最终消息
          else if (event.event === 'on_chat_model_end') {
            const output = event.data?.output;
            // 保存完整的最终消息
            completeMessage = output;
            if (output?.tool_calls && output.tool_calls.length > 0) {
              // 透传原始 tool_calls 数据，避免字段丢失
              const toolCallData = JSON.stringify({
                type: 'tool_calls',
                tool_calls: output.tool_calls
              }) + '\n';
              controller.enqueue(new TextEncoder().encode(toolCallData));
            }
          }
          // 捕获工具执行结果
          else if (event.event === 'on_tool_end') {
            // 透传完整的工具执行信息
            const toolCallData = JSON.stringify({
              type: 'tool_result',
              name: event.name,
              data: event.data  // 透传完整的 data 对象
            }) + '\n';
            controller.enqueue(new TextEncoder().encode(toolCallData));
          }
          // 捕获工具执行错误
          else if (event.event === 'on_tool_error') {
            // 透传完整的错误信息
            const toolErrorData = JSON.stringify({
              type: 'tool_error',
              name: event.name,
              data: event.data  // 透传完整的 data 对象，包含错误堆栈等
            }) + '\n';
            controller.enqueue(new TextEncoder().encode(toolErrorData));
          }
        }
        // 序列化最终消息对象（用于传输）
        const serializedMessage = completeMessage 
          ? JSON.parse(JSON.stringify(completeMessage)) as any 
          : null;

        // 发送结束标记，包含最终消息
        const endData =
          JSON.stringify({
            type: 'end',
            status: 'success',
            message: serializedMessage, // 发送最终消息
          }) + '\n';
        controller.enqueue(new TextEncoder().encode(endData));
        controller.close();
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('聊天 API 错误:', error);
    return NextResponse.json(
      {
        error: '服务器内部错误',
        response: '抱歉，处理你的请求时出现了问题。请稍后重试。',
      },
      { status: 500 }
    );
  }
}


// get /api/chat
export async function GET(request: NextRequest) {
  
}