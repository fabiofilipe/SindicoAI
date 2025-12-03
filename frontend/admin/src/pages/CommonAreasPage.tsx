import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Building2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { listCommonAreas, deleteCommonArea } from '../services/commonAreaService'
import type { CommonArea } from '../types/commonArea'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SkeletonTable from '../components/ui/SkeletonTable'
import CommonAreaFormModal from '../components/common-areas/CommonAreaFormModal'
import MainLayout from '../components/layout/MainLayout'

export default function CommonAreasPage() {
    const [areas, setAreas] = useState<CommonArea[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingArea, setEditingArea] = useState<CommonArea | null>(null)
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

    const loadAreas = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await listCommonAreas()
            setAreas(data)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao carregar áreas comuns')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAreas()
    }, [])

    const handleDelete = async (id: string, name: string) => {
        toast.promise(
            deleteCommonArea(id).then(() => loadAreas()),
            {
                loading: 'Deletando área...',
                success: `Área "${name}" deletada com sucesso!`,
                error: (err) => err.response?.data?.detail || 'Erro ao deletar área comum',
            }
        ).catch((err: any) => {
            setError(err.response?.data?.detail || 'Erro ao deletar área comum')
        })
    }

    const handleEdit = (area: CommonArea) => {
        setEditingArea(area)
        setShowCreateModal(true)
    }

    const handleCloseModal = () => {
        setShowCreateModal(false)
        setEditingArea(null)
    }

    const handleSuccess = () => {
        handleCloseModal()
        loadAreas()
    }

    // Stats
    const totalAreas = areas.length
    const activeAreas = areas.filter(a => a.is_active).length
    const inactiveAreas = totalAreas - activeAreas

    // Filtered areas
    const filteredAreas = areas.filter(area => {
        if (filter === 'active') return area.is_active
        if (filter === 'inactive') return !area.is_active
        return true
    })

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-cyan text-glow-cyan">Gestão de Áreas Comuns</h1>
                        <p className="text-metal-silver/80 mt-1">Gerencie os espaços compartilhados do condomínio</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Área
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Total de Áreas</p>
                                    <p className="text-3xl font-bold text-cyan mt-2">{totalAreas}</p>
                                </div>
                                <div className="p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
                                    <Building2 className="w-8 h-8 text-cyan" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Áreas Ativas</p>
                                    <p className="text-3xl font-bold text-terminalgreen mt-2">{activeAreas}</p>
                                </div>
                                <div className="p-3 bg-terminalgreen/10 border border-terminalgreen/30 rounded-lg">
                                    <CheckCircle className="w-8 h-8 text-terminalgreen" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card hover>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-metal-silver/70">Áreas Inativas</p>
                                    <p className="text-3xl font-bold text-alertorange mt-2">{inactiveAreas}</p>
                                </div>
                                <div className="p-3 bg-alertorange/10 border border-alertorange/30 rounded-lg">
                                    <XCircle className="w-8 h-8 text-alertorange" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="p-4 border-b border-cyan-glow/20">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                    ? 'bg-cyan text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Todas ({totalAreas})
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'active'
                                    ? 'bg-terminalgreen text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Ativas ({activeAreas})
                            </button>
                            <button
                                onClick={() => setFilter('inactive')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'inactive'
                                    ? 'bg-alertorange text-coal font-medium'
                                    : 'bg-coal-light text-metal-silver hover:bg-coal'
                                    }`}
                            >
                                Inativas ({inactiveAreas})
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="m-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-cyan mb-4">Áreas Cadastradas</h2>

                        {loading ? (
                            <SkeletonTable columns={5} rows={6} />
                        ) : filteredAreas.length === 0 ? (
                            <div className="text-center py-8 text-metal-silver">
                                {filter === 'all'
                                    ? 'Nenhuma área cadastrada. Clique em "Nova Área" para começar.'
                                    : `Nenhuma área ${filter === 'active' ? 'ativa' : 'inativa'} encontrada.`
                                }
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-cyan-glow/20">
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Nome</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Capacidade</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Horário</th>
                                            <th className="text-left py-3 px-4 text-metal-silver/70 font-medium">Status</th>
                                            <th className="text-right py-3 px-4 text-metal-silver/70 font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAreas.map((area) => (
                                            <tr key={area.id} className="border-b border-cyan-glow/10 hover:bg-coal-light/30">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="text-cyan font-medium">{area.name}</p>
                                                        {area.description && (
                                                            <p className="text-sm text-metal-silver/60 mt-1">{area.description}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-metal-silver">
                                                    {area.capacity || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-metal-silver">
                                                    {area.opening_time && area.closing_time
                                                        ? `${area.opening_time} - ${area.closing_time}`
                                                        : '-'
                                                    }
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${area.is_active
                                                        ? 'bg-terminalgreen/20 text-terminalgreen border border-terminalgreen/30'
                                                        : 'bg-alertorange/20 text-alertorange border border-alertorange/30'
                                                        }`}>
                                                        {area.is_active ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3" />
                                                                Ativa
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3" />
                                                                Inativa
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(area)}
                                                            className="p-2 text-cyan hover:bg-cyan/20 rounded transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(area.id, area.name)}
                                                            className="p-2 text-alertorange hover:bg-alertorange/20 rounded transition-colors"
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
                    <CommonAreaFormModal
                        area={editingArea}
                        onClose={handleCloseModal}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </MainLayout>
    )
}
