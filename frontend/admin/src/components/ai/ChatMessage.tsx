import { Bot, User } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
    role: 'user' | 'assistant'
    content: string
    variant?: 'terminal' | 'bubble'
    timestamp?: string
    markdown?: boolean
}

const ChatMessage = ({ role, content, variant = 'bubble', timestamp, markdown = true }: ChatMessageProps) => {
    const isUser = role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div
                className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${isUser ? 'bg-gradient-cyber' : 'bg-coal-light border border-cyan-glow'}
                `}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-coal" />
                ) : (
                    <Bot className="w-4 h-4 text-cyan" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                {variant === 'bubble' ? (
                    <div
                        className={`
                            px-4 py-3 rounded-2xl
                            ${isUser
                                ? 'bg-gradient-cyber text-coal rounded-br-none'
                                : 'bg-coal-light border border-cyan-glow text-metal-silver rounded-bl-none'
                            }
                        `}
                    >
                        {markdown && !isUser ? (
                            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-p:text-metal-silver prose-code:text-cyan prose-code:bg-coal prose-code:px-1 prose-code:rounded prose-pre:bg-coal prose-pre:border prose-pre:border-cyan-glow">
                                <ReactMarkdown>
                                    {content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">{content}</p>
                        )}
                    </div>
                ) : (
                    <div
                        className={`
                            w-full px-4 py-3 rounded-lg font-mono text-sm
                            ${isUser
                                ? 'bg-cyan/10 text-cyan border border-cyan/30'
                                : 'bg-coal-light text-metal-silver border border-cyan-glow/30'
                            }
                        `}
                    >
                        <pre className="whitespace-pre-wrap">{content}</pre>
                    </div>
                )}

                {timestamp && (
                    <span className="text-xs text-metal-silver/60 px-2">{timestamp}</span>
                )}
            </div>
        </motion.div>
    )
}

export default ChatMessage
