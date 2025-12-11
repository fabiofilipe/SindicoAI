import { Home, Shield, Wrench } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import UserTypeCard from '@/components/ui/UserTypeCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { copy } from '@/content/copy'

const UserTypeSection = () => {
  return (
    <section id="user-types" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={copy.userTypes.title}
          subtitle={copy.userTypes.subtitle}
          className="mb-16"
        />

        <ScrollReveal direction="up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UserTypeCard
              type="morador"
              icon={Home}
              title={copy.userTypes.cards.morador.title}
              description={copy.userTypes.cards.morador.description}
            />
            <UserTypeCard
              type="sindico"
              icon={Shield}
              title={copy.userTypes.cards.sindico.title}
              description={copy.userTypes.cards.sindico.description}
            />
            <UserTypeCard
              type="funcionario"
              icon={Wrench}
              title={copy.userTypes.cards.funcionario.title}
              description={copy.userTypes.cards.funcionario.description}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default UserTypeSection
