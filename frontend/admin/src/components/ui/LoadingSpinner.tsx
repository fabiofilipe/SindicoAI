import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <motion.div
                className={`${sizes[size]} relative`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="absolute inset-0 border-4 border-cyan-glow/20 rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-cyan rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-transparent border-t-cyan-glow rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
                <motion.div
                    className="absolute inset-0 bg-cyan rounded-full"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </div>
    )
}

export default LoadingSpinner
