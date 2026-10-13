import { Link } from 'react-router-dom'
import { Btn, Container, Display, Eyebrow, Lead } from '../components/ui'
import { NAV_PRIMARY } from '../data/site'
import { useSeo } from '../lib/seo'

export default function NotFound() {
  useSeo({
    title: 'Page introuvable | Hervé Nanfang',
    description:
      "La page demandée n’existe pas ou a été déplacée. Accédez aux rubriques du site : musique, IA & technologie, pédagogie, culture, projets, journal et contact.",
    path: '/404',
    robots: 'noindex, follow',
  })

  return (
    <section className="relative flex min-h-[80vh] items-center bg-ink pt-32">
      <Container>
        <Eyebrow>Erreur 404</Eyebrow>
        <Display as="h1" size="xl" className="mt-7 text-ivory">
          Cette page n’existe pas
        </Display>
        <Lead className="mt-6 max-w-xl">
          Le lien est peut-être obsolète, ou l’adresse comporte une erreur. Le site reste entièrement
          accessible depuis les rubriques ci-dessous.
        </Lead>
        <div className="mt-10 flex flex-wrap gap-4">
          <Btn to="/" variant="gold">
            Retour à l’accueil
          </Btn>
          <Btn to="/contact" variant="ghost">
            Me contacter
          </Btn>
        </div>
        <nav aria-label="Plan du site" className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
          {NAV_PRIMARY.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory/50 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  )
}
