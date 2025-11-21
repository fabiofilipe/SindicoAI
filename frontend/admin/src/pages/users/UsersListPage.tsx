import { useState } from 'react'
import { Search, UserPlus, Shield, User as UserIcon, Briefcase, Power, KeyRound, Eye } from 'lucide-react'
import { HologramCard, Input, Select, Table, Avatar, StatusBadge, Button } from '@/components'
import { User, UserRole } from '@/types/user.types'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'

// Mock data (will be replaced with API calls)
const mockUsers: User[] = [
    {
        id: '1',
        email: 'admin@sindicoai.com',
        full_name: 'Admin Sistema',
        role: 'admin',
        tenant_id: 'tenant1',
        is_active: true,
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
    },
    {
        id: '2',
        email: 'joao.silva@email.com',
        full_name: 'João Silva',
        role: 'resident',
        tenant_id: 'tenant1',
        is_active: true,
        cpf: '234.567.890-11',
        phone: '(11) 91234-5678',
        unit_id: '101',
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
    },
    {
        id: '3',
        email: 'maria.santos@email.com',
        full_name: 'Maria Santos',
        role: 'resident',
        tenant_id: 'tenant1',
        is_active: false,
        cpf: '345.678.901-22',
        phone: '(11) 99876-5432',
        unit_id: '102',
        created_at: '2024-02-01',
        updated_at: '2024-02-01',
    },
    {
        id: '4',
        email: 'carlos.porteiro@sindicoai.com',
        full_name: 'Carlos Porteiro',
        role: 'employee',
        tenant_id: 'tenant1',
        is_active: true,
        cpf: '456.789.012-33',
        phone: '(11) 97654-3210',
        created_at: '2024-01-10',
        updated_at: '2024-01-10',
    },
]

const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    resident: 'Morador',
    employee: 'Funcionário',
}

const roleIcons: Record<UserRole, any> = {
    admin: Shield,
    resident: UserIcon,
    employee: Briefcase,
}

const UsersListPage = () => {
    const [users] = useState<User[]>(mockUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const { toast, hideToast, success, error } = useToast()

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'all' || user.role === filterRole
        const matchesStatus = filterStatus === 'all' || String(user.is_active) === filterStatus
        return matchesSearch && matchesRole && matchesStatus
    })

    const handleActivate = async (_userId: string, userName: string) => {
        try {
            // await usersService.activate(userId)
            success(`Usuário ${userName} ativado com sucesso!`)
        } catch {
            error('Erro ao ativar usuário')
        }
    }

    const handleDeactivate = async (_userId: string, userName: string) => {
        try {
            // await usersService.deactivate(userId)
            success(`Usuário ${userName} desativado com sucesso!`)
        } catch {
            error('Erro ao desativar usuário')
        }
    }

    const handleResetPassword = async (_userId: string, _userName: string) => {
        try {
            // const result = await usersService.resetPassword(userId)
            success(`Senha resetada! Nova senha temporária: TEMP123`)
        } catch {
            error('Erro ao resetar senha')
        }
    }

    const columns = [
        {
            key: 'user',
            label: 'Usuário',
            sortable: true,
            render: (_: any, user: User) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        fallbackText={user.full_name}
                        status={user.is_active ? 'online' : 'offline'}
                        size="md"
                        borderGlow
                    />
                    <div>
                        <p className="font-medium text-metal-silver">{user.full_name}</p>
                        <p className="text-xs text-metal-silver/60">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'cpf',
            label: 'CPF',
            render: (cpf: string) => (
                <span className="font-mono text-sm text-metal-silver">{cpf || '-'}</span>
            ),
        },
        {
            key: 'unit_id',
            label: 'Unidade',
            render: (unit_id: string) => (
                <span className="font-mono text-cyan">{unit_id || '-'}</span>
            ),
        },
        {
            key: 'role',
            label: 'Função',
            sortable: true,
            render: (role: UserRole) => {
                const Icon = roleIcons[role]
                const colors = {
                    admin: 'text-criticalred',
                    resident: 'text-cyan',
                    employee: 'text-alertorange',
                }
                return (
                    <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colors[role]}`} />
                        <span className="text-sm">{roleLabels[role]}</span>
                    </div>
                )
            },
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (is_active: boolean) => (
                <StatusBadge status={is_active ? 'active' : 'inactive'} size="sm" />
            ),
        },
        {
            key: 'actions',
            label: 'Ações',
            render: (_: any, user: User) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => console.log('Ver detalhes', user.id)}
                        className="p-2 bg-cyan/10 hover:bg-cyan/20 border border-cyan-glow/30 rounded-lg text-cyan transition-all"
                        title="Ver detalhes"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() =>
                            user.is_active
                                ? handleDeactivate(user.id, user.full_name)
                                : handleActivate(user.id, user.full_name)
                        }
                        className={`p-2 border rounded-lg transition-all ${
                            user.is_active
                                ? 'bg-criticalred/10 hover:bg-criticalred/20 border-criticalred/30 text-criticalred'
                                : 'bg-terminalgreen/10 hover:bg-terminalgreen/20 border-terminalgreen/30 text-terminalgreen'
                        }`}
                        title={user.is_active ? 'Desativar' : 'Ativar'}
                    >
                        <Power className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleResetPassword(user.id, user.full_name)}
                        className="p-2 bg-alertorange/10 hover:bg-alertorange/20 border border-alertorange/30 rounded-lg text-alertorange transition-all"
                        title="Resetar senha"
                    >
                        <KeyRound className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">Usuários</h1>
                    <p className="text-metal-silver">Gerencie todos os usuários do sistema</p>
                </div>
                <Button className="btn-glow flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Novo Usuário
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
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <Select
                        options={[
                            { label: 'Todas Funções', value: 'all' },
                            { label: 'Admin', value: 'admin' },
                            { label: 'Morador', value: 'resident' },
                            { label: 'Funcionário', value: 'employee' },
                        ]}
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    />

                    {/* Status Filter */}
                    <Select
                        options={[
                            { label: 'Todos Status', value: 'all' },
                            { label: 'Ativos', value: 'true' },
                            { label: 'Inativos', value: 'false' },
                        ]}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    />
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-cyan-glow/30 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-metal-silver/60">Total:</span>
                        <span className="font-mono text-cyan font-bold">{filteredUsers.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-metal-silver/60">Ativos:</span>
                        <span className="font-mono text-terminalgreen font-bold">
                            {filteredUsers.filter((u) => u.is_active).length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-metal-silver/60">Inativos:</span>
                        <span className="font-mono text-criticalred font-bold">
                            {filteredUsers.filter((u) => !u.is_active).length}
                        </span>
                    </div>
                </div>
            </HologramCard>

            {/* Users Table */}
            <HologramCard>
                <Table
                    columns={columns}
                    data={filteredUsers}
                    variant="tech"
                    sortable
                    emptyMessage="Nenhum usuário encontrado"
                />
            </HologramCard>

            {/* Toast Notifications */}
            <Toast
                message={toast.message}
                variant={toast.variant}
                isVisible={toast.isVisible}
                onClose={hideToast}
                position="top-right"
            />
        </div>
    )
}

export default UsersListPage
