import { User } from 'lucide-react'

interface AvatarProps {
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    status?: 'online' | 'offline' | 'busy'
    borderGlow?: boolean
    fallbackText?: string
    className?: string
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
}

const statusColors = {
    online: 'bg-terminalgreen',
    offline: 'bg-metal-silver',
    busy: 'bg-alertorange',
}

const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
}

const Avatar = ({
    src,
    alt,
    size = 'md',
    status,
    borderGlow = false,
    fallbackText,
    className = '',
}: AvatarProps) => {
    const getInitials = (text?: string) => {
        if (!text) return ''
        const words = text.split(' ')
        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase()
        }
        return text.substring(0, 2).toUpperCase()
    }

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className={`
                    ${sizeClasses[size]}
                    rounded-full
                    flex items-center justify-center
                    overflow-hidden
                    ${borderGlow ? 'border-2 border-cyan shadow-glow' : 'border border-cyan-glow'}
                    bg-gradient-cyber
                    transition-all duration-300
                `}
            >
                {src ? (
                    <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
                ) : fallbackText ? (
                    <span className="font-bold text-coal">{getInitials(fallbackText)}</span>
                ) : (
                    <User className="w-1/2 h-1/2 text-coal" />
                )}
            </div>

            {status && (
                <span
                    className={`
                        absolute bottom-0 right-0
                        ${statusSizes[size]}
                        ${statusColors[status]}
                        rounded-full
                        border-2 border-coal
                        ${status === 'online' ? 'animate-pulse' : ''}
                    `}
                />
            )}
        </div>
    )
}

export default Avatar
