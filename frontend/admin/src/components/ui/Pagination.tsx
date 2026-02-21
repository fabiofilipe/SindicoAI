import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    className?: string
}

export default function Pagination({ page, totalPages, onPageChange, className = '' }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = buildPageRange(page, totalPages)

    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded text-graphite hover:bg-parchment disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Anterior
            </button>

            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-graphite">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p as number)}
                        className={`w-9 h-9 text-sm rounded transition-colors ${
                            p === page
                                ? 'bg-brass text-cream font-medium'
                                : 'text-graphite hover:bg-parchment'
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm rounded text-graphite hover:bg-parchment disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Próximo
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    )
}

function buildPageRange(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages: (number | string)[] = []

    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)

    return pages
}
