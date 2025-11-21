import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { MainLayout, Button, Input } from '@/components'

interface Message {
    id: number
    sender: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const AssistantPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'assistant',
            content:
                'Olá! Sou o assistente virtual do SindicoAI. Como posso ajudá-lo hoje?',
            timestamp: new Date(),
        },
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto scroll para última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!inputMessage.trim()) return

        // Adiciona mensagem do usuário
        const userMessage: Message = {
            id: messages.length + 1,
            sender: 'user',
            content: inputMessage,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputMessage('')
        setIsTyping(true)

        // TODO: Integrar com API do assistente IA
        // Simulação de resposta da IA
        setTimeout(() => {
            const aiMessage: Message = {
                id: messages.length + 2,
                sender: 'assistant',
                content: getSimulatedResponse(inputMessage),
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiMessage])
            setIsTyping(false)
        }, 1500)
    }

    // Função temporária para simular respostas
    const getSimulatedResponse = (question: string): string => {
        const lowerQuestion = question.toLowerCase()

        if (lowerQuestion.includes('reserva')) {
            return 'Para fazer uma reserva, acesse a página de Reservas no menu lateral. Lá você pode escolher a área comum desejada, selecionar a data e horário disponíveis.'
        }

        if (lowerQuestion.includes('condomínio') || lowerQuestion.includes('taxa')) {
            return 'Você pode consultar o valor e status do seu condomínio na página inicial. O boleto é enviado mensalmente por email e também está disponível na área financeira.'
        }

        if (lowerQuestion.includes('área') || lowerQuestion.includes('churrasqueira') || lowerQuestion.includes('salão')) {
            return 'Temos as seguintes áreas comuns disponíveis: Salão de Festas, Churrasqueira 1, Churrasqueira 2 e Quadra de Esportes. Cada uma tem capacidade e valores específicos.'
        }

        if (lowerQuestion.includes('horário') || lowerQuestion.includes('funciona')) {
            return 'O horário de funcionamento das áreas comuns varia. Geralmente funcionam das 08h às 22h, mas cada área pode ter horários específicos. Consulte na página de Reservas.'
        }

        if (lowerQuestion.includes('cancelar')) {
            return 'Para cancelar uma reserva, acesse a página de Reservas e clique no botão "Cancelar" na sua reserva. Cancelamentos devem ser feitos com no mínimo 24h de antecedência.'
        }

        return 'Entendi sua pergunta. Posso ajudar com informações sobre: reservas de áreas comuns, boletos e taxas, regras do condomínio, horários de funcionamento e mais. Como posso ser mais específico?'
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const suggestedQuestions = [
        'Como faço uma reserva?',
        'Qual o valor do condomínio?',
        'Quais áreas comuns estão disponíveis?',
        'Como cancelar uma reserva?',
    ]

    return (
        <MainLayout>
            <div className="h-[calc(100vh-4rem)] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-cyan-glow/30 bg-coal-light/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-cyber rounded-xl shadow-glow">
                            <Bot className="w-6 h-6 text-coal" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-cyan text-glow-cyan flex items-center gap-2">
                                Assistente Virtual
                                <Sparkles className="w-5 h-5 text-cyan animate-pulse" />
                            </h1>
                            <p className="text-sm text-metal-silver/60">
                                Tire suas dúvidas sobre o condomínio
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-terminalgreen/20 rounded-full">
                            <span className="text-xs text-terminalgreen font-medium">
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${
                                message.sender === 'user'
                                    ? 'flex-row-reverse'
                                    : 'flex-row'
                            }`}
                        >
                            {/* Avatar */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                    message.sender === 'user'
                                        ? 'bg-cyan/20'
                                        : 'bg-gradient-cyber shadow-glow'
                                }`}
                            >
                                {message.sender === 'user' ? (
                                    <User className="w-5 h-5 text-cyan" />
                                ) : (
                                    <Bot className="w-5 h-5 text-coal" />
                                )}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`flex flex-col max-w-[70%] ${
                                    message.sender === 'user'
                                        ? 'items-end'
                                        : 'items-start'
                                }`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-2xl ${
                                        message.sender === 'user'
                                            ? 'bg-cyan/20 border border-cyan/30'
                                            : 'bg-coal-light/80 border border-cyan-glow/30'
                                    }`}
                                >
                                    <p className="text-metal-silver leading-relaxed">
                                        {message.content}
                                    </p>
                                </div>
                                <span className="text-xs text-metal-silver/40 mt-1 px-2">
                                    {formatTime(message.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-cyber shadow-glow flex items-center justify-center">
                                <Bot className="w-5 h-5 text-coal" />
                            </div>
                            <div className="bg-coal-light/80 border border-cyan-glow/30 px-4 py-3 rounded-2xl">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-cyan rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-cyan rounded-full animate-bounce delay-100" />
                                    <span className="w-2 h-2 bg-cyan rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                    <div className="px-6 pb-4">
                        <p className="text-sm text-metal-silver/60 mb-3">
                            Perguntas sugeridas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInputMessage(question)}
                                    className="px-3 py-2 text-sm bg-coal-light/80 border border-cyan-glow/30 rounded-lg text-metal-silver hover:bg-coal hover:border-cyan transition-all duration-300"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-6 border-t border-cyan-glow/30 bg-coal-light/50 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <div className="flex-1">
                            <Input
                                placeholder="Digite sua pergunta..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                disabled={isTyping}
                                className="bg-coal-light border-cyan-glow/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={!inputMessage.trim() || isTyping}
                            className="px-6"
                        >
                            {isTyping ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Enviar
                                </>
                            )}
                        </Button>
                    </form>
                    <p className="text-xs text-metal-silver/40 mt-2 text-center">
                        O assistente virtual está aqui para ajudar. Respostas podem
                        variar.
                    </p>
                </div>
            </div>
        </MainLayout>
    )
}

export default AssistantPage
