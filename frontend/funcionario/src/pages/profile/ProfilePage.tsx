import { useState } from 'react'
import { User, Lock, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Input, Button } from '@/components'
import { useAuth } from '@/contexts/AuthContext'

const ProfilePage = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement password change
        alert('Alteração de senha em desenvolvimento')
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="p-6 space-y-6 pb-24">
            <h1 className="text-4xl font-bold mb-6">MEU PERFIL</h1>

            {/* User Info */}
            <Card>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                            <User size={48} className="text-neon-cyan" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{user?.full_name}</h2>
                            <p className="text-metal-silver">{user?.role?.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="text-metal-silver/70 text-sm">Email</label>
                            <p className="text-xl font-semibold">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-metal-silver/70 text-sm">CPF</label>
                            <p className="text-xl font-semibold">{user?.cpf || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Change Password */}
            <Card>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Lock className="text-neon-cyan" />
                    Alterar Senha
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input
                        type="password"
                        label="Senha Atual"
                        value={currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        label="Nova Senha"
                        value={newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        label="Confirmar Nova Senha"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary" size="md" className="w-full">
                        Alterar Senha
                    </Button>
                </form>
            </Card>

            {/* Logout */}
            <Button
                variant="danger"
                size="lg"
                onClick={handleLogout}
                className="w-full"
            >
                <LogOut size={24} />
                SAIR DO SISTEMA
            </Button>
        </div>
    )
}

export default ProfilePage
