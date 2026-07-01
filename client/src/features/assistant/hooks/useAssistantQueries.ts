import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationsApi } from "@/api/conversations";
import { assistantApi } from "@/api/assistant";
import { useAssistantStore } from "@/stores/assistantStore";
import type { CreateConversationDto } from "@/types/api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await conversationsApi.list();
      return res.data?.data || [];
    },
  });
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await conversationsApi.getMessages(conversationId);
      // Backend returns PaginatedResult<Message> where .data contains messages array
      return res.data?.data || [];
    },
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const setActiveConversationId = useAssistantStore((s) => s.setActiveConversationId);
  return useMutation({
    mutationFn: async (dto: CreateConversationDto) => {
      const res = await conversationsApi.create(dto);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data && data.id) {
        setActiveConversationId(data.id);
      }
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const activeConversationId = useAssistantStore((s) => s.activeConversationId);
  const setActiveConversationId = useAssistantStore((s) => s.setActiveConversationId);
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await conversationsApi.delete(id);
      return res.data;
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (activeConversationId === deletedId) {
        setActiveConversationId(null);
      }
    },
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const res = await conversationsApi.update(id, { title });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useTogglePinConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: string; isPinned: boolean }) => {
      if (isPinned) {
        const res = await conversationsApi.unpin(id);
        return res.data;
      } else {
        const res = await conversationsApi.pin(id);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const setActiveConversationId = useAssistantStore((s) => s.setActiveConversationId);
  return useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId?: string; message: string }) => {
      const res = await assistantApi.chat({
        conversationId: conversationId || undefined,
        message,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data && data.conversationId) {
        setActiveConversationId(data.conversationId);
        queryClient.invalidateQueries({ queryKey: ["messages", data.conversationId] });
      }
    },
  });
}
