import { useState, useEffect } from 'react'
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    CheckCircle,
    XCircle,
    HelpCircle,
    Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components'
import { createRSVP, getMyRSVP } from '@/services/eventService'
import type { Event, EventRSVP } from '@/types/models'

interface EventDetailModalProps {
    isOpen: boolean
    event: Event
    onClose: () => void
}

const EventDetailModal = ({ isOpen, event, onClose }: EventDetailModalProps) => {
    const [myRSVP, setMyRSVP] = useState<EventRSVP | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen && event) {
            fetchMyRSVP()
        }
    }, [isOpen, event])

    const fetchMyRSVP = async () => {
        try {
            setIsLoading(true)
            const rsvp = await getMyRSVP(event.id)
            setMyRSVP(rsvp)
        } catch (err) {
            console.error('Error fetching RSVP:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRSVP = async (response: 'attending' | 'declined' | 'maybe') => {
        try {
            setIsSubmitting(true)
            await createRSVP(event.id, { response })

            const messages = {
                attending: 'Presença confirmada!',
                maybe: 'Resposta registrada como "Talvez"',
                declined: 'Você marcou que não irá ao evento'
            }

            toast.success(messages[response])
            await fetchMyRSVP()
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Erro ao registrar RSVP'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDateTime = (dateStr: string, timeStr: string) => {
        const date = new Date(dateStr)
        const time = new Date(timeStr)
        return {
            date: date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
            }),
            time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
    }

    const { date, time } = formatDateTime(event.event_date, event.start_time)
    const endTime = new Date(event.end_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    const isFull = event.capacity && event.attendee_count ? event.attendee_count >= event.capacity : false
    const canRSVP = event.status === 'scheduled' && !isFull

    const getCurrentResponseButton = (response: 'attending' | 'declined' | 'maybe') => {
        const isSelected = myRSVP?.response === response

        const config = {
            attending: {
                icon: CheckCircle,
                label: 'Vou Participar',
                selectedColor: 'bg-terminalgreen/20 text-terminalgreen border-terminalgreen',
                defaultColor: 'bg-coal-light text-metal-silver hover:bg-terminalgreen/10 hover:text-terminalgreen'
            },
            maybe: {
                icon: HelpCircle,
                label: 'Talvez',
                selectedColor: 'bg-yellow-400/20 text-yellow-400 border-yellow-400',
                defaultColor: 'bg-coal-light text-metal-silver hover:bg-yellow-400/10 hover:text-yellow-400'
            },
            declined: {
                icon: XCircle,
                label: 'Não Vou',
                selectedColor: 'bg-criticalred/20 text-criticalred border-criticalred',
                defaultColor: 'bg-coal-light text-metal-silver hover:bg-criticalred/10 hover:text-criticalred'
            }
        }

        const { icon: Icon, label, selectedColor, defaultColor } = config[response]

        return (
            <button
                onClick={() => handleRSVP(response)}
                disabled={isSubmitting || !canRSVP}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all font-medium ${
                    isSelected ? selectedColor : defaultColor
                } ${(!canRSVP || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Icon className="w-5 h-5" />
                {label}
            </button>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={event.title} size="md">
            <div className="space-y-6">
                {/* Description */}
                {event.description && (
                    <div>
                        <p className="text-metal-silver leading-relaxed">
                            {event.description}
                        </p>
                    </div>
                )}

                {/* Event Details */}
                <div className="space-y-3 p-4 bg-coal/50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-cyan/50 mt-0.5" />
                        <div>
                            <p className="text-xs text-metal-silver/60 uppercase">Data</p>
                            <p className="text-metal-silver font-medium capitalize">{date}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-cyan/50 mt-0.5" />
                        <div>
                            <p className="text-xs text-metal-silver/60 uppercase">Horário</p>
                            <p className="text-metal-silver font-medium">{time} - {endTime}</p>
                        </div>
                    </div>

                    {event.location && (
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-cyan/50 mt-0.5" />
                            <div>
                                <p className="text-xs text-metal-silver/60 uppercase">Local</p>
                                <p className="text-metal-silver font-medium">{event.location}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-cyan/50 mt-0.5" />
                        <div>
                            <p className="text-xs text-metal-silver/60 uppercase">Participantes</p>
                            <p className="text-metal-silver font-medium">
                                {event.capacity
                                    ? `${event.attendee_count || 0} de ${event.capacity} vagas preenchidas`
                                    : `${event.attendee_count || 0} confirmados`
                                }
                            </p>
                            {isFull && (
                                <p className="text-xs text-criticalred mt-1">
                                    ⚠️ Evento lotado
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Current RSVP Status */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 text-cyan animate-spin" />
                    </div>
                ) : myRSVP && (
                    <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                        <p className="text-sm text-cyan">
                            <span className="font-medium">Sua resposta:</span>{' '}
                            {myRSVP.response === 'attending'
                                ? 'Confirmado ✓'
                                : myRSVP.response === 'maybe'
                                ? 'Talvez'
                                : 'Não vai'
                            }
                        </p>
                    </div>
                )}

                {/* RSVP Buttons */}
                {event.status === 'scheduled' && (
                    <div>
                        <p className="text-sm text-metal-silver/70 mb-3">
                            Confirme sua presença:
                        </p>
                        <div className="flex gap-3">
                            {getCurrentResponseButton('attending')}
                            {getCurrentResponseButton('maybe')}
                            {getCurrentResponseButton('declined')}
                        </div>
                        {!canRSVP && isFull && (
                            <p className="text-xs text-criticalred mt-2 text-center">
                                Este evento atingiu a capacidade máxima
                            </p>
                        )}
                    </div>
                )}

                {event.status === 'cancelled' && (
                    <div className="p-4 bg-criticalred/10 border border-criticalred/30 rounded-lg">
                        <p className="text-criticalred font-medium text-center">
                            Este evento foi cancelado
                        </p>
                    </div>
                )}

                {event.status === 'completed' && (
                    <div className="p-4 bg-terminalgreen/10 border border-terminalgreen/30 rounded-lg">
                        <p className="text-terminalgreen font-medium text-center">
                            Este evento já foi concluído
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default EventDetailModal
