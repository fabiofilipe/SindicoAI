export type MessageRole = 'user' | 'assistant' | 'system'
export type ConversationStatus = 'active' | 'archived'

export interface Message {
    id: string
    conversation_id: string
    role: MessageRole
    content: string
    created_at: string
}

export interface Conversation {
    id: string
    tenant_id: string
    user_id: string
    title: string
    status: ConversationStatus
    message_count: number
    last_message_at: string
    created_at: string
    updated_at: string
}

export interface SendMessageInput {
    conversation_id?: string
    content: string
}

export interface SendMessageResponse {
    message: Message
    assistant_message: Message
    conversation_id: string
}

export interface CreateConversationInput {
    title?: string
}
