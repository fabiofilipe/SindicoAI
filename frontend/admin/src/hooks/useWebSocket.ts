import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface WebSocketMessage {
    type: string
    data?: any
    message?: string
}

interface UseWebSocketOptions {
    onNotification?: (data: any) => void
    onConnect?: () => void
    onDisconnect?: () => void
}

export const useWebSocket = (token: string | null, options: UseWebSocketOptions = {}) => {
    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeoutRef = useRef<number | undefined>(undefined)
    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5

    useEffect(() => {
        if (!token) {
            return
        }

        const connect = () => {
            try {
                // WebSocket URL - adjust based on environment
                const wsUrl = `ws://localhost:8000/api/v1/ws/notifications?token=${token}`

                const ws = new WebSocket(wsUrl)

                ws.onopen = () => {
                    console.log('WebSocket connected')
                    setIsConnected(true)
                    reconnectAttempts.current = 0
                    options.onConnect?.()
                }

                ws.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data)

                        console.log('WebSocket message:', message)

                        switch (message.type) {
                            case 'connected':
                                console.log('Connected to notifications:', message.message)
                                break

                            case 'notification':
                                // New notification received
                                if (message.data) {
                                    toast.success(message.data.title)
                                    options.onNotification?.(message.data)
                                }
                                break

                            case 'pong':
                                // Heartbeat response
                                break

                            default:
                                console.log('Unknown message type:', message.type)
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error)
                    }
                }

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error)
                }

                ws.onclose = () => {
                    console.log('WebSocket disconnected')
                    setIsConnected(false)
                    options.onDisconnect?.()

                    // Attempt to reconnect
                    if (reconnectAttempts.current < maxReconnectAttempts) {
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
                        console.log(`Reconnecting in ${delay}ms...`)

                        reconnectTimeoutRef.current = setTimeout(() => {
                            reconnectAttempts.current++
                            connect()
                        }, delay)
                    } else {
                        console.error('Max reconnection attempts reached')
                        toast.error('Conexão perdida. Recarregue a página.')
                    }
                }

                wsRef.current = ws

                // Send ping every 30 seconds to keep connection alive
                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }))
                    }
                }, 30000)

                return () => {
                    clearInterval(pingInterval)
                }

            } catch (error) {
                console.error('Error connecting to WebSocket:', error)
            }
        }

        connect()

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }

            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [token])

    const sendMessage = (message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
        } else {
            console.warn('WebSocket is not connected')
        }
    }

    return {
        isConnected,
        sendMessage,
    }
}
