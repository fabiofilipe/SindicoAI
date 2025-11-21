import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, MapPin, User, Clock, XCircle, Filter } from 'lucide-react'
import { HologramCard, Button, Modal, Input, Select, Textarea, StatusBadge } from '@/components'
import { Reservation, ReservationStatus } from '@/types/reservation.types'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Mock data
const mockReservations: Reservation[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        common_area_id: '1',
        common_area_name: 'Piscina',
        user_id: 'user1',
        user_name: 'João Silva',
        unit_number: '101',
        reservation_date: '2024-01-25',
        start_time: '14:00',
        end_time: '16:00',
        status: 'confirmed',
        guests_count: 4,
        created_at: '2024-01-20',
        updated_at: '2024-01-20',
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        common_area_id: '2',
        common_area_name: 'Salão de Festas',
        user_id: 'user2',
        user_name: 'Maria Santos',
        unit_number: '205',
        reservation_date: '2024-01-26',
        start_time: '18:00',
        end_time: '23:00',
        status: 'confirmed',
        guests_count: 30,
        created_at: '2024-01-18',
        updated_at: '2024-01-18',
    },
    {
        id: '3',
        tenant_id: 'tenant1',
        common_area_id: '3',
        common_area_name: 'Academia',
        user_id: 'user3',
        user_name: 'Pedro Costa',
        unit_number: '302',
        reservation_date: '2024-01-25',
        start_time: '07:00',
        end_time: '08:00',
        status: 'pending',
        guests_count: 1,
        created_at: '2024-01-24',
        updated_at: '2024-01-24',
    },
    {
        id: '4',
        tenant_id: 'tenant1',
        common_area_id: '1',
        common_area_name: 'Piscina',
        user_id: 'user4',
        user_name: 'Ana Lima',
        unit_number: '103',
        reservation_date: '2024-01-24',
        start_time: '10:00',
        end_time: '12:00',
        status: 'completed',
        guests_count: 2,
        created_at: '2024-01-15',
        updated_at: '2024-01-24',
    },
    {
        id: '5',
        tenant_id: 'tenant1',
        common_area_id: '2',
        common_area_name: 'Salão de Festas',
        user_id: 'user5',
        user_name: 'Carlos Souza',
        unit_number: '404',
        reservation_date: '2024-01-23',
        start_time: '19:00',
        end_time: '23:00',
        status: 'cancelled',
        guests_count: 25,
        created_at: '2024-01-10',
        updated_at: '2024-01-22',
    },
]

const mockAreas = [
    { id: '1', name: 'Piscina' },
    { id: '2', name: 'Salão de Festas' },
    { id: '3', name: 'Academia' },
    { id: '4', name: 'Quadra Poliesportiva' },
]

const reservationSchema = z.object({
    common_area_id: z.string().min(1, 'Selecione uma área comum'),
    reservation_date: z.string().min(1, 'Selecione uma data'),
    start_time: z.string().min(1, 'Informe o horário de início'),
    end_time: z.string().min(1, 'Informe o horário de término'),
    guests_count: z.number().optional(),
    notes: z.string().optional(),
})

type ReservationFormData = z.infer<typeof reservationSchema>

const statusLabels: Record<ReservationStatus, string> = {
    confirmed: 'Confirmada',
    pending: 'Pendente',
    cancelled: 'Cancelada',
    completed: 'Concluída',
}

const ReservationsPage = () => {
    const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
    const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'all'>('all')
    const [filterArea, setFilterArea] = useState<string>('all')
    const [filterDate, setFilterDate] = useState<string>('')

    const { isOpen: isCreateOpen, open: openCreate, close: closeCreate } = useModal()
    const { isOpen: isCancelOpen, open: openCancel, close: closeCancel } = useModal()
    const { toast, hideToast, success, error } = useToast()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
    })

    const handleCreate = async (_data: ReservationFormData) => {
        try {
            // await reservationsService.create(data)
            success('Reserva criada com sucesso!')
            closeCreate()
            reset()
        } catch {
            error('Erro ao criar reserva')
        }
    }

    const handleCancelConfirm = async () => {
        try {
            // await reservationsService.cancel(selectedReservation!.id)
            setReservations(
                reservations.map((r) =>
                    r.id === selectedReservation!.id ? { ...r, status: 'cancelled' } : r
                )
            )
            success('Reserva cancelada com sucesso!')
            closeCancel()
        } catch {
            error('Erro ao cancelar reserva')
        }
    }

    const filteredReservations = reservations.filter((reservation) => {
        if (filterStatus !== 'all' && reservation.status !== filterStatus) return false
        if (filterArea !== 'all' && reservation.common_area_id !== filterArea) return false
        if (filterDate && reservation.reservation_date !== filterDate) return false
        return true
    })

    // Group by date
    const groupedReservations = filteredReservations.reduce((acc, reservation) => {
        const date = reservation.reservation_date
        if (!acc[date]) acc[date] = []
        acc[date].push(reservation)
        return acc
    }, {} as Record<string, Reservation[]>)

    const sortedDates = Object.keys(groupedReservations).sort()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">Reservas</h1>
                    <p className="text-metal-silver">Gerencie as reservas de áreas comuns</p>
                </div>
                <Button onClick={openCreate} className="btn-glow flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nova Reserva
                </Button>
            </div>

            {/* Filters */}
            <HologramCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-cyan" />
                    <h3 className="text-lg font-bold text-cyan">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                        label="Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | 'all')}
                    >
                        <option value="all">Todos</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídas</option>
                        <option value="cancelled">Canceladas</option>
                    </Select>
                    <Select
                        label="Área Comum"
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                    >
                        <option value="all">Todas</option>
                        {mockAreas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </Select>
                    <Input
                        label="Data"
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
            </HologramCard>

            {/* Reservations Timeline */}
            {sortedDates.length === 0 ? (
                <HologramCard className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-cyan/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-metal-silver mb-2">
                        Nenhuma reserva encontrada
                    </h3>
                    <p className="text-metal-silver/60">
                        Ajuste os filtros ou crie uma nova reserva
                    </p>
                </HologramCard>
            ) : (
                <div className="space-y-8">
                    {sortedDates.map((date) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan-glow/30 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-cyan" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-cyan">
                                        {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </h3>
                                    <p className="text-sm text-metal-silver/60">
                                        {groupedReservations[date].length} reserva(s)
                                    </p>
                                </div>
                            </div>

                            {/* Reservations Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedReservations[date].map((reservation, index) => (
                                    <motion.div
                                        key={reservation.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <HologramCard className="p-5 h-full flex flex-col">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <MapPin className="w-5 h-5 text-cyan flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-cyan truncate">
                                                            {reservation.common_area_name}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <StatusBadge
                                                    status={reservation.status}
                                                    size="sm"
                                                    className="ml-2"
                                                >
                                                    {statusLabels[reservation.status]}
                                                </StatusBadge>
                                            </div>

                                            {/* User Info */}
                                            <div className="space-y-2 mb-4 flex-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="w-4 h-4 text-cyan" />
                                                    <span className="text-metal-silver/60">Morador:</span>
                                                    <span className="text-metal-silver font-medium">
                                                        {reservation.user_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-metal-silver/60 ml-6">Unidade:</span>
                                                    <span className="text-metal-silver font-mono font-bold">
                                                        {reservation.unit_number}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="w-4 h-4 text-cyan" />
                                                    <span className="text-metal-silver/60">Horário:</span>
                                                    <span className="text-metal-silver font-mono">
                                                        {reservation.start_time} - {reservation.end_time}
                                                    </span>
                                                </div>
                                                {reservation.guests_count && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="w-4 h-4 text-cyan" />
                                                        <span className="text-metal-silver/60">Convidados:</span>
                                                        <span className="text-metal-silver font-bold">
                                                            {reservation.guests_count}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {reservation.status === 'confirmed' && (
                                                <div className="pt-3 border-t border-cyan-glow/30">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedReservation(reservation)
                                                            openCancel()
                                                        }}
                                                        className="w-full py-2 px-3 bg-criticalred/10 hover:bg-criticalred/20 border border-criticalred/30 rounded-lg text-criticalred text-sm transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Cancelar Reserva
                                                    </button>
                                                </div>
                                            )}
                                        </HologramCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal isOpen={isCreateOpen} onClose={closeCreate} title="Nova Reserva" size="lg">
                <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
                    <Select
                        label="Área Comum"
                        {...register('common_area_id')}
                        error={errors.common_area_id?.message}
                        required
                    >
                        <option value="">Selecione uma área</option>
                        {mockAreas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </Select>

                    <Input
                        label="Data da Reserva"
                        type="date"
                        {...register('reservation_date')}
                        error={errors.reservation_date?.message}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Horário Início"
                            type="time"
                            {...register('start_time')}
                            error={errors.start_time?.message}
                            required
                        />
                        <Input
                            label="Horário Fim"
                            type="time"
                            {...register('end_time')}
                            error={errors.end_time?.message}
                            required
                        />
                    </div>

                    <Input
                        label="Número de Convidados"
                        type="number"
                        {...register('guests_count', { valueAsNumber: true })}
                        error={errors.guests_count?.message}
                        placeholder="Opcional"
                    />

                    <Textarea
                        label="Observações"
                        {...register('notes')}
                        error={errors.notes?.message}
                        placeholder="Informações adicionais sobre a reserva..."
                        rows={3}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" onClick={closeCreate} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 btn-glow">
                            Criar Reserva
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Cancel Confirmation Modal */}
            <Modal isOpen={isCancelOpen} onClose={closeCancel} title="Cancelar Reserva" size="md">
                <div className="space-y-4">
                    <p className="text-metal-silver">
                        Tem certeza que deseja cancelar a reserva de{' '}
                        <span className="text-cyan font-bold">{selectedReservation?.common_area_name}</span>{' '}
                        para o dia{' '}
                        <span className="text-cyan font-bold">
                            {selectedReservation?.reservation_date &&
                                new Date(selectedReservation.reservation_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        ?
                    </p>
                    <div className="bg-criticalred/10 border border-criticalred/30 rounded-lg p-4">
                        <p className="text-sm text-criticalred">
                            Esta ação não pode ser desfeita. O morador será notificado do cancelamento.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeCancel} className="flex-1 bg-coal-light hover:bg-coal">
                            Voltar
                        </Button>
                        <Button onClick={handleCancelConfirm} className="flex-1 bg-gradient-alert">
                            Confirmar Cancelamento
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

export default ReservationsPage
