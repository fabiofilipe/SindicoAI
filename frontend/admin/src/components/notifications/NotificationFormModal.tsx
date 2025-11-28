import { useState, useEffect, type FormEvent } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { createNotification } from '../../services/notificationService'
import { getUsers } from '../../services/userService'
import { listUnits } from '../../services/unitService'
import type { NotificationCreate } from '../../types/notification'
import type { UserListItem } from '../../types/user'
import type { Unit } from '../../types/unit'
import { Users, Building2, Send } from 'lucide-react'

interface NotificationFormModalProps {
    onClose: () => void
    onSuccess: () => void
}

type SendMode = 'all' | 'units' | 'users'

export default function NotificationFormModal({ onClose, onSuccess }: NotificationFormModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
    })
    const [sendMode, setSendMode] = useState<SendMode>('all')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [selectedUnits, setSelectedUnits] = useState<string[]>([])

    const [users, setUsers] = useState<UserListItem[]>([])
    const [units, setUnits] = useState<Unit[]>([])

    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [error, setError] = useState('')

    // Carrega usuários e unidades
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, unitsData] = await Promise.all([
                    getUsers(),
                    listUnits()
                ])
                setUsers(usersData.filter((u: UserListItem) => u.role === 'resident')) // Apenas moradores
                setUnits(unitsData)
            } catch (err) {
                console.error('Erro ao carregar dados:', err)
                setError('Erro ao carregar usuários e unidades')
            } finally {
                setLoadingData(false)
            }
        }

        fetchData()
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data: NotificationCreate = {
                title: formData.title,
                message: formData.message,
                send_to_all: sendMode === 'all',
                user_ids: sendMode === 'users' ? selectedUsers : undefined,
                unit_ids: sendMode === 'units' ? selectedUnits : undefined,
            }

            await createNotification(data)
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao enviar notificação')
        } finally {
            setLoading(false)
        }
    }

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const handleUnitToggle = (unitId: string) => {
        setSelectedUnits(prev =>
            prev.includes(unitId)
                ? prev.filter(id => id !== unitId)
                : [...prev, unitId]
        )
    }

    const getRecipientCount = () => {
        if (sendMode === 'all') return users.length
        if (sendMode === 'users') return selectedUsers.length
        if (sendMode === 'units') {
            // Conta usuários das unidades selecionadas
            return users.filter(u => u.unit_id && selectedUnits.includes(u.unit_id)).length
        }
        return 0
    }

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Enviar Notificação em Massa"
            size="lg"
        >
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título e Mensagem */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Título <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Manutenção na piscina"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mensagem <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Digite a mensagem da notificação..."
                            rows={4}
                            required
                            className="w-full px-4 py-2 bg-coal border border-cyan-glow/30 rounded-lg text-metal-silver focus:border-cyan focus:outline-none"
                        />
                    </div>
                </div>

                {/* Modo de Envio */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Destinatários <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        {/* Enviar para Todos */}
                        <label className="flex items-center gap-3 p-4 bg-coal border border-cyan-glow/30 rounded-lg cursor-pointer hover:border-cyan/50 transition-colors">
                            <input
                                type="radio"
                                name="sendMode"
                                value="all"
                                checked={sendMode === 'all'}
                                onChange={() => setSendMode('all')}
                                className="w-4 h-4 text-cyan"
                            />
                            <Users className="w-5 h-5 text-cyan" />
                            <div className="flex-1">
                                <p className="text-metal-silver font-medium">Todos os moradores</p>
                                <p className="text-sm text-metal-silver/60">
                                    Enviar para {users.length} morador(es)
                                </p>
                            </div>
                        </label>

                        {/* Enviar para Unidades Específicas */}
                        <label className="flex items-center gap-3 p-4 bg-coal border border-cyan-glow/30 rounded-lg cursor-pointer hover:border-cyan/50 transition-colors">
                            <input
                                type="radio"
                                name="sendMode"
                                value="units"
                                checked={sendMode === 'units'}
                                onChange={() => setSendMode('units')}
                                className="w-4 h-4 text-cyan"
                            />
                            <Building2 className="w-5 h-5 text-cyan" />
                            <div className="flex-1">
                                <p className="text-metal-silver font-medium">Unidades específicas</p>
                                <p className="text-sm text-metal-silver/60">
                                    Selecionar apartamentos/casas
                                </p>
                            </div>
                        </label>

                        {/* Enviar para Usuários Específicos */}
                        <label className="flex items-center gap-3 p-4 bg-coal border border-cyan-glow/30 rounded-lg cursor-pointer hover:border-cyan/50 transition-colors">
                            <input
                                type="radio"
                                name="sendMode"
                                value="users"
                                checked={sendMode === 'users'}
                                onChange={() => setSendMode('users')}
                                className="w-4 h-4 text-cyan"
                            />
                            <Users className="w-5 h-5 text-cyan" />
                            <div className="flex-1">
                                <p className="text-metal-silver font-medium">Usuários específicos</p>
                                <p className="text-sm text-metal-silver/60">
                                    Selecionar moradores individualmente
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Lista de Unidades (se selecionado) */}
                {sendMode === 'units' && (
                    <div className="bg-coal border border-cyan-glow/30 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-300 mb-3">
                            Selecione as unidades ({selectedUnits.length} selecionada(s))
                        </p>
                        {loadingData ? (
                            <p className="text-metal-silver/60 text-sm">Carregando unidades...</p>
                        ) : (
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {units.map(unit => (
                                    <label
                                        key={unit.id}
                                        className="flex items-center gap-2 p-2 hover:bg-coal-light rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUnits.includes(unit.id)}
                                            onChange={() => handleUnitToggle(unit.id)}
                                            className="w-4 h-4 text-cyan bg-coal border-cyan-glow/30 rounded"
                                        />
                                        <span className="text-sm text-metal-silver">
                                            {unit.block ? `${unit.block} - ` : ''}Apto {unit.number}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de Usuários (se selecionado) */}
                {sendMode === 'users' && (
                    <div className="bg-coal border border-cyan-glow/30 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-300 mb-3">
                            Selecione os moradores ({selectedUsers.length} selecionado(s))
                        </p>
                        {loadingData ? (
                            <p className="text-metal-silver/60 text-sm">Carregando usuários...</p>
                        ) : (
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {users.map(user => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-2 p-2 hover:bg-coal-light rounded cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleUserToggle(user.id)}
                                            className="w-4 h-4 text-cyan bg-coal border-cyan-glow/30 rounded"
                                        />
                                        <span className="text-sm text-metal-silver">
                                            {user.full_name || user.email}
                                            {user.unit_id && (
                                                <span className="text-metal-silver/60 ml-2">
                                                    (Unidade: {units.find(u => u.id === user.unit_id)?.number})
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Resumo */}
                <div className="bg-cyan/10 border border-cyan/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-cyan">
                        <Send className="w-5 h-5" />
                        <span className="font-medium">
                            Esta notificação será enviada para {getRecipientCount()} pessoa(s)
                        </span>
                    </div>
                </div>

                {/* Botões */}
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
                        disabled={loading || getRecipientCount() === 0}
                    >
                        {loading ? 'Enviando...' : 'Enviar Notificação'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
