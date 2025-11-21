import api from './api'
import {
    Message,
    Conversation,
    SendMessageInput,
    SendMessageResponse,
    CreateConversationInput,
} from '@/types/chat.types'

export const aiService = {
    /**
     * Get all conversations for current user
     * GET /api/v1/ai/conversations
     */
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get<Conversation[]>('/ai/conversations')
        return response.data
    },

    /**
     * Get conversation by ID
     * GET /api/v1/ai/conversations/{id}
     */
    getConversation: async (id: string): Promise<Conversation> => {
        const response = await api.get<Conversation>(`/ai/conversations/${id}`)
        return response.data
    },

    /**
     * Get messages for a conversation
     * GET /api/v1/ai/conversations/{id}/messages
     */
    getMessages: async (conversationId: string): Promise<Message[]> => {
        const response = await api.get<Message[]>(`/ai/conversations/${conversationId}/messages`)
        return response.data
    },

    /**
     * Create new conversation
     * POST /api/v1/ai/conversations
     */
    createConversation: async (data: CreateConversationInput): Promise<Conversation> => {
        const response = await api.post<Conversation>('/ai/conversations', data)
        return response.data
    },

    /**
     * Send message to AI assistant
     * POST /api/v1/ai/chat
     */
    sendMessage: async (data: SendMessageInput): Promise<SendMessageResponse> => {
        const response = await api.post<SendMessageResponse>('/ai/chat', data)
        return response.data
    },

    /**
     * Delete conversation
     * DELETE /api/v1/ai/conversations/{id}
     */
    deleteConversation: async (id: string): Promise<void> => {
        await api.delete(`/ai/conversations/${id}`)
    },

    /**
     * Archive conversation
     * PUT /api/v1/ai/conversations/{id}/archive
     */
    archiveConversation: async (id: string): Promise<void> => {
        await api.put(`/ai/conversations/${id}/archive`)
    },
}
