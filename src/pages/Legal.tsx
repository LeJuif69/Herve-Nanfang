import PageHero from '../components/PageHero'
import { Body, Display, Reveal, Rule, Section } from '../components/ui'
import { SITE } from '../data/site'
import { breadcrumbSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

type Kind = 'mentions' | 'confidentialite'

const CONTENT: Record<Kind, { title: string; eyebrow: string; path: string; lead: string; blocks: { h: string; p: string[] }[] }> = {
  mentions: {
    title: 'Mentions légales',
    eyebrow: 'Informations légales',
    path: '/mentions-legales',
    lead: "Informations relatives à l'éditeur du site, à l'hébergement et aux droits applicables.",
    blocks: [
      {
        h: 'Éditeur du site',
        p: [
          `Le présent site est édité à titre personnel et professionnel par Hervé Nanfang, musicologue, artiste-musicien, pédagogue et ingénieur du son.`,
          `Contact général : ${SITE.phones.map((phone) => phone.display).join(' · ')} — ${SITE.city}. Contact académique & A Laiz Academy (RMA) : ${SITE.emailRma}.`,
          'Direction de la publication, éditoriale et artistique : Hervé Nanfang. Toute demande administrative, institutionnelle ou contractuelle peut être adressée directement aux coordonnées officielles ci-dessus.',
        ],
      },
      {
        h: 'Hébergement',
        p: [
          'Le site est hébergé par Vercel Inc., situé au 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (plateforme Cloud globale sécurisée avec certificat SSL/TLS haute sécurité). Site officiel : https://vercel.com.',
        ],
      },
      {
        h: 'Propriété intellectuelle & marques',
        p: [
          'L’ensemble des contenus de ce site — textes, méthodes pédagogiques, concepts, photographies, affiches, identités visuelles, publications et signes distinctifs (notamment Hervé Nanfang, A Laiz Ô Pays, Le Pianobariste™, A Laiz Academy, Racines Musicales Academy®, Permis de Jouer™, Musicien Augmenté™, LES ZIKOS®, Tswefap, Alaiz Music et Alaiz Patrimoine) — est protégé par le droit d’auteur et les traités internationaux de propriété intellectuelle.',
          'Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable de Hervé Nanfang est formellement interdite.',
        ],
      },
      {
        h: 'Responsabilité',
        p: [
          "Les informations publiées sont fournies de bonne foi et régulièrement mises à jour. Elles ne constituent pas un conseil professionnel personnalisé. L'éditeur ne saurait être tenu responsable des conséquences d'un usage non contextualisé de ces contenus.",
        ],
      },
      {
        h: 'Droit applicable',
        p: [
          'Le présent site et les présentes mentions sont soumis au droit camerounais, sans préjudice des dispositions impératives applicables au lieu de résidence de l’utilisateur.',
        ],
      },
    ],
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    eyebrow: 'Données personnelles & Cookies',
    path: '/confidentialite',
    lead: 'Ce site protège vos données personnelles et vous informe en toute transparence sur les traitements appliqués, les formulaires de contact et la diffusion publicitaire.',
    blocks: [
      {
        h: 'Données collectées',
        p: [
          'Formulaires de contact et d’audition A Laiz Academy (RMA) : nom, adresse email, numéro de téléphone, organisation, objet de la demande et message. Ces données sont collectées exclusivement pour traiter et répondre à vos sollicitations artistiques, pédagogiques et professionnelles.',
          'Navigation et attribution : des paramètres anonymes d’attribution de trafic (UTM) peuvent être temporairement conservés en mémoire de session pour analyser l’efficacité des canaux de communication de l’artiste.',
        ],
      },
      {
        h: 'Publicité en ligne & Cookies Google AdSense',
        p: [
          'Le site fait appel à des régies et partenaires publicitaires tiers, notamment Google AdSense, pour diffuser des annonces sur certaines pages éditoriales (Journal).',
          'Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces pertinentes en fonction des visites antérieures d’un internaute sur le présent site web ou sur d’autres sites internet.',
          'Grâce aux cookies publicitaires, Google et ses partenaires adaptent les annonces diffusées auprès des visiteurs en fonction de leur navigation sur vos sites et/ou d’autres sites du web.',
          'Vous pouvez désactiver la personnalisation des annonces à tout moment en consultant les Paramètres des annonces Google (https://adssettings.google.com) ou en visitant le portail interprofessionnel www.aboutads.info.',
        ],
      },
      {
        h: 'Base légale et durée de conservation',
        p: [
          'Le traitement des demandes de contact repose sur votre consentement explicite ainsi que sur l’intérêt légitime à vous fournir un devis, un diagnostic ou un échange de cadrage artistique.',
          'Les demandes enregistrées via les formulaires sont conservées pendant la durée nécessaire au suivi de la relation professionnelle ou archivées conformément aux obligations administratives.',
        ],
      },
      {
        h: 'Destinataires et hébergement sécurisé',
        p: [
          'Les messages sont enregistrés dans l’infrastructure de base de données sécurisée du site (Supabase) avec politiques d’accès strictes (Row Level Security). Seule l’équipe de gestion d’Hervé Nanfang y a accès.',
          'Aucune donnée personnelle n’est vendue, louée ou cédée à des tiers à des fins de prospection commerciale extérieure.',
          'Les échanges engagés volontairement via WhatsApp relèvent des conditions d’utilisation et de la politique de confidentialité de WhatsApp / Meta.',
        ],
      },
      {
        h: 'Vos droits',
        p: [
          'Conformément à la réglementation sur la protection des données, vous disposez d’un droit d’accès, de rectification, de portabilité, de limitation et de suppression de vos informations personnelles.',
          'Pour exercer ces droits, vous pouvez contacter l’éditeur à tout moment via l’adresse email officielle : racinesmusicalesacademy@gmail.com.',
          'Une réponse sera apportée dans un délai maximum de trente jours.',
        ],
      },
      {
        h: 'Sécurité des données',
        p: [
          'L’ensemble des transferts de données bénéficie du protocole HTTPS sécurisé avec chiffrement SSL/TLS.',
          'L’espace d’administration est isolé, protégé par double authentification et contrôle d’intégrité.',
        ],
      },
    ],
  },
}

export default function Legal({ kind }: { kind: Kind }) {
  const c = CONTENT[kind]

  useSeo({
    // littéraux explicites : indispensables pour un contrôle d'audit fiable
    title:
      kind === 'mentions'
        ? 'Mentions légales | Hervé Nanfang'
        : 'Confidentialité | Hervé Nanfang',
    description:
      kind === 'mentions'
        ? "Informations légales du site d'Hervé Nanfang : éditeur, hébergeur, propriété intellectuelle, responsabilité et droit applicable."
        : "Politique de confidentialité du site d'Hervé Nanfang : données collectées, finalités, durée de conservation, droits et sécurité.",
    path: c.path,
    jsonLd: breadcrumbSchema([
      { name: 'Accueil', path: '/' },
      { name: c.title, path: c.path },
    ]),
  })

  return (
    <>
      <PageHero breadcrumb={c.title} eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      <Section tone="dark">
        <div className="max-w-3xl">
          {c.blocks.map((b, i) => (
            <Reveal key={b.h} delay={i * 50}>
              <div className="border-b border-white/8 py-9 last:border-0">
                <Display size="sm" as="h2" className="text-ivory">
                  {b.h}
                </Display>
                <div className="mt-5 space-y-4">
                  {b.p.map((para) => (
                    <Body key={para}>{para}</Body>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <Rule className="mt-12" />
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-ivory/30">
            Document à valider juridiquement avant mise en ligne publique.
          </p>
        </div>
      </Section>
    </>
  )
}
