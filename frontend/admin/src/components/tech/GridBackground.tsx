interface GridBackgroundProps {
    pattern?: 'tech' | 'scan' | 'dots'
    className?: string
}

const GridBackground = ({ pattern = 'tech', className = '' }: GridBackgroundProps) => {
    const patterns = {
        tech: 'bg-tech-grid',
        scan: 'bg-tech-grid scan-line-container',
        dots: 'bg-tech-grid',
    }

    return (
        <div className={`absolute inset-0 ${patterns[pattern]} ${className}`}>
            {pattern === 'scan' && <div className="scan-line" />}
        </div>
    )
}

export default GridBackground
