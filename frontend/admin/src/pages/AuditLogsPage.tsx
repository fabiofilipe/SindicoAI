import { useState, useEffect } from 'react'
import { FileText, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '@/components/layout/MainLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import api from '@/services/api'

interface AuditLog {
    id: string
    user_email: string | null
    action: string
    entity_type: string
    entity_id: string | null
    changes: any
    created_at: string
}

const AuditLogsPage = () => {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState({
        action: '',
        entity_type: '',
    })

    useEffect(() => {
        fetchLogs()
    }, [filter])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter.action) params.append('action', filter.action)
            if (filter.entity_type) params.append('entity_type', filter.entity_type)
            params.append('limit', '100')

            const response = await api.get(`/admin/audit-logs?${params}`)
            setLogs(response.data)
        } catch (error: any) {
            toast.error('Erro ao carregar logs de auditoria')
        } finally {
            setLoading(false)
        }
    }



    const getActionBadge = (action: string) => {
        const colors = {
            CREATE: 'bg-green-500/20 text-green-400 border-green-500/30',
            UPDATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
            LOGIN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        }

        return (
            <span className={`px-2 py-1 rounded border text-xs font-mono ${colors[action as keyof typeof colors] || 'bg-gray-500/20 text-gray-400'}`}>
                {action}
            </span>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR')
    }

    return (
        <MainLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-cyber rounded-xl shadow-glow">
                            <FileText className="w-6 h-6 text-coal" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gradient-cyber">
                                Logs de Auditoria
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Histórico de todas as ações no sistema
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-cyan" />
                        <select
                            value={filter.action}
                            onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                            className="px-4 py-2 bg-coal-light border border-cyan/30 rounded-lg text-white focus:border-cyan focus:outline-none"
                        >
                            <option value="">Todas as ações</option>
                            <option value="CREATE">CREATE</option>
                            <option value="UPDATE">UPDATE</option>
                            <option value="DELETE">DELETE</option>
                            <option value="LOGIN">LOGIN</option>
                        </select>

                        <select
                            value={filter.entity_type}
                            onChange={(e) => setFilter({ ...filter, entity_type: e.target.value })}
                            className="px-4 py-2 bg-coal-light border border-cyan/30 rounded-lg text-white focus:border-cyan focus:outline-none"
                        >
                            <option value="">Todas as entidades</option>
                            <option value="User">Usuário</option>
                            <option value="Reservation">Reserva</option>
                            <option value="CommonArea">Área Comum</option>
                            <option value="Unit">Unidade</option>
                            <option value="Notification">Notificação</option>
                        </select>

                        <Button
                            variant="secondary"
                            onClick={fetchLogs}
                            className="ml-auto"
                        >
                            Atualizar
                        </Button>
                    </div>
                </Card>

                {/* Logs Table */}
                <Card>
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">
                            Carregando logs...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            Nenhum log encontrado
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-cyan/20">
                                        <th className="text-left py-3 px-4 text-cyan font-mono text-sm">Data/Hora</th>
                                        <th className="text-left py-3 px-4 text-cyan font-mono text-sm">Usuário</th>
                                        <th className="text-left py-3 px-4 text-cyan font-mono text-sm">Ação</th>
                                        <th className="text-left py-3 px-4 text-cyan font-mono text-sm">Entidade</th>
                                        <th className="text-left py-3 px-4 text-cyan font-mono text-sm">ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-coal-light hover:bg-coal-light/50 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                                                {formatDate(log.created_at)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-300">
                                                {log.user_email || 'Sistema'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {getActionBadge(log.action)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                                                {log.entity_type}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                                                {log.entity_id?.substring(0, 8) || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                {/* Stats */}
                <div className="text-center text-sm text-gray-500">
                    Total: {logs.length} registros
                </div>
            </div>
        </MainLayout>
    )
}

export default AuditLogsPage
