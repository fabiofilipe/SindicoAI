import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionProps {
    children: ReactNode
    className?: string
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
    },
}

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
}

const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={className}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default PageTransition
