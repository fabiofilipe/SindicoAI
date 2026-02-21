import { useState, useCallback } from 'react'
import type { PaginationParams } from '../types/pagination'

export function usePagination(defaultPageSize = 20) {
    const [page, setPage] = useState(1)
    const pageSize = defaultPageSize

    const goToPage = useCallback((p: number) => setPage(p), [])
    const reset = useCallback(() => setPage(1), [])

    const params: PaginationParams = { page, page_size: pageSize }

    return { page, pageSize, params, goToPage, reset }
}
