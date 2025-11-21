import { useState, useEffect } from 'react'

interface GlitchTextProps {
    text: string
    className?: string
}

const GlitchText = ({ text, className = '' }: GlitchTextProps) => {
    const [glitching, setGlitching] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitching(true)
            setTimeout(() => setGlitching(false), 300)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <span className={`relative inline-block ${className}`}>
            <span className={glitching ? 'glitch' : ''}>{text}</span>

            {glitching && (
                <>
                    <span
                        className="absolute top-0 left-0 text-cyan opacity-70"
                        style={{ transform: 'translate(-2px, -2px)' }}
                    >
                        {text}
                    </span>
                    <span
                        className="absolute top-0 left-0 text-criticalred opacity-70"
                        style={{ transform: 'translate(2px, 2px)' }}
                    >
                        {text}
                    </span>
                </>
            )}
        </span>
    )
}

export default GlitchText
