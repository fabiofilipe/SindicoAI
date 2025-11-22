import { useState, useEffect } from 'react'
import {
    User,
    Mail,
    Building2,
    Edit3,
    Save,
    X,
    Lock,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react'
import { MainLayout, HologramCard, Button, Input } from '@/components'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/services/authService'

const ProfilePage = () => {
    const { user, refreshUser } = useAuth()
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    // Carregar dados do usuário do contexto
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        cpf: user?.cpf || '',
    })

    // Atualizar quando user mudar
    useEffect(() => {
        if (user) {
            setProfileData({
                full_name: user.full_name || '',
                email: user.email || '',
                cpf: user.cpf || '',
            })
        }
    }, [user])

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfileData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user?.id) return

        try {
            setIsLoading(true)
            setError(null)
            setSuccess(null)

            // Atualizar perfil via API
            await updateUserProfile(user.id, {
                full_name: profileData.full_name,
                email: profileData.email,
                cpf: profileData.cpf,
            })

            // Atualizar o contexto com os novos dados
            await refreshUser()

            setSuccess('Perfil atualizado com sucesso!')
            setIsEditingProfile(false)

            // Limpar mensagem de sucesso após 3s
            setTimeout(() => setSuccess(null), 3000)
        } catch (err: any) {
            console.error('Erro ao salvar perfil:', err)
            setError(err.response?.data?.detail || 'Erro ao atualizar perfil. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelEditProfile = () => {
        // Reverte alterações não salvas
        if (user) {
            setProfileData({
                full_name: user.full_name || '',
                email: user.email || '',
                cpf: user.cpf || '',
            })
        }
        setIsEditingProfile(false)
        setError(null)
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('As senhas não coincidem!')
            return
        }

        // TODO: Backend não tem endpoint de alterar senha ainda
        // Quando tiver, usar: await changePassword({ current: ..., new: ... })
        setError('Funcionalidade de alteração de senha em desenvolvimento.')

        // Limpar formulário
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
        setIsEditingPassword(false)
    }

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    return (
        <MainLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold text-cyan text-glow-cyan mb-2">
                        Meu Perfil
                    </h1>
                    <p className="text-metal-silver">
                        Gerencie suas informações pessoais e configurações
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="p-4 bg-terminalgreen/10 border border-terminalgreen/30 rounded-lg flex items-start gap-3">
                        <div className="text-terminalgreen">{success}</div>
                        <button
                            onClick={() => setSuccess(null)}
                            className="ml-auto text-terminalgreen hover:text-terminalgreen/80"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-criticalred/10 border border-criticalred/30 rounded-lg flex items-start gap-3">
                        <div className="text-criticalred">{error}</div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-criticalred hover:text-criticalred/80"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <HologramCard className="p-6">
                            <div className="text-center">
                                {/* Avatar */}
                                <div className="relative inline-block mb-4">
                                    <div className="w-32 h-32 rounded-full bg-gradient-cyber shadow-glow flex items-center justify-center">
                                        <User className="w-16 h-16 text-coal" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-cyan rounded-full hover:bg-cyan/80 transition-colors shadow-glow">
                                        <Edit3 className="w-4 h-4 text-coal" />
                                    </button>
                                </div>

                                {/* User Info */}
                                <h2 className="text-2xl font-bold text-cyan mb-1">
                                    {user?.full_name || 'Usuário'}
                                </h2>
                                <p className="text-metal-silver/60 mb-4">
                                    {user?.email || 'email@exemplo.com'}
                                </p>

                                {/* Status Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-terminalgreen/20 rounded-full">
                                    <span className="w-2 h-2 bg-terminalgreen rounded-full animate-pulse" />
                                    <span className="text-sm text-terminalgreen font-medium">
                                        Ativo
                                    </span>
                                </div>
                            </div>
                        </HologramCard>

                        {/* Apartment Details - Removido por enquanto, backend não fornece */}
                        <HologramCard className="p-6 mt-6">
                            <h3 className="text-lg font-bold text-cyan mb-4">
                                Informações da Conta
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-cyan/50" />
                                    <div>
                                        <p className="text-xs text-metal-silver/60">Email</p>
                                        <p className="text-metal-silver">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-cyan/50" />
                                    <div>
                                        <p className="text-xs text-metal-silver/60">CPF</p>
                                        <p className="text-metal-silver">{user?.cpf || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-cyan/50" />
                                    <div>
                                        <p className="text-xs text-metal-silver/60">Função</p>
                                        <p className="text-metal-silver capitalize">{user?.role || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </HologramCard>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <HologramCard className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-cyan">
                                    Informações Pessoais
                                </h2>
                                {!isEditingProfile ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditingProfile(true)}
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Editar
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCancelEditProfile}
                                        >
                                            <X className="w-4 h-4" />
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={handleSaveProfile}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Salvar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nome */}
                                    <Input
                                        label="Nome Completo"
                                        name="full_name"
                                        value={profileData.full_name}
                                        onChange={handleProfileChange}
                                        disabled={!isEditingProfile}
                                        required
                                    />

                                    {/* CPF */}
                                    <Input
                                        label="CPF"
                                        name="cpf"
                                        value={profileData.cpf}
                                        onChange={handleProfileChange}
                                        disabled={!isEditingProfile}
                                        required
                                    />

                                    {/* Email */}
                                    <div className="relative md:col-span-2">
                                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                                            <Mail className="w-5 h-5 text-cyan/50" />
                                        </div>
                                        <Input
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            disabled={!isEditingProfile}
                                            className="pl-12"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </HologramCard>

                        {/* Change Password */}
                        <HologramCard className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-cyan">
                                    Alterar Senha
                                </h2>
                                {!isEditingPassword && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditingPassword(true)}
                                    >
                                        <Lock className="w-4 h-4" />
                                        Alterar Senha
                                    </Button>
                                )}
                            </div>

                            {isEditingPassword ? (
                                <form
                                    onSubmit={handleChangePassword}
                                    className="space-y-4"
                                >
                                    {/* Senha Atual */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                                            <Lock className="w-5 h-5 text-cyan/50" />
                                        </div>
                                        <Input
                                            label="Senha Atual"
                                            name="currentPassword"
                                            type={
                                                showPassword.current
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="pl-12 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility('current')
                                            }
                                            className="absolute right-3 top-[52px] transform -translate-y-1/2 text-metal-silver hover:text-cyan transition-colors"
                                        >
                                            {showPassword.current ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Nova Senha */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                                            <Lock className="w-5 h-5 text-cyan/50" />
                                        </div>
                                        <Input
                                            label="Nova Senha"
                                            name="newPassword"
                                            type={
                                                showPassword.new ? 'text' : 'password'
                                            }
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="pl-12 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility('new')
                                            }
                                            className="absolute right-3 top-[52px] transform -translate-y-1/2 text-metal-silver hover:text-cyan transition-colors"
                                        >
                                            {showPassword.new ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Confirmar Nova Senha */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                                            <Lock className="w-5 h-5 text-cyan/50" />
                                        </div>
                                        <Input
                                            label="Confirmar Nova Senha"
                                            name="confirmPassword"
                                            type={
                                                showPassword.confirm
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="pl-12 pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                togglePasswordVisibility('confirm')
                                            }
                                            className="absolute right-3 top-[52px] transform -translate-y-1/2 text-metal-silver hover:text-cyan transition-colors"
                                        >
                                            {showPassword.confirm ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Botões */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            fullWidth
                                            onClick={() => {
                                                setIsEditingPassword(false)
                                                setPasswordData({
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: '',
                                                })
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            fullWidth
                                        >
                                            Alterar Senha
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <p className="text-metal-silver/60 text-center py-4">
                                    Clique em "Alterar Senha" para criar uma nova senha
                                </p>
                            )}
                        </HologramCard>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default ProfilePage
