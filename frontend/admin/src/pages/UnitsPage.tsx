import { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, Edit2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { listUnits, deleteUnit } from '../services/unitService'
import type { Unit } from '../types/unit'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import UnitFormModal from '../components/units/UnitFormModal'
import CSVUploadModal from '../components/units/CSVUploadModal'
import MainLayout from '../components/layout/MainLayout'

export default function UnitsPage() {
    const [units, setUnits] = useState<Unit[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

    const loadUnits = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await listUnits()
            setUnits(data)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao carregar unidades')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUnits()
    }, [])

    const handleDelete = async (id: string) => {
        toast.promise(
            deleteUnit(id).then(() => loadUnits()),
            {
                loading: 'Deletando unidade...',
                success: 'Unidade deletada com sucesso!',
                error: (err) => err.response?.data?.detail || 'Erro ao deletar unidade',
            }
        ).catch((err: any) => {
            setError(err.response?.data?.detail || 'Erro ao deletar unidade')
        })
    }

    const handleEdit = (unit: Unit) => {
        setEditingUnit(unit)
        setShowCreateModal(true)
    }

    const handleCloseModal = () => {
        setShowCreateModal(false)
        setEditingUnit(null)
    }

    const handleSuccess = () => {
        handleCloseModal()
        loadUnits()
    }

    // Stats
    const totalUnits = units.length
    const occupiedUnits = 0 // TODO: Add logic when we have residents count
    const vacantUnits = totalUnits - occupiedUnits

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan text-glow-cyan">Gestão de Unidades</h1>
                        <p className="text-metal-silver/80 mt-1">Gerencie os apartamentos do condomínio</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar CSV
                        </Button>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Unidade
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Total de Unidades</p>
                                    <p className="text-3xl font-bold text-purple-400 mt-2">{totalUnits}</p>
                                </div>
                                <div className="p-3 bg-purple-500/20 rounded-lg">
                                    <Users className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Unidades Ocupadas</p>
                                    <p className="text-3xl font-bold text-green-400 mt-2">{occupiedUnits}</p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <Users className="w-8 h-8 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Unidades Vazias</p>
                                    <p className="text-3xl font-bold text-gray-400 mt-2">{vacantUnits}</p>
                                </div>
                                <div className="p-3 bg-gray-500/20 rounded-lg">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Units Table */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Unidades Cadastradas</h2>

                        {loading ? (
                            <div className="text-center py-8 text-gray-400">Carregando...</div>
                        ) : units.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                Nenhuma unidade cadastrada. Clique em "Nova Unidade" para começar.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Número</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Torre/Bloco</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Andar</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Tipo</th>
                                            <th className="text-right py-3 px-4 text-gray-400 font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {units.map((unit) => (
                                            <tr key={unit.id} className="border-b border-gray-700/50 hover:bg-gray-800/30">
                                                <td className="py-3 px-4 text-white font-medium">{unit.number}</td>
                                                <td className="py-3 px-4 text-gray-300">{unit.block || '-'}</td>
                                                <td className="py-3 px-4 text-gray-300">{unit.floor || '-'}</td>
                                                <td className="py-3 px-4 text-gray-300">{unit.type || '-'}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(unit)}
                                                            className="p-2 text-purple-400 hover:bg-purple-500/20 rounded transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(unit.id)}
                                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                            title="Deletar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Create/Edit Modal */}
                {showCreateModal && (
                    <UnitFormModal
                        unit={editingUnit}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                    />
                )}

                {/* CSV Upload Modal */}
                {showUploadModal && (
                    <CSVUploadModal
                        onClose={() => setShowUploadModal(false)}
                        onSuccess={() => {
                            setShowUploadModal(false)
                            loadUnits()
                        }}
                    />
                )}
            </div>
        </MainLayout>
    )
}
