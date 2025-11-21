import { motion } from 'framer-motion'

interface DataStreamProps {
    direction?: 'horizontal' | 'vertical'
    className?: string
}

const DataStream = ({ direction = 'vertical', className = '' }: DataStreamProps) => {
    const streamChars = ['0', '1', '▀', '▄', '█', '▌', '▐', '░', '▒', '▓']
    const streamCount = 20

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {Array.from({ length: streamCount }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`
                        absolute text-cyan/30 font-mono text-xs
                        ${direction === 'vertical' ? 'top-0' : 'left-0'}
                    `}
                    style={{
                        [direction === 'vertical' ? 'left' : 'top']: `${(i / streamCount) * 100}%`,
                    }}
                    animate={
                        direction === 'vertical'
                            ? { y: ['-100%', '100vh'] }
                            : { x: ['-100%', '100vw'] }
                    }
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: 'linear',
                    }}
                >
                    {streamChars[Math.floor(Math.random() * streamChars.length)]}
                </motion.div>
            ))}
        </div>
    )
}

export default DataStream
