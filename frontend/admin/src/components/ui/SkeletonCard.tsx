interface SkeletonCardProps {
    className?: string
    rows?: number
    height?: string
}

const SkeletonCard = ({ className = '', rows = 3, height }: SkeletonCardProps) => {
    return (
        <div className={`bg-coal-light border border-cyan-glow/20 rounded-xl p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
                {/* Header/Title */}
                <div className="h-6 bg-coal/80 rounded w-3/4" />

                {/* Content rows */}
                {Array.from({ length: rows }).map((_, index) => (
                    <div
                        key={index}
                        className="h-4 bg-coal/60 rounded"
                        style={{
                            width: `${Math.random() * 30 + 60}%`,
                        }}
                    />
                ))}

                {/* Optional custom height element */}
                {height && (
                    <div
                        className="bg-coal/50 rounded mt-4"
                        style={{ height }}
                    />
                )}
            </div>
        </div>
    )
}

export default SkeletonCard
