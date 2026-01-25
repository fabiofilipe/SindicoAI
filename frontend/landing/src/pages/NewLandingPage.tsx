import { motion, useScroll, useTransform } from 'framer-motion'
import { Building2, ArrowRight, Clock, MessageSquare, FileX, Sparkles, Bot, Shield, Users, Briefcase, Calendar, Bell, CheckCircle2, Mail, Menu, X, Sun, Moon, HelpCircle, Plus, Minus } from 'lucide-react'
import ParticlesBackground from '@/components/animations/ParticlesBackground'
import ScrollReveal from '@/components/animations/ScrollReveal'
import { useRef, useState, useEffect } from 'react'

const StorytellingLandingPage = () => {
    const heroRef = useRef(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    // Verificar preferência do sistema ao carregar
    useEffect(() => {
        const saved = localStorage.getItem('darkMode')
        if (saved !== null) {
            setDarkMode(saved === 'true')
        } else {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
    }, [])

    // Salvar preferência
    useEffect(() => {
        localStorage.setItem('darkMode', String(darkMode))
    }, [darkMode])

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.9, 0.7])

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setMobileMenuOpen(false)
    }

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'}`}>
            <ParticlesBackground />

            {/* HEADER CONTEMPORÂNEO - Updated with Login Dropdown */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="mx-4 mt-4">
                    <div className={`max-w-7xl mx-auto px-6 py-3 rounded-full backdrop-blur-xl border shadow-lg transition-colors duration-500 ${darkMode ? 'bg-gray-900/70 border-gray-700/50 shadow-black/20' : 'bg-white/70 border-white/50 shadow-black/5'}`}>
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <a href="/" className="flex items-center gap-2 group">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className={`text-lg font-black tracking-tight transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>SindicoAI</span>
                            </a>

                            {/* Nav Desktop */}
                            <nav className="hidden lg:flex items-center gap-1">
                                <button onClick={() => scrollToSection('destaques')} className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                                    Destaques
                                </button>
                                <button onClick={() => scrollToSection('como-funciona')} className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                                    Como funciona
                                </button>
                                <button onClick={() => scrollToSection('funcionalidades')} className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                                    Funcionalidades
                                </button>
                            </nav>

                            {/* CTA Desktop */}
                            <div className="hidden lg:flex items-center gap-3">
                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`p-2.5 rounded-full transition-all ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    aria-label="Alternar tema"
                                >
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                {/* Login Group */}
                                <div className="relative group">
                                    <button className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'}`}>
                                        Entrar
                                        <Plus className="w-4 h-4 rotate-45" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                        <div className={`p-2 rounded-2xl border shadow-xl backdrop-blur-xl ${darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
                                            <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                Selecione seu portal
                                            </div>
                                            <a href="http://localhost:3002" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                                                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                                    <Shield className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Síndico</div>
                                                </div>
                                            </a>
                                            <a href="http://localhost:3000" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                                                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Morador</div>
                                                </div>
                                            </a>
                                            <a href="http://localhost:3001" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/10 text-gray-200' : 'hover:bg-gray-50 text-gray-700'}`}>
                                                <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                                    <Briefcase className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">Funcionário</div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <motion.a
                                    href="#cta"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow"
                                >
                                    Começar grátis
                                </motion.a>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="lg:hidden flex items-center gap-2">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
                                    aria-label="Alternar tema"
                                >
                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100/50 text-gray-900'}`}
                                >
                                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`lg:hidden mx-4 mt-2 p-6 rounded-3xl backdrop-blur-xl border shadow-xl transition-colors ${darkMode ? 'bg-gray-900/95 border-gray-700/50' : 'bg-white/95 border-white/50'}`}
                    >
                        <nav className="flex flex-col gap-2 mb-6">
                            <button onClick={() => scrollToSection('destaques')} className={`px-4 py-3 text-left font-medium rounded-xl transition-colors ${darkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                                Destaques
                            </button>
                            <button onClick={() => scrollToSection('como-funciona')} className={`px-4 py-3 text-left font-medium rounded-xl transition-colors ${darkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                                Como funciona
                            </button>
                            <button onClick={() => scrollToSection('funcionalidades')} className={`px-4 py-3 text-left font-medium rounded-xl transition-colors ${darkMode ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}`}>
                                Funcionalidades
                            </button>
                        </nav>
                        <div className="flex flex-col gap-2">
                            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Acesse seu portal</p>
                                <div className="space-y-2">
                                    <a href="http://localhost:3002" className={`flex items-center gap-3 p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white'} transition-colors`}>
                                        <Shield className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Síndico</span>
                                    </a>
                                    <a href="http://localhost:3000" className={`flex items-center gap-3 p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white'} transition-colors`}>
                                        <Users className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Morador</span>
                                    </a>
                                    <a href="http://localhost:3001" className={`flex items-center gap-3 p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-white'} transition-colors`}>
                                        <Briefcase className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                                        <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Funcionário</span>
                                    </a>
                                </div>
                            </div>
                            <a href="#cta" className="px-4 py-3 text-center font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg mt-2">
                                Começar grátis
                            </a>
                        </div>
                    </motion.div>
                )}
            </header>

            <section ref={heroRef} className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 py-16 sm:py-20 pt-24 sm:pt-32 overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover scale-105"
                    >
                        <source src="/assets/Video_Generation_Prompt_for_SaaS_Hero.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay for readability - reduced opacity */}
                    <div className={`absolute inset-0 transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-950/70 via-gray-900/60 to-gray-950/70' : 'bg-gradient-to-br from-amber-50/50 via-orange-50/40 to-red-50/50'}`} />
                </div>

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-[1]">
                    <div className={`absolute inset-0 transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-green-900/10 via-blue-900/10 to-purple-900/10' : 'bg-gradient-to-br from-orange-400/10 via-red-400/10 to-amber-400/10'}`} />
                    <div className={`absolute inset-0 ${darkMode ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]' : 'bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]'}`} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border mb-8 transition-colors ${darkMode ? 'bg-gray-800/40 border-gray-600/60' : 'bg-white/40 border-white/60'}`}>
                        <Sparkles className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-orange-600'}`} />
                        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Gestão Condominial Inteligente</span>
                    </motion.div>

                    <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-tight transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Cansado de{' '}
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? 'from-green-400 to-cyan-400' : 'from-orange-600 to-red-600'}`}>planilhas infinitas</span>
                        {' '}e WhatsApp caótico?
                    </h1>

                    <p className={`text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl mx-auto transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Gestão condominial não precisa ser um pesadelo. <strong className={darkMode ? 'text-white' : 'text-gray-900'}> Existe um jeito melhor.</strong>
                    </p>

                    <motion.button whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="group px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base sm:text-lg shadow-2xl hover:shadow-green-500/50 transition-all inline-flex items-center gap-2 sm:gap-3">
                        Veja como simplificar
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                    </motion.button>

                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className={`mt-20 text-sm transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Role para descobrir ↓
                    </motion.div>
                </motion.div>
            </section>

            {/* SEÇÃO PRODUCT SPOTLIGHT (Substitui Portais) */}
            <section id="destaques" className={`relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-white to-gray-50'}`}>
                <div className="max-w-7xl mx-auto relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 px-4 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Uma plataforma, <br className="hidden md:block" />três experiências perfeitas.
                            </h2>
                            <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto px-4 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                O SindicoAI se adapta a quem está usando. Simples para o morador, eficiente para o funcionário e poderoso para o síndico.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Interactive Showcase */}
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        {/* Left: Navigation (Tabs) */}
                        <div className="lg:col-span-4 space-y-4">
                            {/* Síndico Tab */}
                            <motion.div
                                className={`p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 group ${darkMode ? 'bg-gray-800/40 border-gray-700 hover:border-green-500/50' : 'bg-white border-gray-100 hover:border-green-200 shadow-sm hover:shadow-md'}`}
                                whileHover={{ x: 5 }}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Para Síndicos</h3>
                                </div>
                                <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Controle total sem microgerenciamento. A IA responde dúvidas, o sistema organiza reservas.
                                </p>
                                <span className={`text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                    Ver painel <ArrowRight className="w-3 h-3" />
                                </span>
                            </motion.div>

                            {/* Morador Tab */}
                            <motion.div
                                className={`p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 group ${darkMode ? 'bg-gray-800/40 border-gray-700 hover:border-blue-500/50' : 'bg-white border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md'}`}
                                whileHover={{ x: 5 }}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Para Moradores</h3>
                                </div>
                                <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Zero burocracia. Reserve áreas, receba encomendas e vote em enquetes pelo celular.
                                </p>
                                <span className={`text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                    Ver app <ArrowRight className="w-3 h-3" />
                                </span>
                            </motion.div>

                            {/* Funcionário Tab */}
                            <motion.div
                                className={`p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 group ${darkMode ? 'bg-gray-800/40 border-gray-700 hover:border-orange-500/50' : 'bg-white border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md'}`}
                                whileHover={{ x: 5 }}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Para Funcionários</h3>
                                </div>
                                <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Agenda clara do dia. Checklist de tarefas e comunicação direta sem confusão.
                                </p>
                                <span className={`text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                    Ver rotina <ArrowRight className="w-3 h-3" />
                                </span>
                            </motion.div>
                        </div>

                        {/* Right: Dynamic Preview (Placeholder for now) */}
                        <div className="lg:col-span-8">
                            <motion.div
                                className={`relative rounded-3xl overflow-hidden shadow-2xl border aspect-[16/10] group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-50 ${darkMode ? 'from-green-900/20 to-blue-900/20' : 'from-green-50 to-blue-50'}`} />

                                {/* Placeholder Content representing a Dashboard */}
                                <div className="absolute inset-4 sm:inset-8 flex flex-col">
                                    {/* Fake Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex gap-4">
                                            <div className={`w-32 h-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                                            <div className={`w-20 h-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                                        </div>
                                        <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                                    </div>

                                    {/* Dashboard Grid */}
                                    <div className="grid grid-cols-3 gap-6 flex-1">
                                        <div className={`col-span-2 rounded-2xl p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className={`h-4 w-24 rounded mb-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                                    <div className={`h-3 w-32 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className={`h-12 w-full rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-span-1 space-y-6">
                                            <div className={`h-32 w-full rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`} />
                                            <div className={`h-32 w-full rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all">
                                    <div className={`px-6 py-3 rounded-full backdrop-blur-md border shadow-lg ${darkMode ? 'bg-black/80 border-white/10 text-white' : 'bg-white/90 border-white/40 text-gray-900'}`}>
                                        <span className="font-bold flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-500" />
                                            Visão do Síndico
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="como-funciona" className={`relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 transition-colors duration-500 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-transparent to-white/50'}`}>
                <div className="max-w-7xl mx-auto">
                    <ScrollReveal>
                        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-center mb-3 sm:mb-4 px-4 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reconhecemos o seu dia a dia</h2>
                        <p className={`text-base sm:text-lg md:text-xl text-center mb-12 sm:mb-16 max-w-2xl mx-auto px-4 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sabemos exatamente os desafios que você enfrenta</p>
                    </ScrollReveal>

                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-[40px] overflow-hidden shadow-2xl">
                                <img
                                    src="/assets/Gemini_Generated_Image_sdmzy9sdmzy9sdmz.png"
                                    alt="Síndico sobrecarregado"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                        </ScrollReveal>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                {
                                    icon: Clock,
                                    title: 'O Síndico às 23h',
                                    pain: '"Posso fazer festa até que horas?"',
                                    description: 'Você recebe essa mesma pergunta 15 vezes por semana. No WhatsApp. No elevador. Na garagem. E ainda precisa lembrar onde está o regimento para responder.',
                                    color: 'from-red-500 to-orange-500'
                                },
                                {
                                    icon: MessageSquare,
                                    title: 'O Morador no Sábado',
                                    pain: '"Alguém reservou a churrasqueira?"',
                                    description: 'Você quer fazer um churrasco. Liga pro síndico: caixa postal. Manda WhatsApp: visto às 14h, sem resposta. Chega lá: ocupado. Ninguém avisou.',
                                    color: 'from-orange-500 to-amber-500'
                                },
                                {
                                    icon: FileX,
                                    title: 'O Funcionário na Segunda',
                                    pain: '"Tem mudança hoje? Ninguém me avisou."',
                                    description: 'O caminhão de mudança chega às 8h. O morador está nervoso na portaria. Você não sabia de nada. A informação ficou perdida em algum grupo.',
                                    color: 'from-amber-500 to-yellow-500'
                                }
                            ].map((item, i) => (
                                <ScrollReveal key={i} delay={i * 0.1} direction="right">
                                    <div className={`p-5 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl border-2 shadow-2xl hover:scale-[1.02] transition-all ${darkMode ? 'bg-gray-800/60 border-gray-700/80' : 'bg-white/60 border-white/80'}`}>
                                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 sm:mb-5 shadow-lg`}>
                                            <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        </div>
                                        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.title}</p>
                                        <p className={`text-xl sm:text-2xl font-black mb-3 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.pain}</p>
                                        <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                    <ScrollReveal delay={0.5}>
                        <div className="text-center mt-20">
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={darkMode ? 'text-gray-500' : 'text-gray-400'}
                            >
                                <p className="text-lg font-medium mb-2">Veja como resolvemos cada problema</p>
                                <ArrowRight className="w-6 h-6 mx-auto rotate-90" />
                            </motion.div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* SEÇÃO: E SE EXISTISSE UMA SOLUÇÃO? */}
            <section id="funcionalidades" className={`relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80' : 'bg-gradient-to-br from-white/80 to-orange-50/80'}`}>
                <div className="max-w-full mx-auto">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                                <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-xl">
                                        <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">SindicoAI</h2>
                                </div>
                                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transforma caos em controle</p>
                                <p className={`text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cada problema que você vive tem uma solução específica. Veja como resolvemos cada um:</p>
                            </div>
                        </ScrollReveal>

                        {/* FUNCIONALIDADE 1: IA que responde */}
                        <ScrollReveal>
                            <div className={`mb-8 sm:mb-12 lg:mb-16 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] border-2 shadow-xl transition-colors ${darkMode ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-800/50' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'}`}>
                                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                                    <div>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Assistente IA
                                        </div>
                                        <h3 className={`text-2xl sm:text-3xl font-black mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Morador pergunta, IA responde. Na hora.</h3>
                                        <p className={`text-base sm:text-lg mb-4 sm:mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            O morador digita: <strong>"Posso fazer festa até que horas?"</strong>
                                            <br />A IA lê o regimento do SEU condomínio e responde: <strong>"Festas podem ocorrer até 22h em dias de semana e até 00h aos finais de semana, conforme Art. 15 do Regimento Interno."</strong>
                                        </p>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {['Lê os documentos reais do seu condomínio', 'Responde sobre horários, regras, políticas', 'Funciona 24 horas, inclusive de madrugada', 'Você não precisa responder a mesma pergunta de novo'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 sm:gap-3">
                                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                        <p className={`text-xs mb-3 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Exemplo de conversa real</p>
                                        <div className="space-y-4">
                                            <div className="flex justify-end">
                                                <div className="bg-green-500 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                                                    Qual o horário da piscina?
                                                </div>
                                            </div>
                                            <div className="flex justify-start">
                                                <div className={`px-4 py-2 rounded-2xl rounded-bl-md max-w-[80%] ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                                                    <p className="mb-2">A piscina funciona das <strong>8h às 20h</strong>, de terça a domingo.</p>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Segundas-feiras é dia de manutenção.</p>
                                                    <p className="text-xs text-green-500 mt-2">📄 Fonte: Regimento Interno, Art. 23</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* FUNCIONALIDADE 2: Reservas automáticas */}
                        <ScrollReveal delay={0.1}>
                            <div className={`mb-8 sm:mb-12 lg:mb-16 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] border-2 shadow-xl transition-colors ${darkMode ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'}`}>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="order-2 md:order-1">
                                        <div className={`rounded-2xl p-6 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                            <p className={`text-xs mb-4 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Calendário de reservas</p>
                                            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
                                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                                    <div key={i} className={`font-medium py-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{d}</div>
                                                ))}
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
                                                    <div
                                                        key={d}
                                                        className={`py-2 rounded-lg ${d === 8 ? 'bg-blue-500 text-white font-bold' : d === 5 || d === 12 ? 'bg-red-500/20 text-red-400 line-through' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                                    >
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className={`flex items-center gap-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> Sua reserva</span>
                                                <span className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${darkMode ? 'bg-red-500/30' : 'bg-red-100'}`} /> Ocupado</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-1 md:order-2">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                                            <Calendar className="w-4 h-4" />
                                            Sistema de Reservas
                                        </div>
                                        <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reserve a churrasqueira em 3 cliques.</h3>
                                        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Nada de ligar pro síndico. Nada de WhatsApp. Abre o sistema, vê os horários disponíveis, reserva. Pronto.
                                        </p>
                                        <ul className="space-y-3">
                                            {['Veja em tempo real o que está livre', 'O sistema impede reservas duplicadas', 'Receba confirmação automática', 'Cancele com 1 clique se precisar'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* FUNCIONALIDADE 3: Notificações */}
                        <ScrollReveal delay={0.2}>
                            <div className={`mb-8 sm:mb-12 lg:mb-16 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] border-2 shadow-xl transition-colors ${darkMode ? 'bg-gradient-to-br from-orange-900/30 to-amber-900/30 border-orange-800/50' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100'}`}>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                                            <Bell className="w-4 h-4" />
                                            Notificações Inteligentes
                                        </div>
                                        <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Aviso importante? Chega pra todo mundo.</h3>
                                        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Acabou a água? Vai ter manutenção no elevador? Manda uma notificação. Chega no portal de cada morador. Sem se perder em grupo de WhatsApp com 200 mensagens de bom dia.
                                        </p>
                                        <ul className="space-y-3">
                                            {['Envie para todos ou para apartamentos específicos', 'Saiba quem visualizou o aviso', 'Histórico completo de comunicações', 'Moradores acessam no portal deles'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={`rounded-2xl p-6 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                        <p className={`text-xs mb-4 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Notificações recentes</p>
                                        <div className="space-y-3">
                                            {[
                                                { title: 'Manutenção do elevador', time: 'Hoje, 14:30', read: true },
                                                { title: 'Interrupção de água - Bloco B', time: 'Ontem, 09:15', read: true },
                                                { title: 'Assembleia dia 15/02', time: '3 dias atrás', read: false }
                                            ].map((notif, i) => (
                                                <div key={i} className={`p-4 rounded-xl border ${notif.read ? (darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100') : (darkMode ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-50 border-orange-200')}`}>
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className={`font-semibold ${notif.read ? (darkMode ? 'text-gray-300' : 'text-gray-700') : (darkMode ? 'text-white' : 'text-gray-900')}`}>{notif.title}</p>
                                                            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{notif.time}</p>
                                                        </div>
                                                        {!notif.read && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* FUNCIONALIDADE 4: Agenda do Funcionário */}
                        <ScrollReveal delay={0.3}>
                            <div className={`p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] border-2 shadow-xl transition-colors ${darkMode ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-800/50' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100'}`}>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="order-2 md:order-1">
                                        <div className={`rounded-2xl p-6 shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                            <p className={`text-xs mb-4 uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Agenda de hoje - Segunda</p>
                                            <div className="space-y-3">
                                                {[
                                                    { time: '08:00', task: 'Mudança - Apto 302', status: 'pendente' },
                                                    { time: '10:00', task: 'Churrasqueira - reserva Sr. Carlos', status: 'em andamento' },
                                                    { time: '14:00', task: 'Manutenção piscina', status: 'pendente' },
                                                    { time: '16:00', task: 'Salão de festas - aniversário', status: 'pendente' }
                                                ].map((item, i) => (
                                                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                                        <span className={`text-sm font-mono w-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.time}</span>
                                                        <span className={`flex-1 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.task}</span>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'em andamento' ? (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600')}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-1 md:order-2">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                            <Briefcase className="w-4 h-4" />
                                            Portal do Funcionário
                                        </div>
                                        <h3 className={`text-3xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Funcionário chega e sabe o que fazer.</h3>
                                        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Acabou o "ninguém me avisou". O porteiro, zelador, faxineira - todos veem a agenda do dia. Sabem das reservas, mudanças, manutenções. Tudo organizado.
                                        </p>
                                        <ul className="space-y-3">
                                            {['Agenda visual do dia inteiro', 'Marca quando começou e terminou cada tarefa', 'Reporta problemas com 1 clique', 'Histórico de tudo que foi feito'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* SEÇÃO: FAQ */}
            <section className={`relative transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-t from-white to-orange-50/30'}`}>
                {/* Background Decorativo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className={`absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors ${darkMode ? 'bg-green-500/5' : 'bg-green-500/5'}`} />
                    <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] transition-colors ${darkMode ? 'bg-blue-500/5' : 'bg-blue-500/5'}`} />
                </div>

                <div className="relative z-10 pt-16 sm:pt-24 lg:pt-32">
                    <ScrollReveal>
                        <div className="text-center mb-12 sm:mb-16 lg:mb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                Tira-dúvidas
                            </div>
                            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Perguntas Frequentes
                            </h2>
                            <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Tudo que você precisa saber sobre como o SindicoAI vai transformar a gestão do seu condomínio
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid lg:grid-cols-2 gap-0 items-start">
                        {/* Imagem fixa no lado esquerdo - Full Bleed */}
                        <ScrollReveal direction="left" className="w-full order-1 lg:order-1">
                            <div className="lg:sticky lg:top-32 w-full mb-8 lg:mb-0">
                                <div className="relative w-full overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-r via-transparent to-transparent z-10 ${darkMode ? 'from-gray-900/50' : 'from-white/10'}`} />
                                    <img
                                        src="/assets/Gemini_Generated_Image_1hjvez1hjvez1hjv.png"
                                        alt="Gestão inteligente de condomínio"
                                        className="w-full h-auto object-contain rounded-2xl lg:rounded-r-[40px] lg:rounded-l-none shadow-2xl"
                                    />
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* FAQs no lado direito */}
                        <div className="p-4 sm:p-6 lg:p-20 lg:pt-0 space-y-4 sm:space-y-6 max-w-3xl order-2 lg:order-2">
                            {[
                                {
                                    question: "Como a IA aprende sobre meu condomínio?",
                                    answer: "Você faz upload do regimento interno, atas de assembleias e outros documentos importantes. A IA lê tudo e consegue responder perguntas baseadas nesses documentos. É como ter um assistente que leu toda a documentação do seu condomínio."
                                },
                                {
                                    question: "Preciso de conhecimento técnico para usar?",
                                    answer: "Não! O SindicoAI foi feito para ser simples. Se você sabe usar WhatsApp, sabe usar o SindicoAI. A configuração inicial leva cerca de 15 minutos e não precisa de técnico."
                                },
                                {
                                    question: "Como faço o cadastro inicial dos moradores?",
                                    answer: "É muito simples! Você pode importar uma planilha com os dados dos moradores ou cadastrar manualmente. Cada morador recebe automaticamente um link de acesso personalizado por email ou WhatsApp."
                                },
                                {
                                    question: "E se a IA responder errado?",
                                    answer: "A IA sempre informa a fonte da informação (qual documento e artigo). Se houver alguma dúvida, o morador pode conferir. Além disso, você pode revisar e corrigir respostas no painel do síndico."
                                },
                                {
                                    question: "Quanto custa?",
                                    answer: "Oferecemos 30 dias grátis para você testar sem compromisso. Os valores dos planos estão sendo definidos e serão anunciados em breve. Entre em contato conosco para saber mais sobre condições especiais para early adopters."
                                },
                                {
                                    question: "Meus dados estão seguros?",
                                    answer: "Sim. Usamos criptografia de ponta a ponta e servidores no Brasil. Seus documentos e dados dos moradores são protegidos conforme a LGPD. Nunca compartilhamos informações com terceiros."
                                },
                                {
                                    question: "Posso cancelar quando quiser?",
                                    answer: "Sim! Não há fidelidade. Você pode cancelar a qualquer momento e seus dados ficam disponíveis para exportação por 90 dias após o cancelamento."
                                },
                                {
                                    question: "Funciona para condomínios pequenos?",
                                    answer: "Funciona para qualquer tamanho! Desde prédios pequenos com 8 apartamentos até grandes condomínios com centenas de unidades. O sistema se adapta ao seu tamanho."
                                }
                            ].map((faq, index) => (
                                <ScrollReveal key={index} delay={index * 0.05}>
                                    <motion.div
                                        className={`rounded-2xl border transition-all duration-300 ${darkMode ?
                                            'bg-gray-800/40 border-gray-700 hover:bg-gray-800 hover:border-gray-600' :
                                            'bg-white border-gray-100 hover:border-green-200 hover:shadow-lg'}`}
                                    >
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left"
                                        >
                                            <span className={`text-base sm:text-lg font-bold pr-3 sm:pr-4 transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                {faq.question}
                                            </span>
                                            <div className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                {openFaq === index ? (
                                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                ) : (
                                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                )}
                                            </div>
                                        </button>
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                height: openFaq === index ? "auto" : 0,
                                                opacity: openFaq === index ? 1 : 0
                                            }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </ScrollReveal>
                            ))}

                            {/* CTA dentro do FAQ */}
                            <ScrollReveal delay={0.5}>
                                <div className={`mt-12 sm:mt-16 lg:mt-20 p-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-500`}>
                                    <div className={`rounded-[15px] sm:rounded-[22px] p-6 sm:p-8 md:p-12 text-center relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                        <div className="relative z-10">
                                            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                Ainda tem alguma dúvida específica?
                                            </h3>
                                            <p className={`mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Nossa equipe de especialistas está pronta para explicar exatamente como o SindicoAI se adapta à realidade do seu condomínio.
                                            </p>
                                            <a
                                                href="mailto:contato@sindicoai.com"
                                                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-green-600 text-white text-sm sm:text-base font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-500/30"
                                            >
                                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Falar com especialista
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO: CTA FINAL - Refactored for Risk Reversal */}
            <section id="cta" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal>
                        <div className="p-8 sm:p-12 md:p-16 rounded-2xl sm:rounded-[40px] bg-gradient-to-br from-green-600 to-green-800 text-white text-center relative overflow-hidden shadow-2xl hover:shadow-green-500/20 transition-shadow duration-500">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50" />

                            {/* Texture overlay */}
                            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-50 text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
                                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Garantia incondicional
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight px-4">
                                    Teste 30 dias com <br /><span className="text-green-200">Risco Zero.</span>
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-green-50 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed px-4">
                                    Use todas as funcionalidades. Se o SindicoAI não transformar a gestão do seu condomínio, você não paga absolutamente nada.
                                </p>
                                <p className="text-sm sm:text-base md:text-lg text-green-200 mb-8 sm:mb-10 font-medium px-4">
                                    Sem contratos de fidelidade. Sem letras miúdas.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10 px-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 rounded-xl sm:rounded-2xl bg-white text-green-800 font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/30 inline-flex items-center justify-center gap-2 sm:gap-3 transition-all"
                                    >
                                        Começar teste grátis agora
                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.button>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-green-100/80 font-medium px-4">
                                    <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Sem cartão de crédito</span>
                                    <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Cancele quando quiser</span>
                                    <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> Suporte por WhatsApp</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={`py-8 sm:py-12 px-4 sm:px-6 lg:px-12 transition-colors ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-900 text-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold">SindicoAI</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                            <a href="mailto:contato@sindicoai.com" className="hover:text-white transition-colors flex items-center gap-2">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">contato@sindicoai.com</span>
                                <span className="sm:hidden">Contato</span>
                            </a>
                        </div>
                    </div>
                    <div className={`mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm ${darkMode ? 'border-gray-800 text-gray-600' : 'border-gray-800 text-gray-500'}`}>
                        © 2025 SindicoAI. Gestão condominial inteligente.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default StorytellingLandingPage
