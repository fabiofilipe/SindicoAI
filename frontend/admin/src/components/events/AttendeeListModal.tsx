import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, HelpCircle, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import SkeletonTable from '../ui/SkeletonTable'
import { getEventRSVPs, markAttendance } from '../../services/eventService'
import type { Event, EventRSVP } from '../../types/event'

interface AttendeeListModalProps {
    event: Event
    onClose: () => void
}

export default function AttendeeListModal({ event, onClose }: AttendeeListModalProps) {
    const [rsvps, setRsvps] = useState<EventRSVP[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'attending' | 'maybe' | 'declined'>('all')

    const loadRSVPs = async () => {
        try {
            setLoading(true)
            const data = await getEventRSVPs(event.id)
            setRsvps(data)
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Erro ao carregar RSVPs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRSVPs()
    }, [event.id])

    const handleMarkAttendance = async (rsvpId: string, attended: boolean) => {
        try {
            await markAttendance(rsvpId, attended)
            toast.success(attended ? 'Presença marcada!' : 'Presença desmarcada!')
            loadRSVPs()
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Erro ao marcar presença')
        }
    }

    const filteredRsvps = rsvps.filter(rsvp => {
        if (filter === 'all') return true
        return rsvp.response === filter
    })

    const getResponseBadge = (response: string) => {
        const config = {
            attending: { icon: CheckCircle, color: 'terminalgreen', label: 'Confirmado' },
            maybe: { icon: HelpCircle, color: 'yellow-400', label: 'Talvez' },
            declined: { icon: XCircle, color: 'alertorange', label: 'Recusou' }
        }
        const { icon: Icon, color, label } = config[response as keyof typeof config] || config.attending

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-${color}/20 text-${color} border border-${color}/30`}>
                <Icon className="w-3 h-3" />
                {label}
            </span>
        )
    }

    const stats = {
        total: rsvps.length,
        attending: rsvps.filter(r => r.response === 'attending').length,
        maybe: rsvps.filter(r => r.response === 'maybe').length,
        declined: rsvps.filter(r => r.response === 'declined').length,
        attended: rsvps.filter(r => r.attended).length
    }

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Participantes - ${event.title}`}
            size="lg"
        >
            <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-coal-light/50 p-3 rounded-lg border border-cyan-glow/20">
                        <p className="text-xs text-metal-silver/70">Total</p>
                        <p className="text-2xl font-bold text-cyan">{stats.total}</p>
                    </div>
                    <div className="bg-coal-light/50 p-3 rounded-lg border border-terminalgreen/20">
                        <p className="text-xs text-metal-silver/70">Confirmados</p>
                        <p className="text-2xl font-bold text-terminalgreen">{stats.attending}</p>
                    </div>
                    <div className="bg-coal-light/50 p-3 rounded-lg border border-yellow-400/20">
                        <p className="text-xs text-metal-silver/70">Talvez</p>
                        <p className="text-2xl font-bold text-yellow-400">{stats.maybe}</p>
                    </div>
                    <div className="bg-coal-light/50 p-3 rounded-lg border border-alertorange/20">
                        <p className="text-xs text-metal-silver/70">Compareceram</p>
                        <p className="text-2xl font-bold text-alertorange">{stats.attended}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${filter === 'all'
                            ? 'bg-cyan text-coal font-medium'
                            : 'bg-coal-light text-metal-silver hover:bg-coal'
                            }`}
                    >
                        Todos ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('attending')}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${filter === 'attending'
                            ? 'bg-terminalgreen text-coal font-medium'
                            : 'bg-coal-light text-metal-silver hover:bg-coal'
                            }`}
                    >
                        Confirmados ({stats.attending})
                    </button>
                    <button
                        onClick={() => setFilter('maybe')}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${filter === 'maybe'
                            ? 'bg-yellow-400 text-coal font-medium'
                            : 'bg-coal-light text-metal-silver hover:bg-coal'
                            }`}
                    >
                        Talvez ({stats.maybe})
                    </button>
                    <button
                        onClick={() => setFilter('declined')}
                        className={`px-3 py-1.5 rounded text-sm transition-colors ${filter === 'declined'
                            ? 'bg-alertorange text-coal font-medium'
                            : 'bg-coal-light text-metal-silver hover:bg-coal'
                            }`}
                    >
                        Recusaram ({stats.declined})
                    </button>
                </div>

                {/* List */}
                {loading ? (
                    <SkeletonTable columns={4} rows={5} />
                ) : filteredRsvps.length === 0 ? (
                    <div className="text-center py-8 text-metal-silver">
                        Nenhum RSVP encontrado para este filtro.
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-coal-dark z-10">
                                <tr className="border-b border-cyan-glow/20">
                                    <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Usuário</th>
                                    <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Resposta</th>
                                    <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Data RSVP</th>
                                    <th className="text-center py-3 px-4 text-metal-silver/70 font-medium">Compareceu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRsvps.map((rsvp) => (
                                    <tr key={rsvp.id} className="border-b border-cyan-glow/10 hover:bg-coal-light/30">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-cyan/10 border border-cyan/30 rounded">
                                                    <User className="w-4 h-4 text-cyan" />
                                                </div>
                                                <span className="text-metal-silver">ID: {rsvp.user_id.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {getResponseBadge(rsvp.response)}
                                        </td>
                                        <td className="py-3 px-4 text-metal-silver text-sm">
                                            {new Date(rsvp.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={rsvp.attended}
                                                    onChange={(e) => handleMarkAttendance(rsvp.id, e.target.checked)}
                                                    className="w-5 h-5 text-terminalgreen bg-coal border-cyan-glow/30 rounded focus:ring-terminalgreen focus:ring-offset-0"
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Modal>
    )
}
