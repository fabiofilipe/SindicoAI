interface SkeletonCardProps {
    className?: string
    rows?: number
    height?: string
}

const SkeletonCard = ({ className = '', rows = 3, height }: SkeletonCardProps) => {
    return (
        <div className={`bg-coal-dark border-2 border-neon-cyan/20 rounded-sm p-6 font-mono ${className}`}>
            <div className="animate-pulse space-y-4">
                {/* Header/Title */}
                <div className="h-5 bg-coal/80 rounded-sm w-3/4" />

                {/* Content rows */}
                {Array.from({ length: rows }).map((_, index) => (
                    <div
                        key={index}
                        className="h-3 bg-coal/60 rounded-sm"
                        style={{
                            width: `${Math.random() * 30 + 60}%`,
                        }}
                    />
                ))}

                {/* Optional custom height element */}
                {height && (
                    <div
                        className="bg-coal/50 rounded-sm mt-4"
                        style={{ height }}
                    />
                )}
            </div>
        </div>
    )
}

export default SkeletonCard
