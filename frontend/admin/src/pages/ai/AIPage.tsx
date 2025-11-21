import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Plus, Trash2, MessageSquare } from 'lucide-react'
import { HologramCard, Button, Modal } from '@/components'
import ChatMessage from '@/components/ai/ChatMessage'
import ChatInput from '@/components/ai/ChatInput'
import SuggestedQuestions from '@/components/ai/SuggestedQuestions'
import { Message, Conversation } from '@/types/chat.types'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'

// Mock data
const mockConversations: Conversation[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        user_id: 'user1',
        title: 'Consulta sobre taxas',
        status: 'active',
        message_count: 4,
        last_message_at: '2024-01-20T15:30:00Z',
        created_at: '2024-01-20T14:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        user_id: 'user1',
        title: 'Reserva de área comum',
        status: 'active',
        message_count: 2,
        last_message_at: '2024-01-19T10:00:00Z',
        created_at: '2024-01-19T09:45:00Z',
        updated_at: '2024-01-19T10:00:00Z',
    },
]

const mockMessages: Message[] = [
    {
        id: '1',
        conversation_id: '1',
        role: 'user',
        content: 'Olá! Gostaria de saber sobre as taxas condominiais deste mês.',
        created_at: '2024-01-20T14:00:00Z',
    },
    {
        id: '2',
        conversation_id: '1',
        role: 'assistant',
        content:
            'Olá! Claro, posso ajudar com isso. As taxas condominiais deste mês incluem:\n\n- **Taxa ordinária**: R$ 350,00\n- **Fundo de reserva**: R$ 50,00\n- **Taxa de água**: R$ 80,00\n- **Total**: R$ 480,00\n\nO vencimento é dia 10 de cada mês. Você gostaria de saber mais alguma coisa sobre as taxas?',
        created_at: '2024-01-20T14:00:30Z',
    },
    {
        id: '3',
        conversation_id: '1',
        role: 'user',
        content: 'Sim, existe alguma multa por atraso?',
        created_at: '2024-01-20T15:25:00Z',
    },
    {
        id: '4',
        conversation_id: '1',
        role: 'assistant',
        content:
            'Sim, em caso de atraso no pagamento, são aplicadas:\n\n- **Multa**: 2% sobre o valor total\n- **Juros**: 1% ao mês\n- **Correção monetária**: Conforme IGPM\n\nRecomendo efetuar o pagamento até a data de vencimento para evitar esses encargos.',
        created_at: '2024-01-20T15:25:15Z',
    },
]

const suggestedQuestions = [
    'Como faço para reservar o salão de festas?',
    'Quais são as regras do condomínio?',
    'Como solicitar manutenção?',
    'Quando será a próxima assembleia?',
]

const AIPage = () => {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
        mockConversations[0]
    )
    const [messages, setMessages] = useState<Message[]>(mockMessages)
    const [isLoadingResponse, setIsLoadingResponse] = useState(false)
    const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal()
    const { toast, hideToast, success, error } = useToast()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            conversation_id: selectedConversation?.id || 'new',
            role: 'user',
            content,
            created_at: new Date().toISOString(),
        }

        setMessages([...messages, userMessage])
        setIsLoadingResponse(true)

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                conversation_id: selectedConversation?.id || 'new',
                role: 'assistant',
                content:
                    'Entendi sua pergunta. Como assistente virtual do condomínio, posso ajudá-lo com informações sobre:\n\n- Taxas e pagamentos\n- Reservas de áreas comuns\n- Regulamentos do condomínio\n- Solicitação de manutenção\n- Documentos e comunicados\n\nPor favor, seja mais específico para que eu possa ajudá-lo melhor!',
                created_at: new Date().toISOString(),
            }

            setMessages((prev) => [...prev, assistantMessage])
            setIsLoadingResponse(false)
        }, 1500)
    }

    const handleSuggestedQuestion = (question: string) => {
        handleSendMessage(question)
    }

    const handleNewConversation = () => {
        const newConv: Conversation = {
            id: Date.now().toString(),
            tenant_id: 'tenant1',
            user_id: 'user1',
            title: 'Nova conversa',
            status: 'active',
            message_count: 0,
            last_message_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        setConversations([newConv, ...conversations])
        setSelectedConversation(newConv)
        setMessages([])
        success('Nova conversa iniciada!')
    }

    const handleDeleteConversation = async () => {
        if (!conversationToDelete) return

        try {
            // await aiService.deleteConversation(conversationToDelete.id)
            setConversations(conversations.filter((c) => c.id !== conversationToDelete.id))

            if (selectedConversation?.id === conversationToDelete.id) {
                setSelectedConversation(conversations[0] || null)
                setMessages([])
            }

            success('Conversa removida com sucesso!')
            closeDelete()
        } catch {
            error('Erro ao remover conversa')
        }
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Conversations Sidebar */}
            <div className="w-80 flex flex-col gap-4">
                {/* New Conversation Button */}
                <Button onClick={handleNewConversation} className="btn-glow w-full">
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Conversa
                </Button>

                {/* Conversations List */}
                <HologramCard className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-cyan-glow/30">
                        <h3 className="text-lg font-bold text-cyan flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Conversas
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        <AnimatePresence>
                            {conversations.map((conv, index) => (
                                <motion.div
                                    key={conv.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                                        group relative p-3 rounded-lg border cursor-pointer transition-all
                                        ${
                                            selectedConversation?.id === conv.id
                                                ? 'bg-cyan/10 border-cyan shadow-glow'
                                                : 'bg-coal-light border-cyan-glow/30 hover:border-cyan/50'
                                        }
                                    `}
                                    onClick={() => {
                                        setSelectedConversation(conv)
                                        // Load messages for this conversation
                                        // setMessages(await aiService.getMessages(conv.id))
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-metal-silver truncate">
                                                {conv.title}
                                            </h4>
                                            <p className="text-xs text-metal-silver/60 mt-1">
                                                {conv.message_count} mensagens
                                            </p>
                                            <p className="text-xs text-metal-silver/40 mt-0.5 font-mono">
                                                {new Date(conv.last_message_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setConversationToDelete(conv)
                                                openDelete()
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-criticalred/20 rounded transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-criticalred" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </HologramCard>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <HologramCard className="flex-1 flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-cyan-glow/30 bg-gradient-to-r from-coal to-coal-light">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-techblue flex items-center justify-center">
                                <Bot className="w-7 h-7 text-coal" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-cyan text-glow-cyan">
                                    Assistente IA do Condomínio
                                </h2>
                                <p className="text-sm text-metal-silver/60 font-mono">
                                    Sistema Online • Pronto para ajudar
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-tech-grid">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center mb-8"
                                >
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan/20 to-techblue/20 flex items-center justify-center border border-cyan-glow/30">
                                        <Bot className="w-10 h-10 text-cyan" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-cyan mb-2">
                                        Olá! Como posso ajudar?
                                    </h3>
                                    <p className="text-metal-silver/60">
                                        Selecione uma pergunta sugerida ou digite sua dúvida
                                    </p>
                                </motion.div>

                                <SuggestedQuestions
                                    questions={suggestedQuestions}
                                    onSelect={handleSuggestedQuestion}
                                />
                            </div>
                        ) : (
                            <>
                                <AnimatePresence>
                                    {messages.map((message) => (
                                        <ChatMessage
                                            key={message.id}
                                            role={message.role === 'system' ? 'assistant' : message.role}
                                            content={message.content}
                                            timestamp={message.created_at}
                                        />
                                    ))}
                                </AnimatePresence>

                                {isLoadingResponse && (
                                    <ChatMessage
                                        role="assistant"
                                        content="Digitando..."
                                    />
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-cyan-glow/30 p-6 bg-coal-light">
                        <ChatInput
                            onSend={handleSendMessage}
                            disabled={isLoadingResponse}
                            placeholder="Digite sua mensagem..."
                        />
                    </div>
                </HologramCard>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDelete} title="Confirmar Exclusão" size="md">
                <div className="space-y-4">
                    <p className="text-metal-silver">
                        Tem certeza que deseja remover a conversa{' '}
                        <span className="text-cyan font-bold">{conversationToDelete?.title}</span>?
                    </p>
                    <div className="bg-criticalred/10 border border-criticalred/30 rounded-lg p-4">
                        <p className="text-sm text-criticalred">
                            Esta ação não pode ser desfeita e todas as mensagens serão perdidas.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeDelete} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteConversation} className="flex-1 bg-gradient-alert">
                            Confirmar Exclusão
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast */}
            <Toast
                message={toast.message}
                variant={toast.variant}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    )
}

export default AIPage
