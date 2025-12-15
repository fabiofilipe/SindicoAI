import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import api from '@/services/api'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error('Token inválido ou ausente')
            navigate('/login')
        }
    }, [token, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!password) {
            toast.error('Digite uma nova senha')
            return
        }

        if (password.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres')
            return
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem')
            return
        }

        setIsLoading(true)

        try {
            await api.post('/auth/reset-password', {
                token,
                new_password: password,
            })

            toast.success('Senha redefinida com sucesso!')
            navigate('/login')
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || 'Erro ao redefinir senha. Token pode estar expirado.'
            toast.error(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coal via-coal-light to-coal p-4">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-tech-grid opacity-30" />

            {/* Glowing Orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple/20 rounded-full blur-3xl animate-pulse-glow delay-1000" />

            {/* Reset Password Card */}
            <Card className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-cyber rounded-2xl shadow-glow">
                            <Lock className="w-12 h-12 text-coal" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-gradient-cyber">
                        Redefinir Senha
                    </h1>
                    <p className="text-gray-400">
                        Digite sua nova senha abaixo
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="Nova Senha"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[42px] text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirmar Nova Senha"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            icon={<Lock className="w-5 h-5 text-gray-400" />}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-[42px] text-gray-400 hover:text-white transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </Button>
                </form>
            </Card>
        </div>
    )
}

export default ResetPasswordPage
