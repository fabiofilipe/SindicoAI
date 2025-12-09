import { useState, type ChangeEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X, File as FileIcon } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { uploadDocuments } from '../../services/documentService'
import toast from 'react-hot-toast'
import type { DocumentUploadResponse, DocumentCategory } from '../../types/document'
import { CATEGORY_LABELS } from '../../types/document'

interface DocumentUploadModalProps {
    onClose: () => void
    onSuccess: () => void
}

interface FileWithProgress {
    file: File
    progress: number
    status: 'pending' | 'uploading' | 'success' | 'error'
    error?: string
}

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_EXTENSIONS = ['.pdf', '.xlsx', '.xls']

export default function DocumentUploadModal({ onClose, onSuccess }: DocumentUploadModalProps) {
    const [files, setFiles] = useState<FileWithProgress[]>([])
    const [category, setCategory] = useState<DocumentCategory>('outros')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<DocumentUploadResponse | null>(null)
    const [error, setError] = useState('')
    const [dragActive, setDragActive] = useState(false)

    const validateFile = (file: File): string | null => {
        // Check file size
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return `Arquivo muito grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). Máximo: ${MAX_FILE_SIZE_MB}MB`
        }

        // Check file extension
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return `Tipo de arquivo não permitido. Permitidos: ${ALLOWED_EXTENSIONS.join(', ')}`
        }

        return null
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files))
        }
    }

    const addFiles = (newFiles: File[]) => {
        const filesWithProgress: FileWithProgress[] = newFiles.map(file => {
            const validationError = validateFile(file)
            return {
                file,
                progress: 0,
                status: validationError ? 'error' as const : 'pending' as const,
                error: validationError || undefined
            }
        })

        setFiles(prev => [...prev, ...filesWithProgress])
        setError('')
        setResult(null)
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            addFiles(Array.from(e.dataTransfer.files))
        }
    }

    const handleUpload = async () => {
        const validFiles = files.filter(f => !f.error)

        if (validFiles.length === 0) {
            setError('Nenhum arquivo válido para enviar')
            toast.error('Nenhum arquivo válido para enviar')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Update all valid files to uploading status
            setFiles(prev => prev.map(f =>
                !f.error ? { ...f, status: 'uploading' as const } : f
            ))

            const response = await uploadDocuments(
                validFiles.map(f => f.file),
                category
            )

            setResult(response)

            // Update file statuses based on results
            setFiles(prev => prev.map(fileWithProgress => {
                const result = response.results.find(r => r.filename === fileWithProgress.file.name)
                if (result) {
                    return {
                        ...fileWithProgress,
                        status: result.status as 'success' | 'error',
                        error: result.error
                    }
                }
                return fileWithProgress
            }))

            // Show success toast
            if (response.successful > 0) {
                toast.success(
                    `${response.successful} arquivo(s) enviado(s) com sucesso! Processamento em andamento.`,
                    { duration: 4000 }
                )

                // Auto-close and refresh after 2 seconds
                setTimeout(() => {
                    onSuccess()
                }, 2000)
            }

            // Show error toast if any failed
            if (response.failed > 0) {
                toast.error(`${response.failed} arquivo(s) falharam no upload`)
            }

        } catch (err: any) {
            const errorMsg = err.response?.data?.detail || 'Erro ao enviar arquivos'
            setError(errorMsg)
            toast.error(errorMsg)

            setFiles(prev => prev.map(f =>
                f.status === 'uploading' ? { ...f, status: 'error' as const } : f
            ))
        } finally {
            setLoading(false)
        }
    }

    const getFileIcon = (filename: string) => {
        const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
        if (ext === '.pdf') return <FileText className="w-5 h-5 text-red-400" />
        if (ext === '.xlsx' || ext === '.xls') return <FileIcon className="w-5 h-5 text-green-400" />
        return <FileIcon className="w-5 h-5 text-gray-400" />
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            case 'uploading':
                return (
                    <div className="w-5 h-5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                )
            default:
                return null
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label
    }))

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Upload de Documentos"
            size="lg"
        >
            {/* Instructions */}
            <div className="mb-6 bg-cyan/10 border border-cyan/30 rounded-lg p-4">
                <p className="text-sm text-cyan mb-2 font-medium">Tipos de arquivo aceitos:</p>
                <ul className="text-xs text-metal-silver space-y-1 ml-4">
                    <li>• PDF (.pdf) - Regimentos, atas, comunicados</li>
                    <li>• Excel (.xlsx, .xls) - Planilhas e relatórios</li>
                    <li>• Tamanho máximo: {MAX_FILE_SIZE_MB}MB por arquivo</li>
                    <li>• Múltiplos arquivos podem ser enviados de uma vez</li>
                </ul>
            </div>

            {/* Category selector */}
            <div className="mb-4">
                <Select
                    label="Categoria do Documento"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    options={categoryOptions}
                />
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Result summary */}
            {result && (
                <div className="mb-4 bg-cyan/10 border border-cyan text-cyan px-4 py-3 rounded">
                    <div className="flex items-center mb-2">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Upload concluído!</span>
                    </div>
                    <ul className="text-sm space-y-1 ml-7">
                        <li>Total de arquivos: {result.total_files}</li>
                        <li>Enviados com sucesso: {result.successful}</li>
                        {result.failed > 0 && (
                            <li className="text-red-400">Falhas: {result.failed}</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Drop zone */}
            <div
                className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-cyan bg-cyan/5'
                        : 'border-gray-600 hover:border-cyan/50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-metal-silver mb-2">
                    Arraste arquivos aqui ou clique para selecionar
                </p>
                <label className="cursor-pointer">
                    <span className="text-cyan hover:text-cyan/80 text-sm">
                        Escolher arquivos
                    </span>
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                    />
                </label>
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div className="mb-6 max-h-64 overflow-y-auto space-y-2">
                    {files.map((fileWithProgress, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg border ${fileWithProgress.error
                                    ? 'bg-red-500/5 border-red-500/30'
                                    : fileWithProgress.status === 'success'
                                        ? 'bg-green-500/5 border-green-500/30'
                                        : 'bg-coal-light border-cyan/20'
                                }`}
                        >
                            <div className="flex items-center flex-1 min-w-0">
                                {getFileIcon(fileWithProgress.file.name)}
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm text-metal-silver truncate">
                                        {fileWithProgress.file.name}
                                    </p>
                                    <p className="text-xs text-metal-silver/60">
                                        {formatFileSize(fileWithProgress.file.size)}
                                    </p>
                                    {fileWithProgress.error && (
                                        <p className="text-xs text-red-400 mt-1">
                                            {fileWithProgress.error}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                                {getStatusIcon(fileWithProgress.status)}
                                {!loading && fileWithProgress.status === 'pending' && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                >
                    {result ? 'Fechar' : 'Cancelar'}
                </Button>
                <Button
                    onClick={handleUpload}
                    className="flex-1"
                    disabled={loading || files.length === 0 || files.every(f => f.error) || !!result}
                    isLoading={loading}
                >
                    {loading ? 'Enviando...' : 'Enviar Documentos'}
                </Button>
            </div>
        </Modal>
    )
}
