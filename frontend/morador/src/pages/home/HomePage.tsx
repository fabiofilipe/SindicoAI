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
} from 'lucide-react'
import { MainLayout, HologramCard, Button } from '@/components'

const HomePage = () => {
    const navigate = useNavigate()

    // TODO: Buscar dados do usuário da API
    const userName = 'João Silva'
    const apartmentNumber = '301'
    const building = 'Torre A'

    // TODO: Buscar próximas reservas da API
    const upcomingReservations = [
        {
            id: 1,
            area: 'Salão de Festas',
            date: '2025-11-25',
            time: '14:00',
        },
        {
            id: 2,
            area: 'Churrasqueira 1',
            date: '2025-11-28',
            time: '18:00',
        },
    ]

    // TODO: Buscar avisos importantes da API
    const importantNotices = [
        {
            id: 1,
            title: 'Manutenção Programada',
            description: 'Elevadores em manutenção no dia 24/11',
            type: 'warning',
        },
        {
            id: 2,
            title: 'Assembleia Geral',
            description: 'Reunião dia 30/11 às 19h no salão',
            type: 'info',
        },
    ]

    // TODO: Buscar dados financeiros da API
    const financialData = {
        currentMonth: 'Novembro',
        amount: 850.0,
        dueDate: '2025-11-10',
        status: 'paid', // 'paid' | 'pending' | 'overdue'
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
                            {upcomingReservations.length > 0 ? (
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
                                                    {reservation.area}
                                                </h4>
                                                <p className="text-sm text-metal-silver/60 flex items-center gap-2 mt-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(reservation.date)} às{' '}
                                                    {reservation.time}
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
                            <div className="space-y-4">
                                {importantNotices.map((notice) => (
                                    <div
                                        key={notice.id}
                                        className="flex items-start gap-4 p-4 bg-coal/50 rounded-lg"
                                    >
                                        <div
                                            className={`p-2 rounded-lg ${
                                                notice.type === 'warning'
                                                    ? 'bg-alertorange/10'
                                                    : 'bg-techblue/10'
                                            }`}
                                        >
                                            <AlertCircle
                                                className={`w-5 h-5 ${
                                                    notice.type === 'warning'
                                                        ? 'text-alertorange'
                                                        : 'text-techblue'
                                                }`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-metal-silver">
                                                {notice.title}
                                            </h4>
                                            <p className="text-sm text-metal-silver/60 mt-1">
                                                {notice.description}
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
                            </div>
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
                                        className={`p-3 rounded-lg ${
                                            financialData.status === 'paid'
                                                ? 'bg-terminalgreen/10'
                                                : 'bg-criticalred/10'
                                        }`}
                                    >
                                        <CheckCircle2
                                            className={`w-6 h-6 ${
                                                financialData.status === 'paid'
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
                                            className={`text-xl font-bold ${
                                                financialData.status === 'paid'
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
