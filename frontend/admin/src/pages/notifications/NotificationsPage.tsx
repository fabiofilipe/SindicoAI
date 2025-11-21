import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Filter,
    AlertCircle,
    Info,
    CheckCircle,
    AlertTriangle,
    Cpu,
    ExternalLink,
} from 'lucide-react'
import { HologramCard, Button, Modal } from '@/components'
import { Notification, NotificationType, NotificationStatus, NotificationPriority } from '@/types/notification.types'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'

// Mock data
const mockNotifications: Notification[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        user_id: 'user1',
        type: 'warning',
        priority: 'high',
        title: 'Taxa Condominial Vencendo',
        message: 'Sua taxa condominial de R$ 480,00 vence em 3 dias (dia 10/02).',
        status: 'unread',
        action_url: '/payments',
        action_label: 'Pagar Agora',
        created_at: '2024-01-22T10:00:00Z',
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        type: 'success',
        priority: 'normal',
        title: 'Reserva Confirmada',
        message: 'Sua reserva do Salão de Festas para 26/01 foi confirmada.',
        status: 'unread',
        action_url: '/reservations',
        action_label: 'Ver Detalhes',
        created_at: '2024-01-21T14:30:00Z',
    },
    {
        id: '3',
        tenant_id: 'tenant1',
        type: 'info',
        priority: 'normal',
        title: 'Novo Documento Disponível',
        message: 'A ata da reunião de janeiro está disponível para consulta.',
        status: 'read',
        action_url: '/documents',
        action_label: 'Ver Documento',
        created_at: '2024-01-20T09:15:00Z',
        read_at: '2024-01-20T15:00:00Z',
    },
    {
        id: '4',
        tenant_id: 'tenant1',
        type: 'system',
        priority: 'low',
        title: 'Manutenção Programada',
        message: 'Haverá manutenção nos elevadores dia 25/01 das 8h às 12h.',
        status: 'read',
        created_at: '2024-01-18T08:00:00Z',
        read_at: '2024-01-18T10:00:00Z',
    },
    {
        id: '5',
        tenant_id: 'tenant1',
        type: 'error',
        priority: 'urgent',
        title: 'Reunião Extraordinária',
        message: 'Convocação para assembleia extraordinária dia 30/01 às 19h.',
        status: 'unread',
        action_url: '/documents',
        action_label: 'Ver Convocação',
        created_at: '2024-01-17T16:00:00Z',
    },
]

const typeIcons: Record<NotificationType, React.ElementType> = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: AlertCircle,
    system: Cpu,
}

const typeColors: Record<NotificationType, string> = {
    info: 'text-techblue border-techblue/30 bg-techblue/10',
    warning: 'text-alertorange border-alertorange/30 bg-alertorange/10',
    success: 'text-terminalgreen border-terminalgreen/30 bg-terminalgreen/10',
    error: 'text-criticalred border-criticalred/30 bg-criticalred/10',
    system: 'text-cyan border-cyan/30 bg-cyan/10',
}

const priorityLabels: Record<NotificationPriority, string> = {
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente',
}

const priorityColors: Record<NotificationPriority, string> = {
    low: 'text-metal-silver/60',
    normal: 'text-techblue',
    high: 'text-alertorange',
    urgent: 'text-criticalred',
}

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [filterStatus, setFilterStatus] = useState<NotificationStatus | 'all'>('all')
    const [filterType, setFilterType] = useState<NotificationType | 'all'>('all')
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

    const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal()
    const { toast, hideToast, success, error } = useToast()

    const handleMarkAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) =>
                n.id === id
                    ? { ...n, status: 'read' as NotificationStatus, read_at: new Date().toISOString() }
                    : n
            )
        )
        success('Notificação marcada como lida')
    }

    const handleMarkAllAsRead = () => {
        setNotifications(
            notifications.map((n) => ({
                ...n,
                status: 'read' as NotificationStatus,
                read_at: n.read_at || new Date().toISOString(),
            }))
        )
        success('Todas as notificações marcadas como lidas')
    }

    const handleDeleteConfirm = async () => {
        if (!selectedNotification) return

        try {
            // await notificationsService.delete(selectedNotification.id)
            setNotifications(notifications.filter((n) => n.id !== selectedNotification.id))
            success('Notificação removida com sucesso!')
            closeDelete()
        } catch {
            error('Erro ao remover notificação')
        }
    }

    const filteredNotifications = notifications.filter((notification) => {
        if (filterStatus !== 'all' && notification.status !== filterStatus) return false
        if (filterType !== 'all' && notification.type !== filterType) return false
        return true
    })

    const unreadCount = notifications.filter((n) => n.status === 'unread').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2 flex items-center gap-3">
                        <Bell className="w-8 h-8" />
                        Notificações
                        {unreadCount > 0 && (
                            <span className="px-3 py-1 rounded-full bg-criticalred text-white text-sm font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-metal-silver">Central de notificações do condomínio</p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={handleMarkAllAsRead} className="btn-glow flex items-center gap-2">
                        <CheckCheck className="w-5 h-5" />
                        Marcar Todas como Lidas
                    </Button>
                )}
            </div>

            {/* Filters */}
            <HologramCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-cyan" />
                    <h3 className="text-lg font-bold text-cyan">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-metal-silver mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as NotificationStatus | 'all')}
                            className="w-full px-4 py-3 rounded-lg bg-coal-light border border-cyan-glow text-metal-silver focus:outline-none focus:border-cyan focus:shadow-glow"
                        >
                            <option value="all">Todas</option>
                            <option value="unread">Não Lidas</option>
                            <option value="read">Lidas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-metal-silver mb-2">Tipo</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as NotificationType | 'all')}
                            className="w-full px-4 py-3 rounded-lg bg-coal-light border border-cyan-glow text-metal-silver focus:outline-none focus:border-cyan focus:shadow-glow"
                        >
                            <option value="all">Todos</option>
                            <option value="info">Informação</option>
                            <option value="success">Sucesso</option>
                            <option value="warning">Aviso</option>
                            <option value="error">Erro</option>
                            <option value="system">Sistema</option>
                        </select>
                    </div>
                </div>
            </HologramCard>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <HologramCard className="p-12 text-center">
                    <Bell className="w-16 h-16 text-cyan/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-metal-silver mb-2">
                        Nenhuma notificação encontrada
                    </h3>
                    <p className="text-metal-silver/60">
                        Ajuste os filtros ou aguarde novas notificações
                    </p>
                </HologramCard>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredNotifications.map((notification, index) => {
                            const Icon = typeIcons[notification.type]
                            const isUnread = notification.status === 'unread'

                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <HologramCard
                                        className={`p-5 transition-all ${
                                            isUnread
                                                ? 'border-cyan shadow-glow'
                                                : 'border-cyan-glow/30 opacity-75'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${typeColors[notification.type]}`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3
                                                                className={`text-lg font-bold ${
                                                                    isUnread
                                                                        ? 'text-cyan'
                                                                        : 'text-metal-silver'
                                                                }`}
                                                            >
                                                                {notification.title}
                                                            </h3>
                                                            {isUnread && (
                                                                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-metal-silver/80">
                                                            {notification.message}
                                                        </p>
                                                    </div>

                                                    {/* Priority Badge */}
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded border ${
                                                            priorityColors[notification.priority]
                                                        } border-current bg-current/10 whitespace-nowrap`}
                                                    >
                                                        {priorityLabels[notification.priority]}
                                                    </span>
                                                </div>

                                                {/* Metadata */}
                                                <div className="flex items-center gap-4 text-xs text-metal-silver/60 mb-3">
                                                    <span className="font-mono">
                                                        {new Date(notification.created_at).toLocaleString(
                                                            'pt-BR'
                                                        )}
                                                    </span>
                                                    {notification.read_at && (
                                                        <span className="flex items-center gap-1">
                                                            <Check className="w-3 h-3" />
                                                            Lida
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    {notification.action_url && (
                                                        <button className="px-3 py-1.5 bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 rounded-lg text-cyan text-xs transition-all flex items-center gap-2">
                                                            <ExternalLink className="w-3 h-3" />
                                                            {notification.action_label || 'Ver Detalhes'}
                                                        </button>
                                                    )}
                                                    {isUnread && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="px-3 py-1.5 bg-techblue/10 hover:bg-techblue/20 border border-techblue/30 rounded-lg text-techblue text-xs transition-all flex items-center gap-2"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Marcar como Lida
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedNotification(notification)
                                                            openDelete()
                                                        }}
                                                        className="px-3 py-1.5 bg-criticalred/10 hover:bg-criticalred/20 border border-criticalred/30 rounded-lg text-criticalred text-xs transition-all flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Remover
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </HologramCard>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDelete} title="Confirmar Exclusão" size="md">
                <div className="space-y-4">
                    <p className="text-metal-silver">
                        Tem certeza que deseja remover a notificação{' '}
                        <span className="text-cyan font-bold">{selectedNotification?.title}</span>?
                    </p>
                    <div className="bg-criticalred/10 border border-criticalred/30 rounded-lg p-4">
                        <p className="text-sm text-criticalred">
                            Esta ação não pode ser desfeita.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeDelete} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteConfirm} className="flex-1 bg-gradient-alert">
                            Confirmar Exclusão
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast */}
            <Toast
                message={toast.message}
                variant={toast.variant}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    )
}

export default NotificationsPage
