import { useState } from 'react'
import {
    User,
    Mail,
    Phone,
    Building2,
    MapPin,
    Car,
    Edit3,
    Save,
    X,
    Lock,
    Eye,
    EyeOff,
} from 'lucide-react'
import { MainLayout, HologramCard, Button, Input } from '@/components'

const ProfilePage = () => {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isEditingPassword, setIsEditingPassword] = useState(false)
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    // TODO: Buscar dados do usuário da API
    const [profileData, setProfileData] = useState({
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        apartment: '301',
        building: 'Torre A',
        parking: 'G-15',
    })

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

        // TODO: Integrar com API para salvar perfil
        console.log('Salvando perfil:', profileData)
        setIsEditingProfile(false)
    }

    const handleCancelEditProfile = () => {
        // Reverte alterações não salvas
        setIsEditingProfile(false)
        // TODO: Recarregar dados originais da API
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('As senhas não coincidem!')
            return
        }

        // TODO: Integrar com API para alterar senha
        console.log('Alterando senha')

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
                                    {profileData.name}
                                </h2>
                                <p className="text-metal-silver/60 mb-4">
                                    Apt {profileData.apartment} - {profileData.building}
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

                        {/* Apartment Details */}
                        <HologramCard className="p-6 mt-6">
                            <h3 className="text-lg font-bold text-cyan mb-4">
                                Dados do Imóvel
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-cyan/50" />
                                    <div>
                                        <p className="text-xs text-metal-silver/60">
                                            Torre
                                        </p>
                                        <p className="text-metal-silver">
                                            {profileData.building}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-cyan/50" />
                                    <div>
                                        <p className="text-xs text-metal-silver/60">
                                            Apartamento
                                        </p>
                                        <p className="text-metal-silver">
                                            {profileData.apartment}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-cyan/50" />
                                    <div>
                                        <p className="text-xs text-metal-silver/60">
                                            Vaga de Garagem
                                        </p>
                                        <p className="text-metal-silver">
                                            {profileData.parking}
                                        </p>
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
                                        >
                                            <Save className="w-4 h-4" />
                                            Salvar
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nome */}
                                    <Input
                                        label="Nome Completo"
                                        name="name"
                                        value={profileData.name}
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
                                    <div className="relative">
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

                                    {/* Telefone */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-[52px] transform -translate-y-1/2 z-10">
                                            <Phone className="w-5 h-5 text-cyan/50" />
                                        </div>
                                        <Input
                                            label="Telefone"
                                            name="phone"
                                            type="tel"
                                            value={profileData.phone}
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
