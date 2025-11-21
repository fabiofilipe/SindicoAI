import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
    label: string
    path?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    showHome?: boolean
    glowSeparator?: boolean
    className?: string
}

const Breadcrumb = ({ items, showHome = true, glowSeparator = true, className = '' }: BreadcrumbProps) => {
    return (
        <nav className={`flex items-center gap-2 ${className}`}>
            {showHome && (
                <>
                    <Link
                        to="/dashboard"
                        className="text-metal-silver hover:text-cyan transition-colors p-1"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                    {items.length > 0 && (
                        <ChevronRight className={`w-4 h-4 text-cyan/50 ${glowSeparator ? 'text-glow-cyan' : ''}`} />
                    )}
                </>
            )}

            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                    >
                        {item.path && !isLast ? (
                            <Link
                                to={item.path}
                                className="text-sm text-metal-silver hover:text-cyan transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`text-sm ${isLast ? 'text-cyan font-medium' : 'text-metal-silver'}`}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <ChevronRight className={`w-4 h-4 text-cyan/50 ${glowSeparator ? 'text-glow-cyan' : ''}`} />
                        )}
                    </motion.div>
                )
            })}
        </nav>
    )
}

export default Breadcrumb
