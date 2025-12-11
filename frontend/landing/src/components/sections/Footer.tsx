import { Building2, Github, Linkedin, Twitter } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { copy } from '@/content/copy'
import { redirectToPortal } from '@/utils/navigation'

const Footer = () => {
  return (
    <footer className="bg-coal-light/50 border-t border-cyan-glow/20 py-12 px-4 sm:px-6 lg:px-8">
      <ScrollReveal direction="up">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Column 1 - About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-cyan drop-shadow-[0_0_10px_rgba(0,255,240,0.7)]" />
                <span className="text-2xl font-bold text-gradient-cyber">SindicoAI</span>
              </div>
              <p className="text-metal-silver text-sm">
                {copy.footer.tagline}
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-cyan font-bold mb-4 text-glow-cyan">Acesso Rápido</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => redirectToPortal('morador')}
                    className="text-metal-silver hover:text-cyan transition-colors hover:underline"
                  >
                    {copy.footer.links.morador}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => redirectToPortal('sindico')}
                    className="text-metal-silver hover:text-cyan transition-colors hover:underline"
                  >
                    {copy.footer.links.sindico}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => redirectToPortal('funcionario')}
                    className="text-metal-silver hover:text-cyan transition-colors hover:underline"
                  >
                    {copy.footer.links.funcionario}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h3 className="text-cyan font-bold mb-4 text-glow-cyan">Contato</h3>
              <ul className="space-y-2 mb-4">
                <li className="text-metal-silver text-sm">
                  {copy.footer.contact.email}
                </li>
                <li className="text-metal-silver text-sm">
                  {copy.footer.contact.phone}
                </li>
              </ul>
              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-metal-silver hover:text-cyan transition-colors hover:drop-shadow-[0_0_10px_rgba(0,255,240,0.7)]"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-metal-silver hover:text-cyan transition-colors hover:drop-shadow-[0_0_10px_rgba(0,255,240,0.7)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-metal-silver hover:text-cyan transition-colors hover:drop-shadow-[0_0_10px_rgba(0,255,240,0.7)]"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-cyan-glow/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-metal-silver text-sm">
              {copy.footer.copyright}
            </p>
            <p className="text-cyan-glow text-sm flex items-center gap-2">
              <span className="text-xs bg-gradient-cyber text-coal px-3 py-1 rounded-full font-bold">
                {copy.footer.poweredBy}
              </span>
            </p>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}

export default Footer
