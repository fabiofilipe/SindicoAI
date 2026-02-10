import { useState, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createEvent, updateEvent } from '../../services/eventService'
import type { Event, EventCreate, EventUpdate } from '../../types/event'

interface EventFormModalProps {
    event?: Event | null
    onClose: () => void
    onSuccess: () => void
}

export default function EventFormModal({ event, onClose, onSuccess }: EventFormModalProps) {
    const isEdit = !!event

    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        event_date: event?.event_date ? event.event_date.split('T')[0] : '',
        start_time: event?.start_time ? new Date(event.start_time).toTimeString().slice(0, 5) : '',
        end_time: event?.end_time ? new Date(event.end_time).toTimeString().slice(0, 5) : '',
        location: event?.location || '',
        capacity: event?.capacity?.toString() || ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Combine date and time for start_time and end_time
            const eventDate = new Date(formData.event_date)
            const [startHour, startMinute] = formData.start_time.split(':')
            const [endHour, endMinute] = formData.end_time.split(':')

            const startDateTime = new Date(eventDate)
            startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0)

            const endDateTime = new Date(eventDate)
            endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0)

            const data: EventCreate | EventUpdate = {
                title: formData.title,
                description: formData.description || undefined,
                event_date: eventDate.toISOString(),
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                location: formData.location || undefined,
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined
            }

            if (isEdit) {
                await updateEvent(event.id, data as EventUpdate)
            } else {
                await createEvent(data as EventCreate)
            }

            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || `Erro ao ${isEdit ? 'atualizar' : 'criar'} evento`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isEdit ? 'Editar Evento' : 'Criar Evento'}
            size="md"
        >
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Festa Junina, Reunião de Condomínio"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descrição
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detalhes sobre o evento..."
                        rows={3}
                        className="w-full px-4 py-2 bg-coal border border-cyan-glow/30 rounded-lg text-metal-silver focus:border-cyan focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data do Evento <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Horário Início <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="time"
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Horário Término <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="time"
                            value={formData.end_time}
                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Local
                    </label>
                    <Input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ex: Salão de Festas, Quadra, etc"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Capacidade
                    </label>
                    <Input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Deixe vazio para sem limite"
                        min="0"
                    />
                    <p className="text-xs text-metal-silver/60 mt-1">
                        Número máximo de participantes (opcional)
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
