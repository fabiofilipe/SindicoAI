import { useState, useEffect } from 'react'
import { Bell, Loader2, Check, Trash2 } from 'lucide-react'
import { Card, Badge } from '@/components'
import { listNotifications, markAsRead, deleteNotification } from '@/services/notificationService'
import type { Notification } from '@/types/models'

const NotificationsPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const fetchNotifications = async () => {
        try {
            const data = await listNotifications()
            setNotifications(data)
        } catch (error) {
            console.error('Erro ao carregar notificações:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id)
            await fetchNotifications()
        } catch (error) {
            console.error('Erro ao marcar como lida:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deletar esta notificação?')) return
        try {
            await deleteNotification(id)
            await fetchNotifications()
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.is_read)
        : notifications

    const unreadCount = notifications.filter(n => !n.is_read).length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">NOTIFICAÇÕES</h1>
                    <p className="text-xl text-metal-silver">
                        <Badge variant={unreadCount > 0 ? 'in-progress' : 'completed'} pulse={unreadCount > 0}>
                            {unreadCount} NÃO LIDAS
                        </Badge>
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-lg text-base font-semibold ${filter === 'all' ? 'bg-neon-cyan text-coal' : 'bg-charcoal text-metal-silver'
                        }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-6 py-3 rounded-lg text-base font-semibold ${filter === 'unread' ? 'bg-neon-cyan text-coal' : 'bg-charcoal text-metal-silver'
                        }`}
                >
                    Não Lidas
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card className="text-center py-12">
                        <Bell size={64} className="mx-auto mb-4 text-metal-silver/50" />
                        <p className="text-2xl text-metal-silver">Nenhuma notificação</p>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={notification.is_read ? 'opacity-60' : ''}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold mb-2">{notification.title}</h3>
                                    <p className="text-metal-silver mb-3">{notification.message}</p>
                                    <p className="text-sm text-metal-silver/70">
                                        {new Date(notification.created_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-3 bg-terminal-green/20 text-terminal-green rounded-lg hover:bg-terminal-green/30"
                                            title="Marcar como lida"
                                        >
                                            <Check size={24} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="p-3 bg-critical-red/20 text-critical-red rounded-lg hover:bg-critical-red/30"
                                        title="Deletar"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default NotificationsPage
