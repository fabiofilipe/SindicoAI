import { motion } from 'framer-motion'

interface SkeletonCardProps {
    className?: string
    rows?: number
    height?: string
}

const shimmer = {
    hidden: {
        backgroundPosition: '-200% 0',
    },
    visible: {
        backgroundPosition: '200% 0',
    },
}

const SkeletonCard = ({ className = '', rows = 3, height }: SkeletonCardProps) => {
    return (
        <motion.div
            className={`bg-coal-light border border-cyan-glow/20 rounded-xl p-6 overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="space-y-4">
                {/* Header/Title */}
                <motion.div
                    className="h-6 bg-gradient-to-r from-coal/80 via-cyan-glow/10 to-coal/80 rounded w-3/4"
                    style={{
                        backgroundSize: '200% 100%',
                    }}
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                {/* Content rows */}
                {Array.from({ length: rows }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="h-4 bg-gradient-to-r from-coal/60 via-cyan-glow/10 to-coal/60 rounded"
                        style={{
                            width: `${Math.random() * 30 + 60}%`,
                            backgroundSize: '200% 100%',
                        }}
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: index * 0.05,
                        }}
                    />
                ))}

                {/* Optional custom height element */}
                {height && (
                    <motion.div
                        className="bg-gradient-to-r from-coal/50 via-cyan-glow/10 to-coal/50 rounded mt-4"
                        style={{
                            height,
                            backgroundSize: '200% 100%',
                        }}
                        variants={shimmer}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                )}
            </div>
        </motion.div>
    )
}

export default SkeletonCard
