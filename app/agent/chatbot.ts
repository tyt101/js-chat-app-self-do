// 聊天机器人实现
// 基于 LangGraph 构建对话流程，支持工具调用和流式响应
import { ChatOpenAI } from '@langchain/openai';
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END
} from '@langchain/langgraph';
export const getApp = async (modelId?: string, toolIds?: string[]) => {

  const fullId = modelId || 'openai:qwen-max'
  const [provider, modelName] = fullId.includes(':')
    ? fullId.split(':', 2)
    : ['google', fullId]

  // 创建模型实例
  const model = new ChatOpenAI({
    model: modelName,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    },
    temperature: 0.7,
    streaming: true,
  })

  // 创建聊天节点： 处理用户输入并生成回复
  async function chatbotNode(state: typeof MessagesAnnotation.State) {
    try {
      const response = await model.invoke(state.messages)

      return {
        messages: [response],
      }
    } catch (error) {
      console.error('chatbotNode 错误详情:', error);
      console.error('错误栈:', error instanceof Error ? error.stack : '无栈信息');
      throw error;
    }
  }

  // 创建图结构
  const graph = new StateGraph(MessagesAnnotation)
  graph.addNode('chatbot', chatbotNode)
  graph.addEdge(START, 'chatbot')
  graph.addEdge('chatbot', END)

  return graph.compile();
}