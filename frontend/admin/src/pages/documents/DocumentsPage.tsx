import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload,
    FileText,
    Image as ImageIcon,
    File,
    Download,
    Trash2,
    Filter,
    Search,
    X,
} from 'lucide-react'
import { HologramCard, Button, Modal, Input, Textarea, Select } from '@/components'
import { Document, DocumentCategory, DocumentType } from '@/types/document.types'
import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/feedback/Toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Mock data
const mockDocuments: Document[] = [
    {
        id: '1',
        tenant_id: 'tenant1',
        name: 'Ata de Reunião - Janeiro 2024.pdf',
        description: 'Ata da reunião ordinária de janeiro',
        file_path: '/documents/ata-janeiro-2024.pdf',
        file_size: 245000,
        file_type: 'application/pdf',
        document_type: 'pdf',
        category: 'meeting_minutes',
        status: 'active',
        uploaded_by: 'user1',
        uploader_name: 'João Silva',
        is_public: true,
        tags: ['reunião', 'janeiro', '2024'],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        tenant_id: 'tenant1',
        name: 'Contrato de Manutenção 2024.pdf',
        description: 'Contrato de manutenção predial',
        file_path: '/documents/contrato-manutencao-2024.pdf',
        file_size: 512000,
        file_type: 'application/pdf',
        document_type: 'pdf',
        category: 'contract',
        status: 'active',
        uploaded_by: 'user1',
        uploader_name: 'João Silva',
        is_public: false,
        tags: ['contrato', 'manutenção'],
        created_at: '2024-01-10T14:30:00Z',
        updated_at: '2024-01-10T14:30:00Z',
    },
    {
        id: '3',
        tenant_id: 'tenant1',
        name: 'Relatório Financeiro Q4 2023.xlsx',
        description: 'Relatório financeiro do 4º trimestre',
        file_path: '/documents/relatorio-q4-2023.xlsx',
        file_size: 128000,
        file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        document_type: 'spreadsheet',
        category: 'report',
        status: 'active',
        uploaded_by: 'user2',
        uploader_name: 'Maria Santos',
        is_public: true,
        tags: ['financeiro', 'relatório', '2023'],
        created_at: '2024-01-05T09:15:00Z',
        updated_at: '2024-01-05T09:15:00Z',
    },
]

const uploadSchema = z.object({
    description: z.string().optional(),
    category: z.string().min(1, 'Selecione uma categoria'),
    is_public: z.boolean(),
    tags: z.string().optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

const categoryLabels: Record<DocumentCategory, string> = {
    contract: 'Contrato',
    invoice: 'Fatura',
    meeting_minutes: 'Ata de Reunião',
    regulation: 'Regulamento',
    report: 'Relatório',
    other: 'Outro',
}

const documentTypeIcons: Record<DocumentType, React.ElementType> = {
    pdf: FileText,
    image: ImageIcon,
    spreadsheet: File,
    other: File,
}

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DocumentsPage = () => {
    const [documents, setDocuments] = useState<Document[]>(mockDocuments)
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
    const [filterCategory, setFilterCategory] = useState<DocumentCategory | 'all'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState<File[]>([])

    const { isOpen: isUploadOpen, open: openUpload, close: closeUpload } = useModal()
    const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal()
    const { toast, hideToast, success, error } = useToast()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            is_public: true,
        },
    })

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            setUploadingFiles(files)
            openUpload()
        }
    }, [openUpload])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setUploadingFiles(Array.from(files))
            openUpload()
        }
    }

    const handleUpload = async (_data: UploadFormData) => {
        try {
            // const formData = new FormData()
            // uploadingFiles.forEach(file => formData.append('files', file))
            // formData.append('category', data.category)
            // formData.append('description', data.description || '')
            // formData.append('is_public', data.is_public.toString())
            // if (data.tags) formData.append('tags', data.tags)
            // await documentsService.upload(formData)

            success(`${uploadingFiles.length} arquivo(s) enviado(s) com sucesso!`)
            setUploadingFiles([])
            closeUpload()
            reset()
        } catch {
            error('Erro ao enviar documentos')
        }
    }

    const handleDownload = async (doc: Document) => {
        try {
            // const blob = await documentsService.download(doc.id)
            // const url = window.URL.createObjectURL(blob)
            // const a = document.createElement('a')
            // a.href = url
            // a.download = doc.name
            // document.body.appendChild(a)
            // a.click()
            // window.URL.revokeObjectURL(url)
            // document.body.removeChild(a)
            success(`Download de "${doc.name}" iniciado!`)
        } catch {
            error('Erro ao baixar documento')
        }
    }

    const handleDeleteConfirm = async () => {
        try {
            // await documentsService.delete(selectedDocument!.id)
            setDocuments(documents.filter((d) => d.id !== selectedDocument!.id))
            success('Documento removido com sucesso!')
            closeDelete()
        } catch {
            error('Erro ao remover documento')
        }
    }

    const filteredDocuments = documents.filter((doc) => {
        if (filterCategory !== 'all' && doc.category !== filterCategory) return false
        if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-cyan text-glow-cyan mb-2">Documentos</h1>
                    <p className="text-metal-silver">Gerencie os documentos do condomínio</p>
                </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <HologramCard
                    className={`relative overflow-hidden transition-all duration-300 ${
                        isDragging ? 'border-cyan shadow-glow scale-[1.02]' : ''
                    }`}
                >
                {/* Scan Line Animation */}
                {isDragging && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan to-transparent"
                        animate={{ y: [0, 300, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                )}

                <div className="p-12 text-center">
                    <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-cyan/10 border border-cyan-glow/30"
                        animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                    >
                        <Upload className={`w-10 h-10 ${isDragging ? 'text-cyan' : 'text-cyan/60'}`} />
                    </motion.div>

                    <h3 className="text-xl font-bold text-cyan mb-2">
                        {isDragging ? 'Solte os arquivos aqui' : 'Arrastar e soltar arquivos'}
                    </h3>
                    <p className="text-metal-silver/60 mb-6">
                        ou clique no botão abaixo para selecionar
                    </p>

                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload">
                        <span className="btn-glow cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium">
                            <Upload className="w-5 h-5" />
                            Selecionar Arquivos
                        </span>
                    </label>

                    <p className="text-xs text-metal-silver/40 mt-4">
                        Formatos suportados: PDF, PNG, JPG, XLSX, DOCX (máx. 10MB)
                    </p>
                </div>
            </HologramCard>
            </div>

            {/* Filters */}
            <HologramCard className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-cyan" />
                    <h3 className="text-lg font-bold text-cyan">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Categoria"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value as DocumentCategory | 'all')}
                    >
                        <option value="all">Todas</option>
                        <option value="contract">Contratos</option>
                        <option value="invoice">Faturas</option>
                        <option value="meeting_minutes">Atas de Reunião</option>
                        <option value="regulation">Regulamentos</option>
                        <option value="report">Relatórios</option>
                        <option value="other">Outros</option>
                    </Select>
                    <div className="relative">
                        <Input
                            label="Buscar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Nome do documento..."
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-[42px] text-metal-silver/60 hover:text-cyan transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <Search className="absolute right-3 top-[42px] w-4 h-4 text-cyan pointer-events-none" />
                    </div>
                </div>
            </HologramCard>

            {/* Documents List */}
            {filteredDocuments.length === 0 ? (
                <HologramCard className="p-12 text-center">
                    <FileText className="w-16 h-16 text-cyan/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-metal-silver mb-2">
                        Nenhum documento encontrado
                    </h3>
                    <p className="text-metal-silver/60">
                        Ajuste os filtros ou faça upload de novos documentos
                    </p>
                </HologramCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredDocuments.map((doc, index) => {
                            const Icon = documentTypeIcons[doc.document_type]
                            return (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <HologramCard className="p-5 h-full flex flex-col">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-cyan" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-metal-silver truncate text-sm">
                                                    {doc.name}
                                                </h4>
                                                <p className="text-xs text-metal-silver/60">
                                                    {formatFileSize(doc.file_size)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {doc.description && (
                                            <p className="text-sm text-metal-silver/80 mb-3 line-clamp-2">
                                                {doc.description}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="space-y-2 mb-4 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-metal-silver/60">Categoria:</span>
                                                <span className="text-xs px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/30">
                                                    {categoryLabels[doc.category]}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-metal-silver/60">Enviado por:</span>
                                                <span className="text-xs text-metal-silver font-medium">
                                                    {doc.uploader_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-metal-silver/60">Data:</span>
                                                <span className="text-xs text-metal-silver font-mono">
                                                    {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {doc.tags && doc.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {doc.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs px-2 py-0.5 rounded bg-coal border border-cyan-glow/30 text-metal-silver/60"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="pt-3 border-t border-cyan-glow/30 flex items-center gap-2">
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="flex-1 py-2 px-3 bg-cyan/10 hover:bg-cyan/20 border border-cyan-glow/30 rounded-lg text-cyan text-xs transition-all flex items-center justify-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                                Baixar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedDocument(doc)
                                                    openDelete()
                                                }}
                                                className="p-2 bg-criticalred/10 hover:bg-criticalred/20 border border-criticalred/30 rounded-lg text-criticalred transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </HologramCard>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Modal */}
            <Modal isOpen={isUploadOpen} onClose={closeUpload} title="Upload de Documentos" size="lg">
                <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
                    {/* Files Preview */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-metal-silver mb-2">
                            Arquivos Selecionados
                        </label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {uploadingFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-coal-light rounded-lg border border-cyan-glow/30"
                                >
                                    <FileText className="w-5 h-5 text-cyan flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-metal-silver truncate">{file.name}</p>
                                        <p className="text-xs text-metal-silver/60">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Select
                        label="Categoria"
                        {...register('category')}
                        error={errors.category?.message}
                        required
                    >
                        <option value="">Selecione uma categoria</option>
                        <option value="contract">Contrato</option>
                        <option value="invoice">Fatura</option>
                        <option value="meeting_minutes">Ata de Reunião</option>
                        <option value="regulation">Regulamento</option>
                        <option value="report">Relatório</option>
                        <option value="other">Outro</option>
                    </Select>

                    <Textarea
                        label="Descrição"
                        {...register('description')}
                        error={errors.description?.message}
                        placeholder="Descreva o documento..."
                        rows={3}
                    />

                    <Input
                        label="Tags (separadas por vírgula)"
                        {...register('tags')}
                        error={errors.tags?.message}
                        placeholder="Ex: reunião, janeiro, 2024"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_public"
                            {...register('is_public')}
                            className="w-4 h-4 rounded border-cyan-glow bg-coal-light text-cyan focus:ring-cyan focus:ring-offset-coal"
                        />
                        <label htmlFor="is_public" className="text-sm text-metal-silver">
                            Documento público (visível para todos os moradores)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={() => {
                                closeUpload()
                                setUploadingFiles([])
                                reset()
                            }}
                            className="flex-1 bg-coal-light hover:bg-coal"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 btn-glow">
                            Fazer Upload
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={closeDelete} title="Confirmar Exclusão" size="md">
                <div className="space-y-4">
                    <p className="text-metal-silver">
                        Tem certeza que deseja remover o documento{' '}
                        <span className="text-cyan font-bold">{selectedDocument?.name}</span>?
                    </p>
                    <div className="bg-criticalred/10 border border-criticalred/30 rounded-lg p-4">
                        <p className="text-sm text-criticalred">
                            Esta ação não pode ser desfeita e o arquivo será permanentemente removido.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={closeDelete} className="flex-1 bg-coal-light hover:bg-coal">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteConfirm} className="flex-1 bg-gradient-alert">
                            Confirmar Exclusão
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast */}
            <Toast
                message={toast.message}
                variant={toast.variant}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    )
}

export default DocumentsPage
