interface SkeletonCardProps {
    className?: string
    rows?: number
    height?: string
}

const SkeletonCard = ({ className = '', rows = 3, height }: SkeletonCardProps) => {
    return (
        <div className={`bg-cream border border-border-light rounded-xl p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}>
            <div className="space-y-4">
                {/* Header/Title */}
                <div className="h-6 bg-gradient-to-r from-champagne via-brass/10 to-champagne rounded w-3/4 animate-shimmer bg-[length:200%_100%]" />

                {/* Content rows */}
                {Array.from({ length: rows }).map((_, index) => (
                    <div
                        key={index}
                        className="h-4 bg-gradient-to-r from-champagne/60 via-brass/10 to-champagne/60 rounded animate-shimmer bg-[length:200%_100%]"
                        style={{
                            width: `${Math.random() * 30 + 60}%`,
                            animationDelay: `${index * 50}ms`
                        }}
                    />
                ))}

                {/* Optional custom height element */}
                {height && (
                    <div
                        className="bg-gradient-to-r from-champagne/50 via-brass/10 to-champagne/50 rounded mt-4 animate-shimmer bg-[length:200%_100%]"
                        style={{ height }}
                    />
                )}
            </div>
        </div>
    )
}

export default SkeletonCard
