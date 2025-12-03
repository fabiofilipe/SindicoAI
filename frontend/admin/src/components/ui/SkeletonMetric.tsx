interface SkeletonMetricProps {
    className?: string
}

const SkeletonMetric = ({ className = '' }: SkeletonMetricProps) => {
    return (
        <div className={`bg-coal-light border border-cyan-glow/20 rounded-xl p-6 ${className}`}>
            <div className="animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                        {/* Label */}
                        <div className="h-3 bg-coal/60 rounded w-24" />

                        {/* Value */}
                        <div className="h-8 bg-coal/80 rounded w-16" />

                        {/* Description */}
                        <div className="h-2 bg-coal/50 rounded w-32" />
                    </div>

                    {/* Icon placeholder */}
                    <div className="w-12 h-12 bg-cyan-glow/10 border border-cyan-glow/30 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default SkeletonMetric
