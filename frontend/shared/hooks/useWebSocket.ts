import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const _apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const WS_BASE_URL = (import.meta.env.VITE_WS_URL as string | undefined) ||
    _apiUrl.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://')

interface WebSocketMessage {
    type: string
    data?: unknown
    message?: string
}

interface UseWebSocketOptions {
    onNotification?: (data: unknown) => void
    onConnect?: () => void
    onDisconnect?: () => void
}

const MAX_RECONNECT_ATTEMPTS = 5

export const useWebSocket = (token: string | null, options: UseWebSocketOptions = {}) => {
    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const reconnectAttempts = useRef(0)

    useEffect(() => {
        if (!token) return

        const connect = () => {
            try {
                const ws = new WebSocket(`${WS_BASE_URL}/api/v1/ws/notifications?token=${token}`)

                ws.onopen = () => {
                    setIsConnected(true)
                    reconnectAttempts.current = 0
                    options.onConnect?.()
                }

                ws.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data as string)
                        switch (message.type) {
                            case 'notification':
                                if (message.data) {
                                    toast.success((message.data as { title: string }).title)
                                    options.onNotification?.(message.data)
                                }
                                break
                            case 'connected':
                            case 'pong':
                                break
                        }
                    } catch {
                        // ignore parse errors
                    }
                }

                ws.onerror = () => { /* handled by onclose */ }

                ws.onclose = () => {
                    setIsConnected(false)
                    options.onDisconnect?.()

                    if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
                        reconnectTimeoutRef.current = setTimeout(() => {
                            reconnectAttempts.current++
                            connect()
                        }, delay)
                    } else {
                        toast.error('Conexão perdida. Recarregue a página.')
                    }
                }

                wsRef.current = ws

                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }))
                    }
                }, 30000)

                return () => clearInterval(pingInterval)
            } catch {
                // ignore connection errors
            }
        }

        connect()

        return () => {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
            wsRef.current?.close()
        }
    }, [token])

    const sendMessage = (message: unknown) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
        }
    }

    return { isConnected, sendMessage }
}
