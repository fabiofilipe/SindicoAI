import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, User, MapPin, Loader2 } from 'lucide-react'
import { Card, Badge } from '@/components'
import { listReservations } from '@/services/reservationService'
import { listCommonAreas } from '@/services/commonAreaService'
import type { Reservation, CommonArea } from '@/types/models'

const SchedulePage = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [commonAreas, setCommonAreas] = useState<Record<string, CommonArea>>({})
    const [filter, setFilter] = useState<'all' | 'next3h' | 'in-progress'>('all')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resData, areasData] = await Promise.all([
                    listReservations(),
                    listCommonAreas()
                ])

                // Create areas map
                const areasMap = areasData.reduce((acc: Record<string, CommonArea>, area: CommonArea) => {
                    acc[area.id] = area
                    return acc
                }, {})
                setCommonAreas(areasMap)

                // Filter today's reservations
                const today = new Date().toISOString().split('T')[0]
                const todayRes = resData.filter((r: Reservation) =>
                    r.start_time.startsWith(today)
                )
                setReservations(todayRes)

            } catch (error) {
                console.error('Erro ao carregar agenda:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const getFilteredReservations = () => {
        const now = new Date()

        switch (filter) {
            case 'next3h':
                const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000)
                return reservations.filter(r => {
                    const start = new Date(r.start_time)
                    return start > now && start < threeHoursLater
                })
            case 'in-progress':
                return reservations.filter(r => {
                    const start = new Date(r.start_time)
                    const end = new Date(r.end_time)
                    return start <= now && end >= now
                })
            default:
                return reservations
        }
    }

    const getAreaName = (areaId: string) => {
        return commonAreas[areaId]?.name || 'Área Comum'
    }

    const formatTime = (datetime: string) => {
        return new Date(datetime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const filteredReservations = getFilteredReservations()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-4">AGENDA DO DIA</h1>
                <p className="text-xl text-metal-silver">
                    {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                    })}
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-lg text-base font-semibold transition-all ${filter === 'all'
                            ? 'bg-neon-cyan text-coal'
                            : 'bg-charcoal text-metal-silver hover:text-neon-cyan'
                        }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFilter('next3h')}
                    className={`px-6 py-3 rounded-lg text-base font-semibold transition-all ${filter === 'next3h'
                            ? 'bg-neon-cyan text-coal'
                            : 'bg-charcoal text-metal-silver hover:text-neon-cyan'
                        }`}
                >
                    Próximas 3h
                </button>
                <button
                    onClick={() => setFilter('in-progress')}
                    className={`px-6 py-3 rounded-lg text-base font-semibold transition-all ${filter === 'in-progress'
                            ? 'bg-neon-cyan text-coal'
                            : 'bg-charcoal text-metal-silver hover:text-neon-cyan'
                        }`}
                >
                    Em Andamento
                </button>
            </div>

            {/* Reservations Timeline */}
            <div className="space-y-4">
                {filteredReservations.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-2xl text-metal-silver">
                            Nenhuma reserva para exibir
                        </p>
                    </Card>
                ) : (
                    filteredReservations.map((reservation) => (
                        <Card
                            key={reservation.id}
                            hover
                            onClick={() => navigate(`/reservations/${reservation.id}`)}
                            className="cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-shrink-0">
                                    <div className="text-3xl font-bold text-neon-cyan">
                                        <Clock className="inline mr-2" size={32} />
                                        {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                                    </div>
                                </div>

                                <div className="flex-grow space-y-2">
                                    <div className="flex items-center gap-4">
                                        <MapPin className="text-tech-blue" size={24} />
                                        <h3 className="text-2xl font-bold">{getAreaName(reservation.common_area_id)}</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <User className="text-terminal-green" size={24} />
                                        <p className="text-lg text-metal-silver">Morador ID: {reservation.user_id.slice(0, 8)}</p>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <Badge
                                        variant={reservation.status as any}
                                        pulse={reservation.status === 'pending'}
                                    >
                                        {reservation.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default SchedulePage
