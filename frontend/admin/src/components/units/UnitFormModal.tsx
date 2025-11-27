import { useState, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createUnit, updateUnit } from '../../services/unitService'
import type { Unit, UnitCreate, UnitUpdate } from '../../types/unit'

interface UnitFormModalProps {
    unit?: Unit | null
    onClose: () => void
    onSuccess: () => void
}

export default function UnitFormModal({ unit, onClose, onSuccess }: UnitFormModalProps) {
    const isEdit = !!unit

    const [formData, setFormData] = useState({
        number: unit?.number || '',
        block: unit?.block || '',
        floor: unit?.floor?.toString() || '',
        type: unit?.type || ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data: UnitCreate | UnitUpdate = {
                number: formData.number,
                block: formData.block || null,
                floor: formData.floor ? parseInt(formData.floor) : null,
                type: formData.type || null
            }

            if (isEdit) {
                await updateUnit(unit.id, data)
            } else {
                await createUnit(data as UnitCreate)
            }

            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || `Erro ao ${isEdit ? 'atualizar' : 'criar'} unidade`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isEdit ? 'Editar Unidade' : 'Nova Unidade'}
            size="sm"
        >
            {/* Error message */}
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Número <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        placeholder="Ex: 101, 1502"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Torre/Bloco
                    </label>
                    <Input
                        type="text"
                        value={formData.block}
                        onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                        placeholder="Ex: A, B, Torre 1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Andar
                    </label>
                    <Input
                        type="number"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        placeholder="Ex: 1, 15"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo
                    </label>
                    <Input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        placeholder="Ex: 2-quartos, studio, cobertura"
                    />
                </div>

                {/* Actions */}
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
