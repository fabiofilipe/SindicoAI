import { useState } from 'react'
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    Plus,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { MainLayout, HologramCard, Button, Modal, Input } from '@/components'

interface CommonArea {
    id: number
    name: string
    description: string
    capacity: number
    hourlyRate: number
    availableHours: string[]
}

interface Reservation {
    id: number
    areaId: number
    areaName: string
    date: string
    startTime: string
    endTime: string
    status: 'confirmed' | 'pending' | 'cancelled'
}

const ReservationsPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
    })

    // TODO: Buscar áreas comuns da API
    const commonAreas: CommonArea[] = [
        {
            id: 1,
            name: 'Salão de Festas',
            description: 'Espaço ideal para festas e eventos',
            capacity: 80,
            hourlyRate: 150,
            availableHours: ['08:00', '14:00', '18:00'],
        },
        {
            id: 2,
            name: 'Churrasqueira 1',
            description: 'Área gourmet com churrasqueira',
            capacity: 20,
            hourlyRate: 50,
            availableHours: ['10:00', '14:00', '18:00'],
        },
        {
            id: 3,
            name: 'Churrasqueira 2',
            description: 'Área gourmet com churrasqueira',
            capacity: 20,
            hourlyRate: 50,
            availableHours: ['10:00', '14:00', '18:00'],
        },
        {
            id: 4,
            name: 'Quadra de Esportes',
            description: 'Quadra poliesportiva',
            capacity: 16,
            hourlyRate: 30,
            availableHours: ['06:00', '08:00', '14:00', '16:00', '18:00'],
        },
    ]

    // TODO: Buscar reservas do usuário da API
    const myReservations: Reservation[] = [
        {
            id: 1,
            areaId: 1,
            areaName: 'Salão de Festas',
            date: '2025-11-25',
            startTime: '14:00',
            endTime: '22:00',
            status: 'confirmed',
        },
        {
            id: 2,
            areaId: 2,
            areaName: 'Churrasqueira 1',
            date: '2025-11-28',
            startTime: '18:00',
            endTime: '23:00',
            status: 'confirmed',
        },
    ]

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

        // TODO: Integrar com API de reservas
        console.log('Nova reserva:', {
            areaId: selectedArea?.id,
            ...formData,
        })

        // Fechar modal após sucesso
        handleCloseModal()
    }

    const handleCancelReservation = async (reservationId: number) => {
        // TODO: Integrar com API para cancelar reserva
        console.log('Cancelar reserva:', reservationId)
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
                                                    ${
                                                        isSelected
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
                                                {formatCurrency(area.hourlyRate)}/hora
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
                        {myReservations.length > 0 ? (
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
                                                    {reservation.areaName}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-metal-silver/60 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        {formatDate(reservation.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {reservation.startTime} -{' '}
                                                        {reservation.endTime}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                                        reservation.status ===
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
                                    Taxa: {formatCurrency(selectedArea.hourlyRate)}/hora
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
                            <Button type="submit" variant="primary" fullWidth>
                                Confirmar Reserva
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </MainLayout>
    )
}

export default ReservationsPage
