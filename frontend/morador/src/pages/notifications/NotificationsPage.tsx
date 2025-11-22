import { useState, useEffect } from 'react'
import {
    Bell,
    AlertCircle,
    Trash2,
    Check,
    Filter,
    Loader2,
} from 'lucide-react'
import { MainLayout, HologramCard, Button } from '@/components'
import {
    listNotifications,
    markAsRead,
    deleteNotification,
} from '@/services/notificationService'
import type { Notification } from '@/types/models'

const NotificationsPage = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('all')
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Buscar notificações ao montar o componente
    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await listNotifications()
            setNotifications(data)
        } catch (err) {
            console.error('Erro ao carregar notificações:', err)
            setError('Erro ao carregar notificações. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const filters = [
        { id: 'all', label: 'Todas', icon: Bell },
        { id: 'unread', label: 'Não Lidas', icon: AlertCircle },
    ]

    const filteredNotifications =
        selectedFilter === 'all'
            ? notifications
            : notifications.filter((n) => !n.is_read)

    const unreadCount = notifications.filter((n) => !n.is_read).length

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id)
            await fetchNotifications() // Refresh list
        } catch (err) {
            console.error('Erro ao marcar como lida:', err)
            setError('Erro ao marcar notificação como lida.')
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            // Marcar todas as não lidas
            const unreadNotifications = notifications.filter(n => !n.is_read)
            await Promise.all(unreadNotifications.map(n => markAsRead(n.id)))
            await fetchNotifications() // Refresh list
        } catch (err) {
            console.error('Erro ao marcar todas como lidas:', err)
            setError('Erro ao marcar todas as notificações como lidas.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta notificação?')) {
            return
        }

        try {
            await deleteNotification(id)
            await fetchNotifications() // Refresh list
        } catch (err) {
            console.error('Erro ao excluir notificação:', err)
            setError('Erro ao excluir notificação.')
        }
    }

    return (
        <MainLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                            Notificações
                        </h1>
                        <p className="text-metal-silver">
                            Fique por dentro de tudo que acontece no condomínio
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {unreadCount > 0 && (
                            <div className="px-4 py-2 bg-criticalred/20 border border-criticalred/30 rounded-lg">
                                <span className="text-criticalred font-bold">
                                    {unreadCount} não{' '}
                                    {unreadCount === 1 ? 'lida' : 'lidas'}
                                </span>
                            </div>
                        )}
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                            >
                                <Check className="w-4 h-4" />
                                Marcar todas como lidas
                            </Button>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-criticalred/10 border border-criticalred/30 rounded-lg flex items-start gap-3">
                        <div className="text-criticalred">{error}</div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-criticalred hover:text-criticalred/80"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-cyan" />
                        <h2 className="text-lg font-bold text-cyan">Filtrar por</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => {
                            const Icon = filter.icon
                            const isActive = selectedFilter === filter.id
                            const count =
                                filter.id === 'all'
                                    ? notifications.length
                                    : notifications.filter((n) => !n.is_read).length

                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg border
                                        transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-cyber text-coal font-bold border-transparent shadow-glow'
                                            : 'bg-coal-light border-cyan-glow/30 text-metal-silver hover:bg-coal hover:border-cyan'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{filter.label}</span>
                                    <span
                                        className={`
                                        px-2 py-0.5 rounded-full text-xs font-bold
                                        ${isActive ? 'bg-coal/30 text-coal' : 'bg-cyan/20 text-cyan'}
                                    `}
                                    >
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <HologramCard className="p-12">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-12 h-12 text-cyan animate-spin mb-4" />
                                <p className="text-metal-silver">Carregando notificações...</p>
                            </div>
                        </HologramCard>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <HologramCard
                                key={notification.id}
                                className={`
                                    p-6 transition-all duration-300
                                    ${!notification.is_read ? 'bg-cyan/5 border-l-4 border-l-cyan' : ''}
                                `}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 p-3 rounded-lg bg-techblue/10 border border-techblue/30">
                                        <Bell className="w-6 h-6 text-techblue" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h3 className={`text-lg font-bold ${!notification.is_read ? 'text-cyan' : 'text-metal-silver'}`}>
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm text-metal-silver/60">
                                                        {formatDate(notification.created_at)}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="flex items-center gap-1 text-xs text-cyan">
                                                            <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                                                            Nova
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-2 hover:bg-coal rounded-lg transition-colors group"
                                                        title="Marcar como lida"
                                                    >
                                                        <Check className="w-5 h-5 text-metal-silver group-hover:text-terminalgreen transition-colors" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="p-2 hover:bg-coal rounded-lg transition-colors group"
                                                    title="Excluir notificação"
                                                >
                                                    <Trash2 className="w-5 h-5 text-metal-silver group-hover:text-criticalred transition-colors" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-metal-silver/80 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            </HologramCard>
                        ))
                    ) : (
                        <HologramCard className="p-12 text-center">
                            <Bell className="w-16 h-16 text-metal-silver/30 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-metal-silver mb-2">
                                Nenhuma notificação encontrada
                            </h3>
                            <p className="text-metal-silver/60">
                                {selectedFilter === 'all'
                                    ? 'Você não tem notificações no momento.'
                                    : 'Não há notificações deste tipo.'}
                            </p>
                        </HologramCard>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}

export default NotificationsPage
