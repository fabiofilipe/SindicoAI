import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Key, Power, UserCheck, UserX } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import * as userService from '@/services/userService'
import type { UserListItem, CreateUserRequest, UpdateUserRequest } from '@/types/user'
import { format } from 'date-fns'

const UsersPage = () => {
    const [users, setUsers] = useState<UserListItem[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)

    // Form states
    const [createForm, setCreateForm] = useState<CreateUserRequest>({
        email: '',
        password: '',
        full_name: '',
        cpf: '',
        role: 'resident',
        is_active: true,
    })

    const [editForm, setEditForm] = useState<UpdateUserRequest>({})
    const [resetPasswordForm, setResetPasswordForm] = useState({ new_password: '' })

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchTerm, roleFilter])

    const loadUsers = async () => {
        try {
            setIsLoading(true)
            const data = await userService.getUsers()
            setUsers(data)
        } catch (error) {
            console.error('Erro ao carregar usuários:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = users

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.cpf?.includes(searchTerm)
            )
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter((user) => user.role === roleFilter)
        }

        setFilteredUsers(filtered)
    }

    const handleCreateUser = async () => {
        try {
            await userService.createUser(createForm)
            setIsCreateModalOpen(false)
            setCreateForm({
                email: '',
                password: '',
                full_name: '',
                cpf: '',
                role: 'resident',
                is_active: true,
            })
            loadUsers()
        } catch (error) {
            console.error('Erro ao criar usuário:', error)
            alert('Erro ao criar usuário. Verifique os dados e tente novamente.')
        }
    }

    const handleEditUser = async () => {
        if (!selectedUser) return

        try {
            await userService.updateUser(selectedUser.id, editForm)
            setIsEditModalOpen(false)
            setSelectedUser(null)
            setEditForm({})
            loadUsers()
        } catch (error) {
            console.error('Erro ao editar usuário:', error)
            alert('Erro ao editar usuário.')
        }
    }

    const handleResetPassword = async () => {
        if (!selectedUser) return

        try {
            await userService.resetUserPassword(selectedUser.id, resetPasswordForm)
            setIsResetPasswordModalOpen(false)
            setSelectedUser(null)
            setResetPasswordForm({ new_password: '' })
            alert('Senha redefinida com sucesso!')
        } catch (error) {
            console.error('Erro ao redefinir senha:', error)
            alert('Erro ao redefinir senha.')
        }
    }

    const handleToggleStatus = async (user: UserListItem) => {
        if (!confirm(`Deseja ${user.is_active ? 'desativar' : 'ativar'} o usuário ${user.email}?`)) {
            return
        }

        try {
            await userService.toggleUserStatus(user.id, !user.is_active)
            loadUsers()
        } catch (error) {
            console.error('Erro ao alterar status:', error)
            alert('Erro ao alterar status do usuário.')
        }
    }

    const openEditModal = (user: UserListItem) => {
        setSelectedUser(user)
        setEditForm({
            email: user.email,
            full_name: user.full_name,
            cpf: user.cpf,
            role: user.role,
            is_active: user.is_active,
        })
        setIsEditModalOpen(true)
    }

    const openResetPasswordModal = (user: UserListItem) => {
        setSelectedUser(user)
        setResetPasswordForm({ new_password: '' })
        setIsResetPasswordModalOpen(true)
    }

    const getRoleBadge = (role: string) => {
        const colors = {
            admin: 'bg-alertorange/20 text-alertorange border-alertorange/30',
            resident: 'bg-techblue/20 text-techblue border-techblue/30',
            staff: 'bg-purple/20 text-purple border-purple/30',
        }

        const labels = {
            admin: 'Admin',
            resident: 'Morador',
            staff: 'Funcionário',
        }

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[role as keyof typeof colors]}`}>
                {labels[role as keyof typeof labels]}
            </span>
        )
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                            Gestão de Usuários
                        </h1>
                        <p className="text-metal-silver/80">
                            Gerenciar usuários, permissões e acessos
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                        Novo Usuário
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan/50" />
                        <Input
                            placeholder="Buscar por email, nome ou CPF..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        options={[
                            { value: 'all', label: 'Todos os tipos' },
                            { value: 'admin', label: 'Administradores' },
                            { value: 'resident', label: 'Moradores' },
                            { value: 'staff', label: 'Funcionários' },
                        ]}
                        className="w-64"
                    />
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="text-center py-12 text-metal-silver">Carregando...</div>
                ) : (
                    <div className="bg-coal-light/80 border border-cyan-glow/30 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome / Email</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-metal-silver/60">
                                            Nenhum usuário encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-cyan">
                                                        {user.full_name || 'Sem nome'}
                                                    </p>
                                                    <p className="text-xs text-metal-silver/60">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.cpf || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                {user.is_active ? (
                                                    <span className="flex items-center gap-2 text-terminalgreen">
                                                        <UserCheck className="w-4 h-4" />
                                                        Ativo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-criticalred">
                                                        <UserX className="w-4 h-4" />
                                                        Inativo
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(user.created_at), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 hover:bg-coal rounded-lg text-techblue hover:text-cyan transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openResetPasswordModal(user)}
                                                        className="p-2 hover:bg-coal rounded-lg text-purple hover:text-cyan transition-colors"
                                                        title="Redefinir senha"
                                                    >
                                                        <Key className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={`p-2 hover:bg-coal rounded-lg transition-colors ${
                                                            user.is_active ? 'text-alertorange' : 'text-terminalgreen'
                                                        }`}
                                                        title={user.is_active ? 'Desativar' : 'Ativar'}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Create User Modal */}
                <Modal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Criar Novo Usuário"
                    size="md"
                >
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            required
                            value={createForm.email}
                            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        />
                        <Input
                            label="Senha"
                            type="password"
                            required
                            value={createForm.password}
                            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                        />
                        <Input
                            label="Nome Completo"
                            value={createForm.full_name}
                            onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                        />
                        <Input
                            label="CPF"
                            value={createForm.cpf}
                            onChange={(e) => setCreateForm({ ...createForm, cpf: e.target.value })}
                        />
                        <Select
                            label="Tipo de Usuário"
                            required
                            value={createForm.role}
                            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                            options={[
                                { value: 'resident', label: 'Morador' },
                                { value: 'staff', label: 'Funcionário' },
                                { value: 'admin', label: 'Administrador' },
                            ]}
                        />
                        <div className="flex gap-4 mt-6">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleCreateUser}
                            >
                                Criar Usuário
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Edit User Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Editar Usuário"
                    size="md"
                >
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                        <Input
                            label="Nome Completo"
                            value={editForm.full_name || ''}
                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                        />
                        <Input
                            label="CPF"
                            value={editForm.cpf || ''}
                            onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                        />
                        <Select
                            label="Tipo de Usuário"
                            value={editForm.role || 'resident'}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                            options={[
                                { value: 'resident', label: 'Morador' },
                                { value: 'staff', label: 'Funcionário' },
                                { value: 'admin', label: 'Administrador' },
                            ]}
                        />
                        <div className="flex gap-4 mt-6">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleEditUser}
                            >
                                Salvar Alterações
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Reset Password Modal */}
                <Modal
                    isOpen={isResetPasswordModalOpen}
                    onClose={() => setIsResetPasswordModalOpen(false)}
                    title="Redefinir Senha"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-metal-silver/80">
                            Redefinir senha para: <strong className="text-cyan">{selectedUser?.email}</strong>
                        </p>
                        <Input
                            label="Nova Senha"
                            type="password"
                            required
                            value={resetPasswordForm.new_password}
                            onChange={(e) => setResetPasswordForm({ new_password: e.target.value })}
                            helperText="Mínimo de 6 caracteres"
                        />
                        <div className="flex gap-4 mt-6">
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setIsResetPasswordModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={handleResetPassword}
                            >
                                Redefinir Senha
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </MainLayout>
    )
}

export default UsersPage
