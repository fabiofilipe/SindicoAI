import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface SuggestedQuestionsProps {
    questions: string[]
    onSelect: (question: string) => void
    disabled?: boolean
}

const SuggestedQuestions = ({ questions, onSelect, disabled = false }: SuggestedQuestionsProps) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-metal-silver">
                <Sparkles className="w-4 h-4 text-cyan" />
                <span>Sugestões</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !disabled && onSelect(question)}
                        disabled={disabled}
                        className={`
                            px-4 py-2 rounded-full
                            bg-coal-light border border-cyan-glow
                            text-sm text-metal-silver
                            transition-all duration-300
                            ${
                                disabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:border-cyan hover:text-cyan hover:shadow-glow-sm'
                            }
                        `}
                    >
                        {question}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}

export default SuggestedQuestions
