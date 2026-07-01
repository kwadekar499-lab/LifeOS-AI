import { Injectable, Logger } from '@nestjs/common';
import { AssistantIntent } from '../interfaces/assistant-orchestrator.interface';

@Injectable()
export class IntentClassifier {
  private readonly logger = new Logger(IntentClassifier.name);

  classify(message: string): AssistantIntent {
    const lowerMessage = message.toLowerCase();

    const taskKeywords = ['task', 'todo', 'create task', 'add task', 'list tasks', 'complete task', 'update task'];
    const memoryKeywords = ['remember', 'recall', 'what did i', 'memory', 'memories'];
    const knowledgeKeywords = ['search knowledge', 'find information', 'knowledge base', 'what is', 'how to'];
    const journalKeywords = ['journal', 'write journal', 'create journal', 'my journal', 'diary'];
    const conversationKeywords = ['search conversation', 'what did we discuss', 'previous chat', 'history'];

    if (this.containsKeywords(lowerMessage, journalKeywords)) {
      return 'journal';
    }

    if (this.containsKeywords(lowerMessage, taskKeywords)) {
      return 'task_management';
    }

    if (this.containsKeywords(lowerMessage, memoryKeywords)) {
      return 'memory_retrieval';
    }

    if (this.containsKeywords(lowerMessage, knowledgeKeywords)) {
      return 'knowledge_search';
    }

    if (this.containsKeywords(lowerMessage, conversationKeywords)) {
      return 'conversation_search';
    }

    if (message.trim().length > 10) {
      return 'general_chat';
    }

    return 'unknown';
  }

  determineRequiredSources(intent: AssistantIntent): string[] {
    switch (intent) {
      case 'task_management':
        return ['task'];
      case 'memory_retrieval':
        return ['memory'];
      case 'knowledge_search':
        return ['knowledge'];
      case 'journal':
        return ['journal'];
      case 'conversation_search':
        return ['conversation'];
      case 'general_chat':
      case 'mixed':
        return ['memory', 'conversation', 'knowledge', 'task', 'journal'];
      default:
        return [];
    }
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some((keyword) => message.includes(keyword));
  }
}
