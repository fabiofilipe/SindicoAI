import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { Button, Input, Card } from '@/components'
import { useAuth } from '@/contexts/AuthContext'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            setError('Email ou senha incorretos')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-coal grid-pattern p-4">
            <Card className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2 text-glow-cyan">
                        SINDICO AI
                    </h1>
                    <p className="text-metal-silver text-lg">Portal do Funcionário</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="email"
                        label="Email"
                        placeholder="seu.email@condominio.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        required
                    />

                    <Input
                        type="password"
                        label="Senha"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        required
                    />

                    {error && (
                        <div className="bg-critical-red/20 border border-critical-red rounded-lg p-3">
                            <p className="text-critical-red text-center">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        ACESSAR SISTEMA
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-metal-silver/70">
                    Funcionário • Acesso Restrito
                </div>
            </Card>
        </div>
    )
}

export default LoginPage
