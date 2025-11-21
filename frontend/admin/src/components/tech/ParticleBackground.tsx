import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
    density?: 'low' | 'medium' | 'high'
    className?: string
}

const ParticleBackground = ({ density = 'low', className = '' }: ParticleBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const densityConfig = {
        low: 30,
        medium: 60,
        high: 100,
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Particles
        const particleCount = densityConfig[density]
        const particles: Array<{
            x: number
            y: number
            vx: number
            vy: number
            size: number
        }> = []

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
            })
        }

        // Animation loop
        let animationFrameId: number
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle, i) => {
                // Update position
                particle.x += particle.vx
                particle.y += particle.vy

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                // Draw particle
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(0, 255, 240, 0.3)'
                ctx.fill()

                // Draw connections
                particles.slice(i + 1).forEach((otherParticle) => {
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = `rgba(0, 255, 240, ${0.2 - distance / 500})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [density])

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{ width: '100%', height: '100%' }}
        />
    )
}

export default ParticleBackground
