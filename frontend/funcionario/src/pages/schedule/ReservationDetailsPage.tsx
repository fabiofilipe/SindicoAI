import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, User, MapPin, Loader2, CheckCircle, PlayCircle, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Card, Badge, Button, Modal } from '@/components'
import { listCommonAreas } from '@/services/commonAreaService'
import {
    getReservationDetails,
    startReservation,
    completeReservation,
    reportReservationIssue
} from '@/services/reservationService'
import type { Reservation, CommonArea } from '@/types/models'

const ReservationDetailsPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [reservation, setReservation] = useState<Reservation | null>(null)
    const [commonArea, setCommonArea] = useState<CommonArea | null>(null)
    const [isReportModalOpen, setIsReportModalOpen] = useState(false)
    const [issueDescription, setIssueDescription] = useState('')
    const [issueSeverity, setIssueSeverity] = useState<'low' | 'normal' | 'high'>('normal')
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchReservationDetails()
    }, [id])

    const fetchReservationDetails = async () => {
        if (!id) return

        try {
            setIsLoading(true)
            const [resData, areasData] = await Promise.all([
                getReservationDetails(id),
                listCommonAreas()
            ])

            setReservation(resData)

            // Find the common area
            const area = areasData.find((a: CommonArea) => a.id === resData.common_area_id)
            setCommonArea(area || null)

        } catch (err) {
            setError('Erro ao carregar detalhes da reserva')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStart = async () => {
        if (!id) return

        try {
            setActionLoading(true)
            setError('')
            await startReservation(id)
            setSuccess('Reserva iniciada com sucesso!')
            await fetchReservationDetails()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao iniciar reserva')
        } finally {
            setActionLoading(false)
        }
    }

    const handleComplete = async () => {
        if (!id) return

        try {
            setActionLoading(true)
            setError('')
            await completeReservation(id)
            setSuccess('Reserva concluída com sucesso!')
            await fetchReservationDetails()
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao concluir reserva')
        } finally {
            setActionLoading(false)
        }
    }

    const handleReportIssue = async (e: FormEvent) => {
        e.preventDefault()
        if (!id) return

        try {
            setActionLoading(true)
            setError('')
            await reportReservationIssue(id, {
                description: issueDescription,
                severity: issueSeverity
            })
            setSuccess('Problema reportado com sucesso!')
            setIsReportModalOpen(false)
            setIssueDescription('')
            setIssueSeverity('normal')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao reportar problema')
        } finally {
            setActionLoading(false)
        }
    }

    const formatTime = (datetime: string) => {
        return new Date(datetime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDate = (datetime: string) => {
        return new Date(datetime).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-neon-cyan" />
            </div>
        )
    }

    if (!reservation) {
        return (
            <div className="p-6 text-center">
                <p className="text-2xl text-metal-silver">Reserva não encontrada</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 pb-24">
            {/* Back Button */}
            <button
                onClick={() => navigate('/schedule')}
                className="flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 text-lg"
            >
                <ArrowLeft size={24} />
                Voltar para Agenda
            </button>

            {/* Header */}
            <div className="flex items-center gap-4">
                <MapPin size={48} className="text-neon-cyan" />
                <div>
                    <h1 className="text-4xl font-bold">{commonArea?.name || 'Área Comum'}</h1>
                    <p className="text-xl text-metal-silver capitalize">{formatDate(reservation.start_time)}</p>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="bg-terminal-green/20 border border-terminal-green rounded-lg p-4">
                    <p className="text-terminal-green text-center text-lg">{success}</p>
                </div>
            )}
            {error && (
                <div className="bg-critical-red/20 border border-critical-red rounded-lg p-4">
                    <p className="text-critical-red text-center text-lg">{error}</p>
                </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <Clock size={48} className="mx-auto mb-4 text-neon-cyan" />
                    <div className="text-4xl font-bold text-neon-cyan mb-2">
                        {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
                    </div>
                    <div className="text-lg text-metal-silver">Horário</div>
                </Card>

                <Card className="text-center">
                    <User size={48} className="mx-auto mb-4 text-tech-blue" />
                    <div className="text-2xl font-bold mb-2">
                        {reservation.user_id.slice(0, 8)}
                    </div>
                    <div className="text-lg text-metal-silver">Morador ID</div>
                </Card>

                <Card className="text-center">
                    <div className="mb-4">
                        <Badge
                            variant={reservation.status as any}
                            pulse={reservation.status === 'in-progress'}
                        >
                            <span className="text-2xl">{reservation.status.toUpperCase()}</span>
                        </Badge>
                    </div>
                    <div className="text-lg text-metal-silver">Status Atual</div>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reservation.status === 'confirmed' && (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleStart}
                        isLoading={actionLoading}
                        className="w-full"
                    >
                        <PlayCircle size={28} />
                        MARCAR COMO INICIADA
                    </Button>
                )}

                {reservation.status === 'in-progress' && (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleComplete}
                        isLoading={actionLoading}
                        className="w-full"
                    >
                        <CheckCircle size={28} />
                        MARCAR COMO CONCLUÍDA
                    </Button>
                )}

                <Button
                    variant="danger"
                    size="lg"
                    onClick={() => setIsReportModalOpen(true)}
                    disabled={actionLoading}
                    className="w-full"
                >
                    <AlertTriangle size={28} />
                    REPORTAR PROBLEMA
                </Button>
            </div>

            {/* Report Issue Modal */}
            <Modal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                title="Reportar Problema"
            >
                <form onSubmit={handleReportIssue} className="space-y-6">
                    <div>
                        <label className="block text-metal-silver font-medium mb-2 text-lg">
                            Descrição do Problema
                        </label>
                        <textarea
                            value={issueDescription}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIssueDescription(e.target.value)}
                            className="w-full px-4 py-3 min-h-[150px] text-base bg-charcoal border-2 border-metal-silver/30 text-white placeholder-metal-silver/50 rounded-lg focus:outline-none focus:border-neon-cyan focus:shadow-glow-cyan"
                            placeholder="Descreva o problema..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-metal-silver font-medium mb-2 text-lg">
                            Severidade
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIssueSeverity('low')}
                                className={`flex-1 px-4 py-3 rounded-lg text-base font-semibold transition-all ${issueSeverity === 'low'
                                    ? 'bg-terminal-green text-coal'
                                    : 'bg-charcoal text-metal-silver hover:text-terminal-green'
                                    }`}
                            >
                                Baixa
                            </button>
                            <button
                                type="button"
                                onClick={() => setIssueSeverity('normal')}
                                className={`flex-1 px-4 py-3 rounded-lg text-base font-semibold transition-all ${issueSeverity === 'normal'
                                    ? 'bg-alert-orange text-coal'
                                    : 'bg-charcoal text-metal-silver hover:text-alert-orange'
                                    }`}
                            >
                                Normal
                            </button>
                            <button
                                type="button"
                                onClick={() => setIssueSeverity('high')}
                                className={`flex-1 px-4 py-3 rounded-lg text-base font-semibold transition-all ${issueSeverity === 'high'
                                    ? 'bg-critical-red text-white'
                                    : 'bg-charcoal text-metal-silver hover:text-critical-red'
                                    }`}
                            >
                                Alta
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={() => setIsReportModalOpen(false)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={actionLoading}
                            className="flex-1"
                        >
                            Enviar Relatório
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ReservationDetailsPage
