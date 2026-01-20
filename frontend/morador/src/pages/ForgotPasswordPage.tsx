import { useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import api from '@/services/api'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error('Digite seu email')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Email inválido')
            return
        }

        setIsLoading(true)

        try {
            await api.post('/auth/forgot-password', { email })
            setEmailSent(true)
            toast.success('Se o email existir, você receberá instruções em breve!')
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Erro ao enviar email')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-brass/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-brass/20 rounded-br-3xl" />

            {/* Forgot Password Card */}
            <Card variant="signature" className="w-full max-w-md relative z-10 !p-8">
                {!emailSent ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-brass rounded-2xl flex items-center justify-center shadow-brass">
                                    <Building2 className="w-8 h-8 text-cream" strokeWidth={1.5} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-display font-bold text-ink mb-2">
                                Recuperar Senha
                            </h1>
                            <p className="text-stone">
                                Digite seu email para receber o link de recuperação
                            </p>
                        </div>

                        {/* Decorative line */}
                        <div className="w-12 h-0.5 bg-brass mx-auto mb-8 rounded-full" />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="seu@email.com"
                                required
                                icon={<Mail className="w-5 h-5" strokeWidth={1.5} />}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </Button>

                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="text-brass hover:text-brass-light transition-colors inline-flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                                    Voltar para Login
                                </Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-garden/20 rounded-2xl flex items-center justify-center">
                                <Mail className="w-8 h-8 text-garden" strokeWidth={1.5} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-display font-bold text-ink mb-4">
                            Email Enviado!
                        </h2>
                        <p className="text-stone mb-6">
                            Se o email <strong className="text-ink">{email}</strong> estiver cadastrado,
                            você receberá um link para redefinir sua senha.
                        </p>
                        <p className="text-silver text-sm mb-6">
                            Verifique sua caixa de entrada e spam.
                        </p>
                        <Link to="/login">
                            <Button variant="primary" fullWidth>
                                Voltar para Login
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ForgotPasswordPage
