interface SkeletonListProps {
    count?: number
    showAvatar?: boolean
    className?: string
}

const SkeletonList = ({ count = 5, showAvatar = true, className = '' }: SkeletonListProps) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-coal-light border border-cyan-glow/20 rounded-xl p-4"
                >
                    <div className="animate-pulse flex items-center gap-4">
                        {/* Avatar/Icon */}
                        {showAvatar && (
                            <div className="w-12 h-12 bg-coal/60 rounded-full flex-shrink-0" />
                        )}

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-coal/80 rounded w-3/4" />
                            <div className="h-3 bg-coal/60 rounded w-1/2" />
                        </div>

                        {/* Action placeholder */}
                        <div className="w-20 h-8 bg-coal/50 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonList
