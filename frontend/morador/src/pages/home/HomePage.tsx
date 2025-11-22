import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Calendar,
    MessageSquare,
    Bell,
    CreditCard,
    AlertCircle,
    Clock,
    CheckCircle2,
    TrendingUp,
    Loader2,
} from 'lucide-react'
import { MainLayout, HologramCard, Button } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { getUpcomingReservations } from '@/services/reservationService'
import { getRecentNotifications, getUnreadCount } from '@/services/notificationService'
import { listCommonAreas } from '@/services/commonAreaService'
import type { Reservation, Notification, CommonArea } from '@/types/models'

const HomePage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
    const [importantNotices, setImportantNotices] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [commonAreas, setCommonAreas] = useState<CommonArea[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Buscar dados em paralelo
                const [reservations, notifications, count, areas] = await Promise.all([
                    getUpcomingReservations().catch(() => []),
                    getRecentNotifications().catch(() => []),
                    getUnreadCount().catch(() => 0),
                    listCommonAreas().catch(() => []),
                ])

                setUpcomingReservations(reservations.slice(0, 2)) // Apenas as 2 próximas
                setImportantNotices(notifications.slice(0, 2)) // Apenas as 2 mais recentes
                setUnreadCount(count)
                setCommonAreas(areas)
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Função helper para buscar nome da área comum
    const getCommonAreaName = (areaId: string) => {
        const area = commonAreas.find(a => a.id === areaId)
        return area?.name || 'Área Comum'
    }

    // Dados do usuário vêm do AuthContext
    const userName = user?.full_name || 'Morador'
    // TODO: Buscar dados da unit do backend quando precisar exibir número e prédio
    const apartmentNumber = user?.unit_id ? user.unit_id.slice(-3) : 'N/A'
    const building = 'Torre A' // Placeholder - backend não retorna isso ainda

    // TODO: Buscar dados financeiros da API quando endpoint estiver disponível
    const financialData = {
        currentMonth: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        amount: 850.0,
        dueDate: '2025-11-10',
        status: 'paid' as const, // 'paid' | 'pending' | 'overdue'
    }

    const quickActions = [
        {
            id: 1,
            label: 'Nova Reserva',
            description: 'Reserve áreas comuns',
            icon: Calendar,
            color: 'cyan',
            path: '/reservations',
        },
        {
            id: 2,
            label: 'Assistente IA',
            description: 'Tire suas dúvidas',
            icon: MessageSquare,
            color: 'techblue',
            path: '/assistant',
        },
        {
            id: 3,
            label: 'Notificações',
            description: 'Veja avisos importantes',
            icon: Bell,
            color: 'alertorange',
            path: '/notifications',
        },
    ]

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
        })
    }

    return (
        <MainLayout>
            <div className="p-8 space-y-8">
                {/* Hero Section */}
                <div className="relative">
                    <HologramCard className="p-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                                    Olá, {userName}!
                                </h1>
                                <p className="text-metal-silver text-lg">
                                    Apartamento {apartmentNumber} - {building}
                                </p>
                                <p className="text-metal-silver/60 text-sm mt-2">
                                    Bem-vindo ao seu portal do morador
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-metal-silver/60">
                                    Hoje
                                </p>
                                <p className="text-2xl font-bold text-cyan">
                                    {new Date().toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                    })}
                                </p>
                            </div>
                        </div>
                    </HologramCard>

                    {/* Decorative glow */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
                </div>

                {/* Quick Actions */}
                <section>
                    <h2 className="text-2xl font-bold text-cyan mb-4">
                        Ações Rápidas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon
                            return (
                                <HologramCard
                                    key={action.id}
                                    className="p-6 cursor-pointer group"
                                    onClick={() => navigate(action.path)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`p-3 bg-${action.color}/10 rounded-lg group-hover:bg-${action.color}/20 transition-colors`}
                                        >
                                            <Icon
                                                className={`w-6 h-6 text-${action.color}`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-cyan group-hover:text-cyan/80 transition-colors">
                                                {action.label}
                                            </h3>
                                            <p className="text-sm text-metal-silver/60 mt-1">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </HologramCard>
                            )
                        })}
                    </div>
                </section>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Próximas Reservas */}
                    <section>
                        <h2 className="text-2xl font-bold text-cyan mb-4">
                            Minhas Reservas
                        </h2>
                        <HologramCard className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 text-cyan animate-spin" />
                                    <span className="ml-3 text-metal-silver">
                                        Carregando reservas...
                                    </span>
                                </div>
                            ) : upcomingReservations.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingReservations.map((reservation) => (
                                        <div
                                            key={reservation.id}
                                            className="flex items-center gap-4 p-4 bg-coal/50 rounded-lg"
                                        >
                                            <div className="p-2 bg-cyan/10 rounded-lg">
                                                <Calendar className="w-5 h-5 text-cyan" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-metal-silver">
                                                    {getCommonAreaName(reservation.common_area_id)}
                                                </h4>
                                                <p className="text-sm text-metal-silver/60 flex items-center gap-2 mt-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(reservation.start_time).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                    })}{' '}
                                                    às{' '}
                                                    {new Date(reservation.start_time).toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        fullWidth
                                        onClick={() => navigate('/reservations')}
                                    >
                                        Ver todas as reservas
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 text-metal-silver/30 mx-auto mb-4" />
                                    <p className="text-metal-silver/60 mb-4">
                                        Você não tem reservas agendadas
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate('/reservations')}
                                    >
                                        Fazer uma reserva
                                    </Button>
                                </div>
                            )}
                        </HologramCard>
                    </section>

                    {/* Avisos Importantes */}
                    <section>
                        <h2 className="text-2xl font-bold text-cyan mb-4">
                            Avisos Importantes
                        </h2>
                        <HologramCard className="p-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 text-cyan animate-spin" />
                                    <span className="ml-3 text-metal-silver">
                                        Carregando avisos...
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {importantNotices.length > 0 ? (
                                        <>
                                            {importantNotices.map((notice) => (
                                                <div
                                                    key={notice.id}
                                                    className="flex items-start gap-4 p-4 bg-coal/50 rounded-lg"
                                                >
                                                    <div className="p-2 rounded-lg bg-techblue/10">
                                                        <AlertCircle className="w-5 h-5 text-techblue" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-metal-silver">
                                                            {notice.title}
                                                        </h4>
                                                        <p className="text-sm text-metal-silver/60 mt-1">
                                                            {notice.message}
                                                        </p>
                                                        <p className="text-xs text-metal-silver/40 mt-2">
                                                            {new Date(notice.created_at).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                fullWidth
                                                onClick={() => navigate('/notifications')}
                                            >
                                                Ver todos os avisos
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Bell className="w-12 h-12 text-metal-silver/30 mx-auto mb-4" />
                                            <p className="text-metal-silver/60">
                                                Nenhum aviso no momento
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </HologramCard>
                    </section>

                    {/* Status Financeiro */}
                    <section className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-cyan mb-4">
                            Status Financeiro
                        </h2>
                        <HologramCard className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Mês Atual */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-cyan/10 rounded-lg">
                                        <CreditCard className="w-6 h-6 text-cyan" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-metal-silver/60">
                                            Condomínio
                                        </p>
                                        <p className="text-xl font-bold text-cyan">
                                            {financialData.currentMonth}
                                        </p>
                                    </div>
                                </div>

                                {/* Valor */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-techblue/10 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-techblue" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-metal-silver/60">
                                            Valor
                                        </p>
                                        <p className="text-xl font-bold text-metal-silver">
                                            {formatCurrency(financialData.amount)}
                                        </p>
                                    </div>
                                </div>

                                {/* Vencimento */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-alertorange/10 rounded-lg">
                                        <Clock className="w-6 h-6 text-alertorange" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-metal-silver/60">
                                            Vencimento
                                        </p>
                                        <p className="text-xl font-bold text-metal-silver">
                                            {formatDate(financialData.dueDate)}
                                        </p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${financialData.status === 'paid'
                                            ? 'bg-terminalgreen/10'
                                            : 'bg-criticalred/10'
                                            }`}
                                    >
                                        <CheckCircle2
                                            className={`w-6 h-6 ${financialData.status === 'paid'
                                                ? 'text-terminalgreen'
                                                : 'text-criticalred'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-metal-silver/60">
                                            Status
                                        </p>
                                        <p
                                            className={`text-xl font-bold ${financialData.status === 'paid'
                                                ? 'text-terminalgreen'
                                                : 'text-criticalred'
                                                }`}
                                        >
                                            {financialData.status === 'paid'
                                                ? 'Pago'
                                                : 'Pendente'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </HologramCard>
                    </section>
                </div>
            </div>
        </MainLayout>
    )
}

export default HomePage
