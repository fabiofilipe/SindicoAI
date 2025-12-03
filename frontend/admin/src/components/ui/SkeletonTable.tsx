interface SkeletonTableProps {
    columns?: number
    rows?: number
    className?: string
}

const SkeletonTable = ({ columns = 5, rows = 6, className = '' }: SkeletonTableProps) => {
    return (
        <div className={`bg-coal-light border border-cyan-glow/20 rounded-xl overflow-hidden ${className}`}>
            <div className="animate-pulse">
                {/* Table Header */}
                <div className="grid gap-4 p-6 border-b border-cyan-glow/10" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, index) => (
                        <div key={`header-${index}`} className="h-5 bg-coal/80 rounded" />
                    ))}
                </div>

                {/* Table Rows */}
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className="grid gap-4 p-6 border-b border-cyan-glow/5"
                        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                    >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className="h-4 bg-coal/60 rounded"
                                style={{
                                    width: colIndex === 0 ? '80%' : `${Math.random() * 20 + 70}%`,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkeletonTable
