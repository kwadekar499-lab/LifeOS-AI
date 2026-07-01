import type { 
  AssistantService, 
  MessageResponse, 
  StreamResponse,
  SendMessageOptions,
  StreamMessageOptions,
  AssistantContext 
} from "./assistant.service";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createMockAssistantService(
  context: AssistantContext = {
    memoryEnabled: true,
    knowledgeEnabled: true,
    tasksEnabled: false,
    journalEnabled: false,
    searchEnabled: false,
    toolsEnabled: false,
  } as AssistantContext
): AssistantService {
  let cancellationToken: { cancelled: boolean } | null = null;

  const simulateResponse = async (
    content: string,
    options?: SendMessageOptions
  ): Promise<MessageResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const responseContent = generateMockResponse(content, context, options?.tools ?? []);

    return {
      id: generateId(),
      conversationId: "", // Will be set by caller
      role: "assistant",
      content: responseContent,
      status: "completed",
      timestamp: new Date().toISOString(),
      metadata: {
        provider: "mock",
        model: "mock-model-v1",
        tokensUsed: Math.floor(content.length / 4) + Math.floor(responseContent.length / 4),
      },
    };
  };

  const simulateStreamResponse = async (
    content: string,
    options?: StreamMessageOptions
  ): Promise<StreamResponse> => {
    cancellationToken = { cancelled: false };
    
    const responseContent = generateMockResponse(content, context, options?.tools ?? []);
    const words = responseContent.split(" ");
    let accumulated = "";

    for (const word of words) {
      if (cancellationToken?.cancelled) {
        throw new Error("Generation cancelled");
      }

      accumulated += (accumulated ? " " : "") + word;
      
      if (options?.onToken) {
        options.onToken(word + " ");
      }

      // Simulate streaming delay
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50));
    }

    const response: StreamResponse = {
      id: generateId(),
      conversationId: "",
      role: "assistant",
      content: accumulated,
      status: "completed",
      timestamp: new Date().toISOString(),
      metadata: {
        provider: "mock",
        model: "mock-model-v1",
        tokensUsed: Math.floor(content.length / 4) + Math.floor(accumulated.length / 4),
      },
    };

    if (options?.onComplete) {
      options.onComplete(response);
    }

    return response;
  };

  return {
    sendMessage: async (
      conversationId: string,
      content: string,
      options?: SendMessageOptions
    ): Promise<MessageResponse> => {
      const response = await simulateResponse(content, options);
      return {
        ...response,
        conversationId,
      };
    },

    streamMessage: async (
      conversationId: string,
      content: string,
      options?: StreamMessageOptions
    ): Promise<StreamResponse> => {
      try {
        const response = await simulateStreamResponse(content, options);
        return {
          ...response,
          conversationId,
        };
      } catch (error) {
        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error("Unknown error"));
        }
        throw error;
      }
    },

    cancelGeneration: async (): Promise<void> => {
      if (cancellationToken) {
        cancellationToken.cancelled = true;
      }
      cancellationToken = null;
    },
  };
}

function generateMockResponse(
  userMessage: string,
  context: AssistantContext,
  tools?: SendMessageOptions["tools"]
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Tool usage simulation
  if (tools && tools.length > 0 && context.toolsEnabled) {
    const availableTools = tools.map((t) => t.name).join(", ");
    return `I can help you with that using the available tools: ${availableTools}. However, tool execution is not yet implemented in the mock service. This will be connected to the backend AI gateway in production.`;
  }

  // Context-aware responses
  if (lowerMessage.includes("task") && context.tasksEnabled) {
    return "I can help you manage your tasks. What would you like to do? Create, update, or search for tasks?";
  }

  if (lowerMessage.includes("memory") && context.memoryEnabled) {
    return "I have access to your memory. I can store and retrieve information about your preferences and past interactions.";
  }

  if (lowerMessage.includes("knowledge") && context.knowledgeEnabled) {
    return "I can search through your knowledge base to find relevant information for your questions.";
  }

  if (lowerMessage.includes("search") && context.searchEnabled) {
    return "I can perform web searches to find up-to-date information for you.";
  }

  // Default responses
  const defaultResponses: string[] = [
    "I understand you're asking about something. In the production version, I'll be connected to the LifeOS AI backend gateway to provide intelligent responses.",
    "That's an interesting question. Once connected to the backend, I'll be able to provide comprehensive answers using multiple AI providers.",
    "I'm here to help! The backend integration will enable me to access your data, perform searches, and execute tools on your behalf.",
    "Thanks for your message. I'm currently running in mock mode. The production version will support streaming responses, tool calling, and much more.",
  ];

  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex]!;
}

export const mockAssistantService = createMockAssistantService();