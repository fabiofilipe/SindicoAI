import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Bell, FileText, User, Loader2 } from 'lucide-react'
import { Card } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { listReservations } from '@/services/reservationService'
import { listNotifications } from '@/services/notificationService'
import type { Reservation, Notification } from '@/types/models'

const DashboardPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [todayReservations, setTodayReservations] = useState<Reservation[]>([])
    const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const now = new Date()
                const today = now.toISOString().split('T')[0]

                // Fetch reservations
                const reservations = await listReservations()

                // Filter today's reservations
                const todayRes = reservations.filter((r: Reservation) =>
                    r.start_time.startsWith(today) &&
                    (r.status === 'confirmed' || r.status === 'pending')
                )
                setTodayReservations(todayRes)

                // Filter upcoming (next 3 hours)
                const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000)
                const upcoming = reservations.filter((r: Reservation) => {
                    const startTime = new Date(r.start_time)
                    return startTime > now && startTime < threeHoursLater
                })
                setUpcomingReservations(upcoming)

                // Fetch notifications
                const notifications = await listNotifications()
                const unread = notifications.filter(n => !n.is_read)
                setUnreadNotifications(unread)

            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const quickActions = [
        {
            icon: <Calendar size={48} className="text-neon-cyan" />,
            title: 'VER AGENDA',
            description: 'Reservas do dia',
            onClick: () => navigate('/schedule'),
        },
        {
            icon: <Bell size={48} className="text-alert-orange" />,
            title: 'NOTIFICAÇÕES',
            description: `${unreadNotifications.length} não lidas`,
            onClick: () => navigate('/notifications'),
        },
        {
            icon: <FileText size={48} className="text-terminal-green" />,
            title: 'RELATÓRIO',
            description: 'Resumo rápido',
            onClick: () => alert('Em breve'),
        },
        {
            icon: <User size={48} className="text-tech-blue" />,
            title: 'MEU PERFIL',
            description: 'Configurações',
            onClick: () => navigate('/profile'),
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Bem-vindo, {user?.full_name?.split(' ')[0]}
                </h1>
                <p className="text-xl text-metal-silver">
                    {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Status Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <div className="text-6xl font-bold text-neon-cyan mb-2 text-glow-cyan">
                        {todayReservations.length}
                    </div>
                    <div className="text-xl text-metal-silver">Reservas Hoje</div>
                </Card>

                <Card className="text-center">
                    <div className="text-6xl font-bold text-alert-orange mb-2">
                        {upcomingReservations.length}
                    </div>
                    <div className="text-xl text-metal-silver">Próximas 3h</div>
                </Card>

                <Card className="text-center">
                    <div className="text-6xl font-bold text-terminal-green mb-2 glow-green">
                        {unreadNotifications.length}
                    </div>
                    <div className="text-xl text-metal-silver">Notificações</div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-3xl font-bold mb-6 text-center">AÇÕES RÁPIDAS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickActions.map((action, index) => (
                        <Card
                            key={index}
                            hover
                            onClick={action.onClick}
                            className="p-8 flex flex-col items-center text-center cursor-pointer"
                        >
                            <div className="mb-4">{action.icon}</div>
                            <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                            <p className="text-metal-silver">{action.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
