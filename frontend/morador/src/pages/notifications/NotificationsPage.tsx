import { useState } from 'react'
import {
    Bell,
    AlertCircle,
    Calendar,
    Wrench,
    FileText,
    Trash2,
    Check,
    Filter,
} from 'lucide-react'
import { MainLayout, HologramCard, Button } from '@/components'

interface Notification {
    id: number
    type: 'important' | 'event' | 'maintenance' | 'general'
    title: string
    description: string
    date: string
    isRead: boolean
}

const NotificationsPage = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('all')

    // TODO: Buscar notificações da API
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'important',
            title: 'Assembleia Geral Extraordinária',
            description:
                'Reunião dia 30/11 às 19h no salão de festas para discussão do orçamento anual.',
            date: '2025-11-20',
            isRead: false,
        },
        {
            id: 2,
            type: 'maintenance',
            title: 'Manutenção Programada - Elevadores',
            description:
                'Os elevadores da Torre A estarão em manutenção no dia 24/11 das 8h às 12h.',
            date: '2025-11-19',
            isRead: false,
        },
        {
            id: 3,
            type: 'event',
            title: 'Festa Junina do Condomínio',
            description:
                'Participe da festa junina no dia 15/12. Haverá comidas típicas e quadrilha!',
            date: '2025-11-18',
            isRead: true,
        },
        {
            id: 4,
            type: 'general',
            title: 'Novos Horários da Portaria',
            description:
                'A partir de 01/12, a portaria funcionará 24h com equipe completa.',
            date: '2025-11-17',
            isRead: true,
        },
        {
            id: 5,
            type: 'important',
            title: 'Atualização do Regimento Interno',
            description:
                'O regimento interno foi atualizado. Consulte as novas regras no portal.',
            date: '2025-11-15',
            isRead: true,
        },
        {
            id: 6,
            type: 'maintenance',
            title: 'Limpeza da Caixa d\'Água',
            description:
                'Limpeza programada para dia 28/11. Pode haver interrupção no fornecimento de água.',
            date: '2025-11-14',
            isRead: true,
        },
    ])

    const filters = [
        { id: 'all', label: 'Todas', icon: Bell },
        { id: 'important', label: 'Importantes', icon: AlertCircle },
        { id: 'event', label: 'Eventos', icon: Calendar },
        { id: 'maintenance', label: 'Manutenção', icon: Wrench },
        { id: 'general', label: 'Gerais', icon: FileText },
    ]

    const getTypeConfig = (type: Notification['type']) => {
        const configs = {
            important: {
                color: 'criticalred',
                bgColor: 'bg-criticalred/10',
                borderColor: 'border-criticalred/30',
                textColor: 'text-criticalred',
                icon: AlertCircle,
                label: 'Importante',
            },
            event: {
                color: 'techblue',
                bgColor: 'bg-techblue/10',
                borderColor: 'border-techblue/30',
                textColor: 'text-techblue',
                icon: Calendar,
                label: 'Evento',
            },
            maintenance: {
                color: 'alertorange',
                bgColor: 'bg-alertorange/10',
                borderColor: 'border-alertorange/30',
                textColor: 'text-alertorange',
                icon: Wrench,
                label: 'Manutenção',
            },
            general: {
                color: 'cyan',
                bgColor: 'bg-cyan/10',
                borderColor: 'border-cyan/30',
                textColor: 'text-cyan',
                icon: FileText,
                label: 'Geral',
            },
        }
        return configs[type]
    }

    const filteredNotifications =
        selectedFilter === 'all'
            ? notifications
            : notifications.filter((n) => n.type === selectedFilter)

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    const handleMarkAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
    }

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }

    const handleDelete = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
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
                                    : notifications.filter((n) => n.type === filter.id)
                                          .length

                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg border
                                        transition-all duration-300
                                        ${
                                            isActive
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
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => {
                            const config = getTypeConfig(notification.type)
                            const Icon = config.icon

                            return (
                                <HologramCard
                                    key={notification.id}
                                    className={`
                                        p-6 transition-all duration-300
                                        ${!notification.isRead ? 'bg-cyan/5 border-l-4 border-l-cyan' : ''}
                                    `}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}
                                        >
                                            <Icon
                                                className={`w-6 h-6 ${config.textColor}`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <h3
                                                        className={`text-lg font-bold ${!notification.isRead ? 'text-cyan' : 'text-metal-silver'}`}
                                                    >
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.textColor} font-medium`}
                                                        >
                                                            {config.label}
                                                        </span>
                                                        <span className="text-sm text-metal-silver/60">
                                                            {formatDate(notification.date)}
                                                        </span>
                                                        {!notification.isRead && (
                                                            <span className="flex items-center gap-1 text-xs text-cyan">
                                                                <span className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                                                                Nova
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                            className="p-2 hover:bg-coal rounded-lg transition-colors group"
                                                            title="Marcar como lida"
                                                        >
                                                            <Check className="w-5 h-5 text-metal-silver group-hover:text-terminalgreen transition-colors" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(notification.id)
                                                        }
                                                        className="p-2 hover:bg-coal rounded-lg transition-colors group"
                                                        title="Excluir notificação"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-metal-silver group-hover:text-criticalred transition-colors" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-metal-silver/80 leading-relaxed">
                                                {notification.description}
                                            </p>
                                        </div>
                                    </div>
                                </HologramCard>
                            )
                        })
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
