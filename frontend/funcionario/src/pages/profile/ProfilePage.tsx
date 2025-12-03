import { useState } from 'react'
import { User, Lock, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card, Input, Button } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { changePassword } from '@/services/userService'

const ProfilePage = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [changingPassword, setChangingPassword] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validations
        if (newPassword.length < 6) {
            toast.error('A nova senha deve ter no mínimo 6 caracteres', {
                icon: '⚠️'
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem', {
                icon: '⚠️'
            })
            return
        }

        try {
            setChangingPassword(true)

            await changePassword({
                current_password: currentPassword,
                new_password: newPassword
            })

            toast.success('Senha alterada com sucesso!', {
                icon: '✅',
                duration: 4000
            })

            // Clear form
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            console.error('Error changing password:', error)

            if (error.response?.status === 401) {
                toast.error('Senha atual incorreta', {
                    icon: '❌'
                })
            } else {
                toast.error('Erro ao alterar senha. Tente novamente.', {
                    icon: '❌'
                })
            }
        } finally {
            setChangingPassword(false)
        }
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
                        disabled={changingPassword}
                    />
                    <Input
                        type="password"
                        label="Nova Senha"
                        value={newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                        required
                        disabled={changingPassword}
                        helperText="Mínimo de 6 caracteres"
                    />
                    <Input
                        type="password"
                        label="Confirmar Nova Senha"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        required
                        disabled={changingPassword}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full"
                        disabled={changingPassword}
                    >
                        {changingPassword ? 'ALTERANDO...' : 'ALTERAR SENHA'}
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
