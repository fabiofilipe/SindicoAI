interface SkeletonCardProps {
    className?: string
    rows?: number
    height?: string
}

const SkeletonCard = ({ className = '', rows = 3, height }: SkeletonCardProps) => {
    return (
        <div className={`bg-slate-800/80 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
                {/* Header/Title */}
                <div className="h-6 bg-slate-700/60 rounded-lg w-3/4" />

                {/* Content rows */}
                {Array.from({ length: rows }).map((_, index) => (
                    <div
                        key={index}
                        className="h-4 bg-slate-700/40 rounded-lg"
                        style={{
                            width: `${Math.random() * 30 + 60}%`,
                        }}
                    />
                ))}

                {/* Optional custom height element */}
                {height && (
                    <div
                        className="bg-slate-700/30 rounded-lg mt-4"
                        style={{ height }}
                    />
                )}
            </div>
        </div>
    )
}

export default SkeletonCard
