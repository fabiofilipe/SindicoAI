// API Response Types
export interface ApiResponse<T> {
    data: T
    message?: string
}

export interface ApiError {
    message: string
    errors?: Record<string, string[]>
    status?: number
}

// Pagination
export interface PaginationParams {
    page?: number
    limit?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    pages: number
}
