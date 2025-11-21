import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Calendar, Bot, Clock, TrendingUp } from 'lucide-react'
import { DataCard, HologramCard } from '@/components'
import { useAuthStore } from '@/store'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data (will be replaced with real API calls)
const mockReservationsData = [
    { day: 'Seg', reservas: 4 },
    { day: 'Ter', reservas: 7 },
    { day: 'Qua', reservas: 5 },
    { day: 'Qui', reservas: 9 },
    { day: 'Sex', reservas: 12 },
    { day: 'Sáb', reservas: 15 },
    { day: 'Dom', reservas: 10 },
]

const mockAIUsageData = [
    { dia: '1', uso: 12 },
    { dia: '5', uso: 19 },
    { dia: '10', uso: 25 },
    { dia: '15', uso: 32 },
    { dia: '20', uso: 28 },
    { dia: '25', uso: 35 },
    { dia: '30', uso: 42 },
]

const mockRecentActivities = [
    { id: 1, type: 'reservation', message: 'Nova reserva: Piscina - João Silva', time: '10min atrás' },
    { id: 2, type: 'user', message: 'Novo morador cadastrado: Maria Santos', time: '1h atrás' },
    { id: 3, type: 'document', message: 'Documento enviado: Ata da Reunião', time: '2h atrás' },
    { id: 4, type: 'ai', message: 'IA respondeu 15 perguntas hoje', time: '3h atrás' },
]

const DashboardPage = () => {
    const { user } = useAuthStore()
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const greeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-industrial border border-cyan-glow p-8 shadow-glow"
            >
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                                {greeting()}, {user?.full_name?.split(' ')[0] || 'Admin'}!
                            </h1>
                            <p className="text-metal-silver text-lg">
                                Bem-vindo ao painel de controle • Condomínio Prime Tower
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-cyan font-mono text-2xl">
                                <Clock className="w-6 h-6" />
                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <p className="text-metal-silver/60 text-sm mt-1">
                                {currentTime.toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scan Line Effect */}
                <div className="absolute inset-0 scan-line-container pointer-events-none">
                    <motion.div
                        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
                        animate={{ y: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard
                    label="Total de Unidades"
                    value="124"
                    icon={Building2}
                    variant="default"
                    size="md"
                    glowOnHover
                />
                <DataCard
                    label="Moradores Ativos"
                    value="387"
                    icon={Users}
                    variant="success"
                    trend="up"
                    trendValue="+12 este mês"
                    size="md"
                    glowOnHover
                />
                <DataCard
                    label="Reservas Hoje"
                    value="8"
                    icon={Calendar}
                    variant="info"
                    size="md"
                    glowOnHover
                />
                <DataCard
                    label="Uso IA (Mês)"
                    value="342"
                    icon={Bot}
                    variant="warning"
                    trend="up"
                    trendValue="+28%"
                    size="md"
                    glowOnHover
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reservations Chart */}
                <HologramCard className="p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-cyan mb-1">Reservas por Dia</h3>
                        <p className="text-sm text-metal-silver/60">Últimos 7 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mockReservationsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 240, 0.1)" />
                            <XAxis
                                dataKey="day"
                                stroke="#C5C6C7"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#C5C6C7" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2833',
                                    border: '1px solid rgba(0, 255, 240, 0.3)',
                                    borderRadius: '8px',
                                    color: '#C5C6C7'
                                }}
                            />
                            <Bar
                                dataKey="reservas"
                                fill="url(#colorGradient)"
                                radius={[8, 8, 0, 0]}
                            />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00FFF0" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#0A84FF" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </HologramCard>

                {/* AI Usage Chart */}
                <HologramCard className="p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-cyan mb-1">Uso da IA</h3>
                        <p className="text-sm text-metal-silver/60">Últimos 30 dias</p>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={mockAIUsageData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 240, 0.1)" />
                            <XAxis
                                dataKey="dia"
                                stroke="#C5C6C7"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#C5C6C7" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2833',
                                    border: '1px solid rgba(0, 255, 240, 0.3)',
                                    borderRadius: '8px',
                                    color: '#C5C6C7'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="uso"
                                stroke="#00FFF0"
                                fill="url(#colorArea)"
                                strokeWidth={2}
                            />
                            <defs>
                                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00FFF0" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#00FFF0" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </HologramCard>
            </div>

            {/* Recent Activities */}
            <HologramCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-cyan mb-1">Atividades Recentes</h3>
                        <p className="text-sm text-metal-silver/60">Últimas atualizações do sistema</p>
                    </div>
                    <button className="text-sm text-cyan hover:text-techblue transition-colors flex items-center gap-2">
                        Ver todas
                        <TrendingUp className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    {mockRecentActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-coal-light/30 rounded-lg border border-cyan-glow/20 hover:border-cyan-glow/50 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0">
                                {activity.type === 'reservation' && <Calendar className="w-5 h-5 text-cyan" />}
                                {activity.type === 'user' && <Users className="w-5 h-5 text-cyan" />}
                                {activity.type === 'document' && <Building2 className="w-5 h-5 text-cyan" />}
                                {activity.type === 'ai' && <Bot className="w-5 h-5 text-cyan" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-metal-silver">{activity.message}</p>
                                <p className="text-xs text-metal-silver/50 mt-1">{activity.time}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </HologramCard>
        </div>
    )
}

export default DashboardPage
