import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserCheck, Briefcase, Shield, Calendar, Building2, Activity, TrendingUp, ArrowRight } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import Card from '@/components/ui/Card'
import SkeletonMetric from '@/components/ui/SkeletonMetric'
import { getDashboardMetrics } from '@/services/dashboardService'
import type { DashboardMetrics } from '@/types/dashboard'

const DashboardPage = () => {
    const navigate = useNavigate()
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
            description: 'Usuários cadastrados no sistema',
        },
        {
            label: 'Moradores',
            value: metrics.total_residents,
            icon: UserCheck,
            description: 'Residentes ativos',
        },
        {
            label: 'Funcionários',
            value: metrics.total_staff,
            icon: Briefcase,
            description: 'Equipe operacional',
        },
        {
            label: 'Administradores',
            value: metrics.total_admins,
            icon: Shield,
            description: 'Administradores do sistema',
        },
        {
            label: 'Reservas Totais',
            value: metrics.total_reservations,
            icon: Calendar,
            description: 'Reservas realizadas',
        },
        {
            label: 'Áreas Comuns',
            value: metrics.total_areas,
            icon: Building2,
            description: 'Espaços disponíveis',
        },
        {
            label: 'Reservas Ativas',
            value: metrics.active_reservations,
            icon: Activity,
            description: 'Em andamento ou confirmadas',
        },
        {
            label: 'Novos Usuários (7d)',
            value: metrics.recent_users,
            icon: TrendingUp,
            description: 'Cadastros nos últimos 7 dias',
        },
    ] : []

    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <div className="w-12 h-0.5 bg-brass rounded-full mb-4" />
                    <h1 className="text-3xl font-display font-bold text-ink mb-2">
                        Dashboard
                    </h1>
                    <p className="text-stone">
                        Visão geral do sistema SindicoAI
                    </p>
                </div>

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <SkeletonMetric key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} hover className="group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-stone mb-2">
                                            {stat.label}
                                        </p>
                                        <p className="text-3xl font-display font-bold text-brass mb-1 group-hover:scale-105 transition-transform origin-left">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-silver">
                                            {stat.description}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-lg bg-champagne flex items-center justify-center group-hover:bg-brass/10 transition-colors">
                                        <stat.icon className="w-6 h-6 text-brass" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card variant="signature">
                        <h2 className="text-xl font-display font-semibold text-ink mb-6">Ações Rápidas</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/users')}
                                className="w-full px-4 py-4 bg-parchment hover:bg-champagne border border-border-light hover:border-border-brass rounded-lg text-left transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-champagne group-hover:bg-brass/10 flex items-center justify-center transition-colors">
                                            <Users className="w-5 h-5 text-brass" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-ink">Gerenciar Usuários</p>
                                            <p className="text-xs text-stone">Criar, editar e desativar usuários</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-stone group-hover:text-brass transition-colors" strokeWidth={1.5} />
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/units')}
                                className="w-full px-4 py-4 bg-parchment hover:bg-champagne border border-border-light hover:border-border-brass rounded-lg text-left transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-champagne group-hover:bg-brass/10 flex items-center justify-center transition-colors">
                                            <Building2 className="w-5 h-5 text-brass" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-ink">Gerenciar Unidades</p>
                                            <p className="text-xs text-stone">Cadastrar e vincular apartamentos</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-stone group-hover:text-brass transition-colors" strokeWidth={1.5} />
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/common-areas')}
                                className="w-full px-4 py-4 bg-parchment hover:bg-champagne border border-border-light hover:border-border-brass rounded-lg text-left transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-champagne group-hover:bg-brass/10 flex items-center justify-center transition-colors">
                                            <Calendar className="w-5 h-5 text-brass" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-ink">Áreas Comuns</p>
                                            <p className="text-xs text-stone">Gerenciar espaços e reservas</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-stone group-hover:text-brass transition-colors" strokeWidth={1.5} />
                                </div>
                            </button>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-display font-semibold text-ink mb-6">Status do Sistema</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-graphite">API Backend</span>
                                <span className="flex items-center gap-2 text-garden text-sm font-medium">
                                    <span className="w-2 h-2 bg-garden rounded-full" />
                                    Online
                                </span>
                            </div>
                            <div className="border-t border-border-light" />
                            <div className="flex items-center justify-between py-2">
                                <span className="text-graphite">Database</span>
                                <span className="flex items-center gap-2 text-garden text-sm font-medium">
                                    <span className="w-2 h-2 bg-garden rounded-full" />
                                    Conectado
                                </span>
                            </div>
                            <div className="border-t border-border-light" />
                            <div className="flex items-center justify-between py-2">
                                <span className="text-graphite">Cache (Redis)</span>
                                <span className="flex items-center gap-2 text-garden text-sm font-medium">
                                    <span className="w-2 h-2 bg-garden rounded-full" />
                                    Ativo
                                </span>
                            </div>
                            <div className="border-t border-border-light" />
                            <div className="flex items-center justify-between py-2">
                                <span className="text-graphite">AI Service</span>
                                <span className="flex items-center gap-2 text-garden text-sm font-medium">
                                    <span className="w-2 h-2 bg-garden rounded-full" />
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
