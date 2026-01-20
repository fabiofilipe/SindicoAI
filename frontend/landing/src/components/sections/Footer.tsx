import { Building2, Github, Linkedin, Twitter } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { copy } from '@/content/copy'
import { redirectToPortal } from '@/utils/navigation'

const Footer = () => {
  return (
    <footer className="bg-walnut text-cream py-16 px-4 sm:px-6 lg:px-8">
      <ScrollReveal direction="up">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Column 1 - About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-brass/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brass" strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-display font-bold text-cream">SindicoAI</span>
              </div>
              <p className="text-cream/70 text-sm leading-relaxed">
                {copy.footer.tagline}
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-brass font-semibold mb-4">Acesso Rápido</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => redirectToPortal('morador')}
                    className="text-cream/70 hover:text-brass transition-colors text-sm"
                  >
                    {copy.footer.links.morador}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => redirectToPortal('sindico')}
                    className="text-cream/70 hover:text-brass transition-colors text-sm"
                  >
                    {copy.footer.links.sindico}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => redirectToPortal('funcionario')}
                    className="text-cream/70 hover:text-brass transition-colors text-sm"
                  >
                    {copy.footer.links.funcionario}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h3 className="text-brass font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 mb-6">
                <li className="text-cream/70 text-sm">
                  {copy.footer.contact.email}
                </li>
                <li className="text-cream/70 text-sm">
                  {copy.footer.contact.phone}
                </li>
              </ul>
              {/* Social Icons */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-brass hover:text-cream transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-brass hover:text-cream transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-cream/10 flex items-center justify-center text-cream/70 hover:bg-brass hover:text-cream transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-cream/10 pt-8">
            <p className="text-cream/50 text-sm text-center">
              {copy.footer.copyright}
            </p>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}

export default Footer
