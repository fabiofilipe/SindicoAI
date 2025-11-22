import { useEffect, useState } from 'react'
import { Users, UserCheck, Briefcase, Shield, Calendar, Building2, Activity, TrendingUp } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import Card from '@/components/ui/Card'
import { getDashboardMetrics } from '@/services/dashboardService'
import type { DashboardMetrics } from '@/types/dashboard'

const DashboardPage = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadMetrics = async () => {
            try {
                const data = await getDashboardMetrics()
                setMetrics(data)
            } catch (error) {
                console.error('Erro ao carregar métricas:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadMetrics()
    }, [])

    const stats = metrics ? [
        {
            label: 'Total de Usuários',
            value: metrics.total_users,
            icon: Users,
            color: 'cyan',
            description: 'Usuários cadastrados no sistema',
        },
        {
            label: 'Moradores',
            value: metrics.total_residents,
            icon: UserCheck,
            color: 'techblue',
            description: 'Residentes ativos',
        },
        {
            label: 'Funcionários',
            value: metrics.total_staff,
            icon: Briefcase,
            color: 'purple',
            description: 'Equipe operacional',
        },
        {
            label: 'Administradores',
            value: metrics.total_admins,
            icon: Shield,
            color: 'alertorange',
            description: 'Administradores do sistema',
        },
        {
            label: 'Reservas Totais',
            value: metrics.total_reservations,
            icon: Calendar,
            color: 'terminalgreen',
            description: 'Reservas realizadas',
        },
        {
            label: 'Áreas Comuns',
            value: metrics.total_areas,
            icon: Building2,
            color: 'cyan',
            description: 'Espaços disponíveis',
        },
        {
            label: 'Reservas Ativas',
            value: metrics.active_reservations,
            icon: Activity,
            color: 'techblue',
            description: 'Em andamento ou confirmadas',
        },
        {
            label: 'Novos Usuários (7d)',
            value: metrics.recent_users,
            icon: TrendingUp,
            color: 'terminalgreen',
            description: 'Cadastros nos últimos 7 dias',
        },
    ] : []

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                        Dashboard
                    </h1>
                    <p className="text-metal-silver/80">
                        Visão geral do sistema SindicoAI
                    </p>
                </div>

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <div className="h-24 bg-coal/50 rounded" />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} hover className="group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-metal-silver/70 mb-2">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-bold text-cyan mb-1 group-hover:scale-110 transition-transform">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-metal-silver/60">
                                            {stat.description}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-${stat.color}/10 border border-${stat.color}/30`}>
                                        <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h2 className="text-xl font-bold text-cyan mb-4">Ações Rápidas</h2>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-coal hover:bg-coal-light border border-cyan-glow/30 hover:border-cyan rounded-lg text-left text-metal-silver hover:text-cyan transition-all">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5" />
                                    <div>
                                        <p className="font-medium">Gerenciar Usuários</p>
                                        <p className="text-xs text-metal-silver/60">Criar, editar e desativar usuários</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full px-4 py-3 bg-coal hover:bg-coal-light border border-cyan-glow/30 hover:border-cyan rounded-lg text-left text-metal-silver hover:text-cyan transition-all">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5" />
                                    <div>
                                        <p className="font-medium">Gerenciar Unidades</p>
                                        <p className="text-xs text-metal-silver/60">Cadastrar e vincular apartamentos</p>
                                    </div>
                                </div>
                            </button>
                            <button className="w-full px-4 py-3 bg-coal hover:bg-coal-light border border-cyan-glow/30 hover:border-cyan rounded-lg text-left text-metal-silver hover:text-cyan transition-all">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5" />
                                    <div>
                                        <p className="font-medium">Ver Reservas</p>
                                        <p className="text-xs text-metal-silver/60">Visualizar e gerenciar agendamentos</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-cyan mb-4">Status do Sistema</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-metal-silver">API Backend</span>
                                <span className="flex items-center gap-2 text-terminalgreen">
                                    <span className="w-2 h-2 bg-terminalgreen rounded-full animate-pulse" />
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-metal-silver">Database</span>
                                <span className="flex items-center gap-2 text-terminalgreen">
                                    <span className="w-2 h-2 bg-terminalgreen rounded-full animate-pulse" />
                                    Conectado
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-metal-silver">Cache (Redis)</span>
                                <span className="flex items-center gap-2 text-terminalgreen">
                                    <span className="w-2 h-2 bg-terminalgreen rounded-full animate-pulse" />
                                    Ativo
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-metal-silver">AI Service</span>
                                <span className="flex items-center gap-2 text-terminalgreen">
                                    <span className="w-2 h-2 bg-terminalgreen rounded-full animate-pulse" />
                                    Operacional
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}

export default DashboardPage
