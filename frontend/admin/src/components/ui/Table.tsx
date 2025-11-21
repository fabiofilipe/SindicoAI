import { ReactNode } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface Column<T> {
    key: keyof T | string
    label: string
    sortable?: boolean
    render?: (value: any, row: T) => ReactNode
    width?: string
}

interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
    variant?: 'tech' | 'holographic'
    sortable?: boolean
    onSort?: (key: string, direction: 'asc' | 'desc') => void
    sortKey?: string
    sortDirection?: 'asc' | 'desc'
    isLoading?: boolean
    emptyMessage?: string
}

function Table<T extends Record<string, any>>({
    columns,
    data,
    variant = 'tech',
    sortable = false,
    onSort,
    sortKey,
    sortDirection,
    isLoading = false,
    emptyMessage = 'Nenhum dado encontrado',
}: TableProps<T>) {
    const handleSort = (key: string) => {
        if (!sortable || !onSort) return

        const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
        onSort(key, newDirection)
    }

    const variantClasses = {
        tech: 'bg-coal-light border-cyan-glow/30',
        holographic: 'bg-coal-light/50 backdrop-blur-md border-cyan-glow',
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-cyan-glow/30">
            <table className="w-full">
                {/* Header */}
                <thead className={`${variantClasses[variant]} border-b border-cyan-glow/30`}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={`
                                    px-4 py-4 text-left text-sm font-semibold text-cyan
                                    ${column.width ? column.width : 'w-auto'}
                                    ${column.sortable && sortable ? 'cursor-pointer hover:text-techblue transition-colors' : ''}
                                `}
                                onClick={() => column.sortable && sortable && handleSort(String(column.key))}
                            >
                                <div className="flex items-center gap-2">
                                    {column.label}
                                    {column.sortable && sortable && sortKey === column.key && (
                                        <span>
                                            {sortDirection === 'asc' ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-cyan-glow/10">
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-12 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                                    <span className="text-metal-silver">Carregando...</span>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-12 text-center text-metal-silver/60">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="bg-coal-light/30 hover:bg-cyan/5 transition-colors group"
                            >
                                {columns.map((column) => {
                                    const value = row[column.key as keyof T]
                                    return (
                                        <td
                                            key={String(column.key)}
                                            className="px-4 py-4 text-sm text-metal-silver group-hover:text-cyan transition-colors"
                                        >
                                            {column.render ? column.render(value, row) : String(value)}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table
