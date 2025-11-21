import { useCallback, useState } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploadProps {
    label?: string
    accept?: string
    multiple?: boolean
    maxSize?: number // in MB
    onChange?: (files: File[]) => void
    error?: string
    helperText?: string
    disabled?: boolean
}

interface UploadedFile {
    file: File
    id: string
    status: 'pending' | 'uploading' | 'success' | 'error'
    progress?: number
}

const FileUpload = ({
    label,
    accept,
    multiple = false,
    maxSize = 10,
    onChange,
    error,
    helperText,
    disabled = false,
}: FileUploadProps) => {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)

    const validateFile = (file: File): boolean => {
        if (maxSize && file.size > maxSize * 1024 * 1024) {
            return false
        }
        return true
    }

    const handleFiles = useCallback(
        (newFiles: FileList | null) => {
            if (!newFiles || disabled) return

            const validFiles: File[] = []
            const uploadedFiles: UploadedFile[] = []

            Array.from(newFiles).forEach((file) => {
                if (validateFile(file)) {
                    validFiles.push(file)
                    uploadedFiles.push({
                        file,
                        id: Math.random().toString(36).substring(7),
                        status: 'pending',
                    })
                }
            })

            setFiles((prev) => (multiple ? [...prev, ...uploadedFiles] : uploadedFiles))
            onChange?.(validFiles)
        },
        [multiple, onChange, disabled, maxSize]
    )

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const removeFile = useCallback((id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id))
    }, [])

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-metal-silver mb-2">
                    {label}
                </label>
            )}

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    relative border-2 border-dashed rounded-lg p-8
                    transition-all duration-300
                    ${isDragging ? 'border-cyan bg-cyan/5 shadow-glow' : 'border-cyan-glow bg-coal-light'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${error ? 'border-criticalred' : ''}
                `}
            >
                {/* Scan Line Effect */}
                {isDragging && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="absolute left-0 w-full h-0.5 bg-cyan/50"
                            animate={{ y: [0, '100%'] }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.div>
                )}

                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-12 h-12 text-cyan mb-4" />
                    <p className="text-metal-silver font-medium mb-1">
                        {isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
                    </p>
                    <p className="text-sm text-metal-silver/60">
                        {accept ? `Formatos: ${accept}` : 'Todos os formatos'} • Máximo: {maxSize}MB
                    </p>
                </div>
            </div>

            {error && <p className="mt-2 text-sm text-criticalred">{error}</p>}
            {helperText && !error && (
                <p className="mt-2 text-sm text-metal-silver/60">{helperText}</p>
            )}

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2"
                    >
                        {files.map((uploadedFile) => (
                            <motion.div
                                key={uploadedFile.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 p-3 bg-coal-light border border-cyan-glow/30 rounded-lg"
                            >
                                <File className="w-5 h-5 text-cyan flex-shrink-0" />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-metal-silver truncate">
                                        {uploadedFile.file.name}
                                    </p>
                                    <p className="text-xs text-metal-silver/60">
                                        {formatFileSize(uploadedFile.file.size)}
                                    </p>
                                </div>

                                {uploadedFile.status === 'success' && (
                                    <CheckCircle className="w-5 h-5 text-terminalgreen flex-shrink-0" />
                                )}
                                {uploadedFile.status === 'error' && (
                                    <AlertCircle className="w-5 h-5 text-criticalred flex-shrink-0" />
                                )}

                                <button
                                    onClick={() => removeFile(uploadedFile.id)}
                                    className="text-metal-silver/60 hover:text-criticalred transition-colors flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FileUpload
