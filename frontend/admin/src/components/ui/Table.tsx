import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'

interface TableProps {
    children: ReactNode
    className?: string
}

export const Table = ({ children, className = '' }: TableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className={`w-full ${className}`}>
                {children}
            </table>
        </div>
    )
}

export const TableHeader = ({ children }: { children: ReactNode }) => {
    return <thead className="bg-coal-light/50 border-b border-cyan-glow/20">{children}</thead>
}

export const TableBody = ({ children }: { children: ReactNode }) => {
    return <tbody>{children}</tbody>
}

export const TableRow = ({ children, className = '' }: TableProps) => {
    return (
        <tr className={`border-b border-cyan-glow/10 hover:bg-coal-light/30 transition-colors ${className}`}>
            {children}
        </tr>
    )
}

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
    children: ReactNode
    className?: string
}

export const TableHead = ({ children, className = '', ...props }: TableHeadProps) => {
    return (
        <th className={`px-6 py-4 text-left text-sm font-semibold text-cyan ${className}`} {...props}>
            {children}
        </th>
    )
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    children: ReactNode
    className?: string
}

export const TableCell = ({ children, className = '', ...props }: TableCellProps) => {
    return (
        <td className={`px-6 py-4 text-sm text-metal-silver ${className}`} {...props}>
            {children}
        </td>
    )
}
