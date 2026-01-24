import { useEffect, useRef, ReactNode } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

const ScrollReveal = ({
    children,
    delay = 0,
    direction = 'up',
    className = ''
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const controls = useAnimation();

    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: 50, opacity: 0 };
            case 'down':
                return { y: -50, opacity: 0 };
            case 'left':
                return { x: 50, opacity: 0 };
            case 'right':
                return { x: -50, opacity: 0 };
            default:
                return { y: 50, opacity: 0 };
        }
    };

    useEffect(() => {
        if (isInView) {
            controls.start({
                x: 0,
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.6,
                    delay: delay,
                    ease: [0.25, 0.1, 0.25, 1], // Custom easing
                },
            });
        }
    }, [isInView, controls, delay]);

    return (
        <motion.div
            ref={ref}
            initial={getInitialPosition()}
            animate={controls}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
