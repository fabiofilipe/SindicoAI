import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatInputProps {
    onSend: (message: string) => void
    placeholder?: string
    disabled?: boolean
    isLoading?: boolean
    terminalCursor?: boolean
    glowOnFocus?: boolean
    maxLength?: number
}

const ChatInput = ({
    onSend,
    placeholder = 'Digite sua pergunta...',
    disabled = false,
    isLoading = false,
    terminalCursor = true,
    glowOnFocus = true,
    maxLength = 1000,
}: ChatInputProps) => {
    const [message, setMessage] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = () => {
        if (!message.trim() || disabled || isLoading) return

        onSend(message.trim())
        setMessage('')

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)

        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    return (
        <div
            className={`
                relative flex items-end gap-3 p-4
                bg-coal-light border rounded-lg
                transition-all duration-300
                ${isFocused && glowOnFocus ? 'border-cyan shadow-glow' : 'border-cyan-glow'}
                ${disabled ? 'opacity-50' : ''}
            `}
        >
            {/* Textarea */}
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    disabled={disabled || isLoading}
                    maxLength={maxLength}
                    rows={1}
                    className={`
                        w-full bg-transparent
                        text-metal-silver placeholder:text-metal-silver/50
                        resize-none outline-none
                        max-h-32
                        ${terminalCursor ? 'caret-cyan' : ''}
                    `}
                />

                {/* Character count */}
                {message.length > maxLength * 0.8 && (
                    <span className="absolute -bottom-6 right-0 text-xs text-metal-silver/60">
                        {message.length}/{maxLength}
                    </span>
                )}
            </div>

            {/* Send Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!message.trim() || disabled || isLoading}
                className={`
                    p-3 rounded-lg
                    transition-all duration-300
                    ${
                        message.trim() && !disabled && !isLoading
                            ? 'bg-gradient-cyber text-coal shadow-glow hover:shadow-glow-lg'
                            : 'bg-coal text-metal-silver/50 cursor-not-allowed'
                    }
                `}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Send className="w-5 h-5" />
                )}
            </motion.button>
        </div>
    )
}

export default ChatInput
