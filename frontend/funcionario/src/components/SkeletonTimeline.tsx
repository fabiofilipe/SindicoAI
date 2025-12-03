interface SkeletonTimelineProps {
    count?: number
    className?: string
}

const SkeletonTimeline = ({ count = 5, className = '' }: SkeletonTimelineProps) => {
    return (
        <div className={`space-y-4 font-mono ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-coal-dark border-2 border-neon-cyan/20 rounded-sm p-4"
                >
                    <div className="animate-pulse space-y-3">
                        {/* Time indicator */}
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-5 bg-coal/80 rounded-sm" />
                            <div className="h-px flex-1 bg-neon-cyan/20" />
                        </div>

                        {/* Content */}
                        <div className="pl-4 space-y-2">
                            <div className="h-4 bg-coal/80 rounded-sm w-2/3" />
                            <div className="h-3 bg-coal/60 rounded-sm w-1/2" />
                        </div>

                        {/* Status indicator */}
                        <div className="flex items-center gap-2 pl-4">
                            <div className="w-3 h-3 bg-neon-cyan/40 rounded-sm" />
                            <div className="h-3 bg-coal/50 rounded-sm w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonTimeline
