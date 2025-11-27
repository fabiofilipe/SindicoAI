import { useState, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createCommonArea, updateCommonArea } from '../../services/commonAreaService'
import type { CommonArea, CommonAreaCreate, CommonAreaUpdate } from '../../types/commonArea'

interface CommonAreaFormModalProps {
    area?: CommonArea | null
    onClose: () => void
    onSuccess: () => void
}

export default function CommonAreaFormModal({ area, onClose, onSuccess }: CommonAreaFormModalProps) {
    const isEdit = !!area

    const [formData, setFormData] = useState({
        name: area?.name || '',
        description: area?.description || '',
        capacity: area?.capacity?.toString() || '',
        opening_time: area?.opening_time || '',
        closing_time: area?.closing_time || '',
        is_active: area?.is_active ?? true
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data: CommonAreaCreate | CommonAreaUpdate = {
                name: formData.name,
                description: formData.description || null,
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                opening_time: formData.opening_time || null,
                closing_time: formData.closing_time || null,
                is_active: formData.is_active
            }

            if (isEdit) {
                await updateCommonArea(area.id, data)
            } else {
                await createCommonArea(data as CommonAreaCreate)
            }

            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || `Erro ao ${isEdit ? 'atualizar' : 'criar'} área comum`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isEdit ? 'Editar Área Comum' : 'Nova Área Comum'}
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
                        Nome <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Salão de Festas, Churrasqueira 1"
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
                        placeholder="Breve descrição da área..."
                        rows={3}
                        className="w-full px-4 py-2 bg-coal border border-cyan-glow/30 rounded-lg text-metal-silver focus:border-cyan focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Capacidade
                        </label>
                        <Input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            placeholder="Ex: 50"
                            min="0"
                        />
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-cyan bg-coal border-cyan-glow/30 rounded focus:ring-cyan"
                            />
                            <span className="text-sm text-metal-silver">Área ativa</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Horário Abertura
                        </label>
                        <Input
                            type="time"
                            value={formData.opening_time}
                            onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Horário Fechamento
                        </label>
                        <Input
                            type="time"
                            value={formData.closing_time}
                            onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                        />
                    </div>
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
