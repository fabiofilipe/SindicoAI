import { X } from 'lucide-react'
import { Card, Button } from '@/components'
import type { CommonArea } from '@/types/models'

interface ReservationFiltersProps {
    dateStart: string
    dateEnd: string
    selectedStatuses: string[]
    selectedAreaId: string
    commonAreas: CommonArea[]
    onDateStartChange: (date: string) => void
    onDateEndChange: (date: string) => void
    onStatusToggle: (status: string) => void
    onAreaChange: (areaId: string) => void
    onClearFilters: () => void
}

const statusOptions = [
    { value: 'confirmed', label: 'CONFIRMADA', color: 'bg-terminal-green/20 border-terminal-green text-terminal-green' },
    { value: 'pending', label: 'PENDENTE', color: 'bg-tech-blue/20 border-tech-blue text-tech-blue' },
    { value: 'cancelled', label: 'CANCELADA', color: 'bg-red-500/20 border-red-500 text-red-500' },
    { value: 'completed', label: 'CONCLUÍDA', color: 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' },
]

const ReservationFilters = ({
    dateStart,
    dateEnd,
    selectedStatuses,
    selectedAreaId,
    commonAreas,
    onDateStartChange,
    onDateEndChange,
    onStatusToggle,
    onAreaChange,
    onClearFilters
}: ReservationFiltersProps) => {
    const hasActiveFilters = dateStart || dateEnd || selectedStatuses.length > 0 || selectedAreaId

    return (
        <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-neon-cyan">FILTROS AVANÇADOS</h3>
                {hasActiveFilters && (
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onClearFilters}
                        className="flex items-center gap-2"
                    >
                        <X size={16} />
                        LIMPAR FILTROS
                    </Button>
                )}
            </div>

            {/* Date Range */}
            <div>
                <label className="text-sm text-metal-silver/70 mb-2 block font-semibold">
                    PERÍODO
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-metal-silver/50 mb-1 block">Data Inicial</label>
                        <input
                            type="date"
                            value={dateStart}
                            onChange={(e) => onDateStartChange(e.target.value)}
                            className="w-full px-4 py-3 bg-coal border-2 border-charcoal rounded-lg text-white focus:border-neon-cyan focus:outline-none font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-metal-silver/50 mb-1 block">Data Final</label>
                        <input
                            type="date"
                            value={dateEnd}
                            onChange={(e) => onDateEndChange(e.target.value)}
                            className="w-full px-4 py-3 bg-coal border-2 border-charcoal rounded-lg text-white focus:border-neon-cyan focus:outline-none font-mono"
                        />
                    </div>
                </div>
            </div>

            {/* Status Filter */}
            <div>
                <label className="text-sm text-metal-silver/70 mb-3 block font-semibold">
                    STATUS
                </label>
                <div className="flex gap-3 flex-wrap">
                    {statusOptions.map(status => {
                        const isSelected = selectedStatuses.includes(status.value)
                        return (
                            <button
                                key={status.value}
                                onClick={() => onStatusToggle(status.value)}
                                className={`px-4 py-2 border-2 rounded-lg text-sm font-bold transition-all ${isSelected
                                    ? status.color
                                    : 'bg-charcoal/50 border-charcoal text-metal-silver hover:border-metal-silver'
                                    }`}
                            >
                                {status.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Area Filter */}
            <div>
                <label className="text-sm text-metal-silver/70 mb-2 block font-semibold">
                    ÁREA COMUM
                </label>
                <select
                    value={selectedAreaId}
                    onChange={(e) => onAreaChange(e.target.value)}
                    className="w-full px-4 py-3 bg-coal border-2 border-charcoal rounded-lg text-white focus:border-neon-cyan focus:outline-none font-mono"
                >
                    <option value="">Todas as áreas</option>
                    {commonAreas.map(area => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </select>
            </div>
        </Card>
    )
}

export default ReservationFilters
