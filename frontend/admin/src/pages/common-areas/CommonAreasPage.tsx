import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin, Users, Clock, Edit2, Trash2 } from 'lucide-react'
import { HologramCard, Button, Modal, Input, Textarea, StatusBadge } from '@/components'
import { CommonArea } from '@/types/area.types'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Mock data
const mockAreas: CommonArea[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        name: 'Piscina',
        description: 'Piscina aquecida com vestiário',
        capacity: 20,
        available_hours_start: '08:00',
        available_hours_end: '22:00',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        name: 'Salão de Festas',
        description: 'Salão completo com cozinha e churrasqueira',
        capacity: 50,
        available_hours_start: '10:00',
        available_hours_end: '23:00',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
    },
    {
        id: '3',
        tenant_id: 'tenant1',
        name: 'Academia',
        description: 'Academia com equipamentos modernos',
        capacity: 15,
        available_hours_start: '06:00',
        available_hours_end: '22:00',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
    },
    {
        id: '4',
        tenant_id: 'tenant1',
        name: 'Quadra Poliesportiva',
        description: 'Quadra coberta para esportes diversos',
        capacity: 10,
        available_hours_start: '07:00',
        available_hours_end: '21:00',
        is_active: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
    },
]

const areaSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    description: z.string().optional(),
    capacity: z.number().min(1, 'Capacidade deve ser maior que 0'),
    available_hours_start: z.string().optional(),
    available_hours_end: z.string().optional(),
})

type AreaFormData = z.infer<typeof areaSchema>

const CommonAreasPage = () => {
    const [areas, setAreas] = useState<CommonArea[]>(mockAreas)
    const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null)
    const { isOpen: isCreateOpen, open: openCreate, close: closeCreate } = useModal()
    const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useModal()
    const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal()
    const { toast, hideToast, success, error } = useToast()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AreaFormData>({
        resolver: zodResolver(areaSchema),
    })

    const handleCreate = async (_data: AreaFormData) => {
        try {
            // await areasService.create(data)
            success('Área comum criada com sucesso!')
            closeCreate()
            reset()
        } catch {
            error('Erro ao criar área comum')
        }
    }

    const handleEdit = (area: CommonArea) => {
        setSelectedArea(area)
        reset({
            name: area.name,
            description: area.description,
            capacity: area.capacity,
            available_hours_start: area.available_hours_start,
            available_hours_end: area.available_hours_end,
        })
        openEdit()
    }

    const handleUpdate = async (_data: AreaFormData) => {
        try {
            // await areasService.update(selectedArea!.id, data)
            success('Área comum atualizada com sucesso!')
            closeEdit()
            reset()
        } catch {
            error('Erro ao atualizar área comum')
        }
    }

    const handleDeleteConfirm = async () => {
        try {
            // await areasService.delete(selectedArea!.id)
            setAreas(areas.filter((a) => a.id !== selectedArea!.id))
            success('Área comum removida com sucesso!')
            closeDelete()
        } catch {
            error('Erro ao remover área comum')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">Áreas Comuns</h1>
                    <p className="text-metal-silver">Gerencie as áreas de uso comum do condomínio</p>
                </div>
                <Button onClick={openCreate} className="btn-glow flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nova Área
                </Button>
            </div>

            {/* Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map((area, index) => (
                    <motion.div
                        key={area.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <HologramCard className="p-6 h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-cyan" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-cyan truncate">{area.name}</h3>
                                        <StatusBadge
                                            status={area.is_active ? 'active' : 'inactive'}
                                            size="sm"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {area.description && (
                                <p className="text-sm text-metal-silver/80 mb-4 line-clamp-2">
                                    {area.description}
                                </p>
                            )}

                            {/* Details */}
                            <div className="space-y-2 mb-4 flex-1">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-cyan" />
                                    <span className="text-metal-silver/60">Capacidade:</span>
                                    <span className="text-metal-silver font-mono font-bold">{area.capacity}</span>
                                </div>
                                {area.available_hours_start && area.available_hours_end && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-cyan" />
                                        <span className="text-metal-silver/60">Horário:</span>
                                        <span className="text-metal-silver font-mono">
                                            {area.available_hours_start} - {area.available_hours_end}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-cyan-glow/30 flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(area)}
                                    className="flex-1 py-2 px-3 bg-cyan/10 hover:bg-cyan/20 border border-cyan-glow/30 rounded-lg text-cyan text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedArea(area)
                                        openDelete()
                                    }}
                                    className="p-2 bg-criticalred/10 hover:bg-criticalred/20 border border-criticalred/30 rounded-lg text-criticalred transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </HologramCard>
                    </motion.div>
                ))}
            </div>

            {/* Create Modal */}
            <Modal isOpen={isCreateOpen} onClose={closeCreate} title="Nova Área Comum" size="lg">
                <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
                    <Input
                        label="Nome"
                        {...register('name')}
                        error={errors.name?.message}
                        placeholder="Ex: Piscina, Salão de Festas..."
                        required
                    />

                    <Textarea
                        label="Descrição"
                        {...register('description')}
                        error={errors.description?.message}
                        placeholder="Descreva a área comum..."
                        rows={3}
                    />

                    <Input
                        label="Capacidade"
                        type="number"
                        {...register('capacity', { valueAsNumber: true })}
                        error={errors.capacity?.message}
                        placeholder="Número máximo de pessoas"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Horário Início"
                            type="time"
                            {...register('available_hours_start')}
                            error={errors.available_hours_start?.message}
                        />
                        <Input
                            label="Horário Fim"
                            type="time"
                            {...register('available_hours_end')}
                            error={errors.available_hours_end?.message}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" onClick={closeCreate} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 btn-glow">
                            Criar Área
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditOpen} onClose={closeEdit} title="Editar Área Comum" size="lg">
                <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                    <Input
                        label="Nome"
                        {...register('name')}
                        error={errors.name?.message}
                        required
                    />

                    <Textarea
                        label="Descrição"
                        {...register('description')}
                        error={errors.description?.message}
                        rows={3}
                    />

                    <Input
                        label="Capacidade"
                        type="number"
                        {...register('capacity', { valueAsNumber: true })}
                        error={errors.capacity?.message}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Horário Início"
                            type="time"
                            {...register('available_hours_start')}
                        />
                        <Input
                            label="Horário Fim"
                            type="time"
                            {...register('available_hours_end')}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" onClick={closeEdit} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 btn-glow">
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDelete} title="Confirmar Exclusão" size="md">
                <div className="space-y-4">
                    <p className="text-metal-silver">
                        Tem certeza que deseja remover a área comum{' '}
                        <span className="text-cyan font-bold">{selectedArea?.name}</span>?
                    </p>
                    <p className="text-sm text-criticalred">
                        Esta ação não pode ser desfeita e todas as reservas associadas serão canceladas.
                    </p>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeDelete} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteConfirm} className="flex-1 bg-gradient-alert">
                            Confirmar Exclusão
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

export default CommonAreasPage
