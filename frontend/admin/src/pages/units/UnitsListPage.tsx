import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Building2, Home, Store, Filter } from 'lucide-react'
import { HologramCard, Input, Select, Button, Badge, Modal } from '@/components'
import { Unit, UnitType } from '@/types/unit.types'

// Mock data (will be replaced with API calls)
const mockUnits: Unit[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        number: '101',
        type: 'apartment',
        area: 85.5,
        floor: '1',
        block: 'A',
        status: 'occupied',
        residents_count: 3,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        number: '102',
        type: 'apartment',
        area: 92.0,
        floor: '1',
        block: 'A',
        status: 'vacant',
        residents_count: 0,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '3',
        tenant_id: 'tenant1',
        number: '201',
        type: 'apartment',
        area: 105.0,
        floor: '2',
        block: 'A',
        status: 'occupied',
        residents_count: 2,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '4',
        tenant_id: 'tenant1',
        number: 'Loja 1',
        type: 'commercial',
        area: 45.0,
        floor: 'Térreo',
        block: 'A',
        status: 'occupied',
        residents_count: 0,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
]

const unitTypeLabels: Record<UnitType, string> = {
    apartment: 'Apartamento',
    house: 'Casa',
    commercial: 'Comercial',
}

const unitTypeIcons: Record<UnitType, any> = {
    apartment: Building2,
    house: Home,
    commercial: Store,
}

const UnitsListPage = () => {
    const [units] = useState<Unit[]>(mockUnits)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [showCreateModal, setShowCreateModal] = useState(false)

    const filteredUnits = units.filter((unit) => {
        const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'all' || unit.type === filterType
        const matchesStatus = filterStatus === 'all' || unit.status === filterStatus
        return matchesSearch && matchesType && matchesStatus
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">Unidades</h1>
                    <p className="text-metal-silver">Gerencie todas as unidades do condomínio</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-glow flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nova Unidade
                </Button>
            </div>

            {/* Filters Bar */}
            <HologramCard className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan" />
                            <Input
                                type="text"
                                placeholder="Buscar por número..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Type Filter */}
                    <Select
                        options={[
                            { label: 'Todos os Tipos', value: 'all' },
                            { label: 'Apartamento', value: 'apartment' },
                            { label: 'Casa', value: 'house' },
                            { label: 'Comercial', value: 'commercial' },
                        ]}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    />

                    {/* Status Filter */}
                    <Select
                        options={[
                            { label: 'Todos Status', value: 'all' },
                            { label: 'Ocupada', value: 'occupied' },
                            { label: 'Vaga', value: 'vacant' },
                        ]}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    />
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-cyan-glow/30 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-metal-silver/60">Total:</span>
                        <span className="font-mono text-cyan font-bold">{filteredUnits.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-metal-silver/60">Ocupadas:</span>
                        <span className="font-mono text-terminalgreen font-bold">
                            {filteredUnits.filter((u) => u.status === 'occupied').length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-metal-silver/60">Vagas:</span>
                        <span className="font-mono text-alertorange font-bold">
                            {filteredUnits.filter((u) => u.status === 'vacant').length}
                        </span>
                    </div>
                </div>
            </HologramCard>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUnits.map((unit, index) => {
                    const Icon = unitTypeIcons[unit.type]
                    return (
                        <motion.div
                            key={unit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <HologramCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan-glow/30 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-cyan" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-cyan font-mono">
                                                {unit.number}
                                            </h3>
                                            <p className="text-xs text-metal-silver/60">
                                                {unitTypeLabels[unit.type]}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge
                                        variant={unit.status === 'occupied' ? 'success' : 'warning'}
                                        className="text-xs"
                                    >
                                        {unit.status === 'occupied' ? 'Ocupada' : 'Vaga'}
                                    </Badge>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-metal-silver/60">Área:</span>
                                        <span className="text-metal-silver font-mono">{unit.area}m²</span>
                                    </div>
                                    {unit.floor && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-metal-silver/60">Andar:</span>
                                            <span className="text-metal-silver font-mono">{unit.floor}</span>
                                        </div>
                                    )}
                                    {unit.block && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-metal-silver/60">Bloco:</span>
                                            <span className="text-metal-silver font-mono">{unit.block}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-metal-silver/60">Moradores:</span>
                                        <span className="text-cyan font-mono font-bold">
                                            {unit.residents_count}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-cyan-glow/30 flex items-center gap-2">
                                    <button className="flex-1 py-2 px-3 bg-cyan/10 hover:bg-cyan/20 border border-cyan-glow/30 rounded-lg text-cyan text-sm transition-all">
                                        Ver Detalhes
                                    </button>
                                    <button className="p-2 bg-coal-light hover:bg-coal border border-cyan-glow/30 rounded-lg text-metal-silver hover:text-cyan transition-all">
                                        <Filter className="w-4 h-4" />
                                    </button>
                                </div>
                            </HologramCard>
                        </motion.div>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredUnits.length === 0 && (
                <HologramCard className="p-12 text-center">
                    <Building2 className="w-16 h-16 text-cyan/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-metal-silver mb-2">Nenhuma unidade encontrada</h3>
                    <p className="text-metal-silver/60">
                        Ajuste os filtros ou crie uma nova unidade
                    </p>
                </HologramCard>
            )}

            {/* Create Modal (placeholder) */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nova Unidade"
                size="lg"
            >
                <div className="space-y-4">
                    <p className="text-metal-silver">Formulário de criação será implementado em breve...</p>
                    <Button onClick={() => setShowCreateModal(false)} className="btn-glow w-full">
                        Fechar
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default UnitsListPage
