import { useState, useEffect } from 'react'
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    Plus,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react'
import { MainLayout, HologramCard, Button, Modal, Input } from '@/components'
import { listCommonAreas } from '@/services/commonAreaService'
import {
    getMyReservations,
    createReservation,
    cancelReservation,
} from '@/services/reservationService'
import type { CommonArea, Reservation } from '@/types/models'

const ReservationsPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
    })

    // Estados para dados da API
    const [commonAreas, setCommonAreas] = useState<CommonArea[]>([])
    const [myReservations, setMyReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Buscar dados ao montar o componente
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const [areasData, reservationsData] = await Promise.all([
                listCommonAreas(),
                getMyReservations(),
            ])

            setCommonAreas(areasData)
            setMyReservations(reservationsData)
        } catch (err) {
            console.error('Erro ao carregar dados:', err)
            setError('Erro ao carregar dados. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    // Funções do calendário
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return { daysInMonth, startingDayOfWeek }
    }

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
        })
    }

    const changeMonth = (increment: number) => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev)
            newDate.setMonth(newDate.getMonth() + increment)
            return newDate
        })
    }

    const selectDay = (day: number) => {
        const newDate = new Date(selectedDate)
        newDate.setDate(day)
        setSelectedDate(newDate)
        setFormData((prev) => ({
            ...prev,
            date: newDate.toISOString().split('T')[0],
        }))
    }

    const handleOpenModal = (area: CommonArea) => {
        setSelectedArea(area)
        setFormData({
            date: selectedDate.toISOString().split('T')[0],
            startTime: '',
            endTime: '',
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedArea(null)
        setFormData({ date: '', startTime: '', endTime: '' })
    }

    const handleSubmitReservation = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedArea) return

        try {
            setIsSubmitting(true)
            setError(null)

            // Criar o objeto de reserva no formato esperado pelo backend
            const startDateTime = new Date(`${formData.date}T${formData.startTime}:00`)
            const endDateTime = new Date(`${formData.date}T${formData.endTime}:00`)

            await createReservation({
                common_area_id: selectedArea.id,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
            })

            // Atualizar lista de reservas
            await fetchData()

            // Fechar modal após sucesso
            handleCloseModal()
        } catch (err: any) {
            console.error('Erro ao criar reserva:', err)
            setError(err.response?.data?.detail || 'Erro ao criar reserva. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelReservation = async (reservationId: string) => {
        if (!confirm('Tem certeza que deseja cancelar esta reserva?')) {
            return
        }

        try {
            setError(null)
            await cancelReservation(reservationId)

            // Atualizar lista de reservas
            await fetchData()
        } catch (err: any) {
            console.error('Erro ao cancelar reserva:', err)
            setError(err.response?.data?.detail || 'Erro ao cancelar reserva. Tente novamente.')
        }
    }

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
            year: 'numeric',
        })
    }

    // Helper para buscar nome da área comum
    const getCommonAreaName = (areaId: string) => {
        const area = commonAreas.find(a => a.id === areaId)
        return area?.name || 'Área Comum'
    }

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate)
    const today = new Date()

    return (
        <MainLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                        Reservas de Áreas Comuns
                    </h1>
                    <p className="text-metal-silver">
                        Reserve espaços do condomínio de forma rápida e fácil
                    </p>
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

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendário */}
                    <div className="lg:col-span-1">
                        <HologramCard className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-cyan">
                                    {formatMonthYear(selectedDate)}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => changeMonth(-1)}
                                        className="p-2 hover:bg-coal rounded-lg transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-cyan" />
                                    </button>
                                    <button
                                        onClick={() => changeMonth(1)}
                                        className="p-2 hover:bg-coal rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-cyan" />
                                    </button>
                                </div>
                            </div>

                            {/* Dias da semana */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(
                                    (day, i) => (
                                        <div
                                            key={i}
                                            className="text-center text-xs font-bold text-metal-silver/60 py-2"
                                        >
                                            {day}
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Dias do mês */}
                            <div className="grid grid-cols-7 gap-1">
                                {/* Espaços vazios antes do primeiro dia */}
                                {Array.from({ length: startingDayOfWeek }).map(
                                    (_, i) => (
                                        <div key={`empty-${i}`} />
                                    )
                                )}

                                {/* Dias do mês */}
                                {Array.from({ length: daysInMonth }).map(
                                    (_, i) => {
                                        const day = i + 1
                                        const isToday =
                                            today.getDate() === day &&
                                            today.getMonth() ===
                                            selectedDate.getMonth() &&
                                            today.getFullYear() ===
                                            selectedDate.getFullYear()
                                        const isSelected =
                                            selectedDate.getDate() === day

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => selectDay(day)}
                                                className={`
                                                    aspect-square rounded-lg text-sm font-medium
                                                    transition-all duration-200
                                                    ${isSelected
                                                        ? 'bg-gradient-cyber text-coal font-bold shadow-glow'
                                                        : isToday
                                                            ? 'bg-cyan/20 text-cyan border border-cyan'
                                                            : 'text-metal-silver hover:bg-coal'
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        )
                                    }
                                )}
                            </div>

                            {/* Data selecionada */}
                            <div className="mt-4 pt-4 border-t border-cyan-glow/30">
                                <p className="text-sm text-metal-silver/60 mb-1">
                                    Data selecionada
                                </p>
                                <p className="font-bold text-cyan">
                                    {formatDate(
                                        selectedDate.toISOString().split('T')[0]
                                    )}
                                </p>
                            </div>
                        </HologramCard>
                    </div>

                    {/* Áreas Disponíveis */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-cyan mb-4">
                            Áreas Disponíveis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {commonAreas.map((area) => (
                                <HologramCard
                                    key={area.id}
                                    className="p-6 hover:border-cyan/50"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-cyan mb-1">
                                                {area.name}
                                            </h3>
                                            <p className="text-sm text-metal-silver/60">
                                                {area.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-metal-silver">
                                            <Users className="w-4 h-4 text-cyan/50" />
                                            <span>
                                                Capacidade: {area.capacity} pessoas
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-metal-silver">
                                            <Clock className="w-4 h-4 text-cyan/50" />
                                            <span>
                                                {area.hourly_rate ? formatCurrency(area.hourly_rate) : 'Gratuito'}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        fullWidth
                                        onClick={() => handleOpenModal(area)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Reservar
                                    </Button>
                                </HologramCard>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Minhas Reservas */}
                <section>
                    <h2 className="text-2xl font-bold text-cyan mb-4">
                        Minhas Reservas
                    </h2>
                    <HologramCard className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 text-cyan animate-spin" />
                                <span className="ml-3 text-metal-silver">Carregando reservas...</span>
                            </div>
                        ) : myReservations.length > 0 ? (
                            <div className="space-y-4">
                                {myReservations.map((reservation) => (
                                    <div
                                        key={reservation.id}
                                        className="flex items-center justify-between p-4 bg-coal/50 rounded-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-cyan/10 rounded-lg">
                                                <CalendarIcon className="w-6 h-6 text-cyan" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-metal-silver">
                                                    {getCommonAreaName(reservation.common_area_id)}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-metal-silver/60 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        {new Date(reservation.start_time).toLocaleDateString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {new Date(reservation.start_time).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })} -{' '}
                                                        {new Date(reservation.end_time).toLocaleTimeString('pt-BR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${reservation.status ===
                                                        'confirmed'
                                                        ? 'bg-terminalgreen/20 text-terminalgreen'
                                                        : reservation.status ===
                                                            'pending'
                                                            ? 'bg-alertorange/20 text-alertorange'
                                                            : 'bg-criticalred/20 text-criticalred'
                                                        }`}
                                                >
                                                    {reservation.status === 'confirmed'
                                                        ? 'Confirmada'
                                                        : reservation.status ===
                                                            'pending'
                                                            ? 'Pendente'
                                                            : 'Cancelada'}
                                                </span>
                                            </div>
                                        </div>

                                        {reservation.status === 'confirmed' && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    handleCancelReservation(
                                                        reservation.id
                                                    )
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CalendarIcon className="w-12 h-12 text-metal-silver/30 mx-auto mb-4" />
                                <p className="text-metal-silver/60">
                                    Você ainda não tem reservas
                                </p>
                            </div>
                        )}
                    </HologramCard>
                </section>
            </div>

            {/* Modal de Reserva */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={`Reservar ${selectedArea?.name}`}
                size="md"
            >
                {selectedArea && (
                    <form onSubmit={handleSubmitReservation} className="space-y-6">
                        {/* Informações da área */}
                        <div className="p-4 bg-coal/50 rounded-lg space-y-2">
                            <div className="flex items-center gap-2 text-sm text-metal-silver">
                                <Users className="w-4 h-4 text-cyan/50" />
                                <span>Capacidade: {selectedArea.capacity} pessoas</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-metal-silver">
                                <Clock className="w-4 h-4 text-cyan/50" />
                                <span>
                                    Taxa: {selectedArea.hourly_rate ? formatCurrency(selectedArea.hourly_rate) : 'Gratuito'}
                                </span>
                            </div>
                        </div>

                        {/* Data */}
                        <Input
                            label="Data"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                }))
                            }
                            required
                        />

                        {/* Horários */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Horário Inicial"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        startTime: e.target.value,
                                    }))
                                }
                                required
                            />
                            <Input
                                label="Horário Final"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        endTime: e.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Criando...
                                    </>
                                ) : (
                                    'Confirmar Reserva'
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </MainLayout>
    )
}

export default ReservationsPage
