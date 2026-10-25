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
          `Le présent site est édité par Hervé Nanfang, musicologue, artiste-musicien, pédagogue et ingénieur du son, exerçant au sein de l’écosystème et via la structure de production Alaiz Creative System.`,
          `Contact général : ${SITE.phones.map((phone) => phone.display).join(' · ')} — ${SITE.city}. Contact académique & RMA : ${SITE.emailRma}.`,
          'Direction éditoriale et artistique : Hervé Nanfang. Les coordonnées d’immatriculation fiscale (RCCM / numéro de contribuable) sont délivrées sur demande pour toute contractualisation institutionnelle.',
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
          'L’ensemble des contenus de ce site — textes, méthodes pédagogiques, concepts, photographies, affiches, identités visuelles, publications et marques (notamment Le Pianobariste™, Racines Musicales Academy®, Permis de Jouer™, Musicien Augmenté™, LES ZIKOS®, Tswefap, Alaiz Creative System, Alaiz Music et Alaiz Patrimoine) — est protégé par le droit d’auteur et les traités internationaux de propriété intellectuelle.',
          'Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable d’Hervé Nanfang ou de la structure Alaiz Creative System est formellement interdite.',
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
    eyebrow: 'Données personnelles',
    path: '/confidentialite',
    lead: 'Ce site collecte le minimum de données nécessaires, dans un but explicite, sans revente ni profilage publicitaire.',
    blocks: [
      {
        h: 'Données collectées',
        p: [
          'Formulaire de contact : nom, email, structure, téléphone (facultatif), motif, date et lieu envisagés, message. Le site ne les transmet pas à un serveur et ne les stocke pas.',
          'Lettre d’information : l’adresse saisie est incluse dans un message WhatsApp prérempli. Elle n’est transmise qu’après envoi volontaire du message et n’est pas enregistrée par le site.',
          'Mesure d’audience : aucune donnée n’est exploitée à des fins publicitaires. Si un outil de mesure est activé, il sera paramétré de manière respectueuse de la vie privée et documenté ici.',
        ],
      },
      {
        h: 'Base légale et durée',
        p: [
          'Le traitement repose sur le consentement de la personne (case à cocher du formulaire) et sur l’intérêt légitime à répondre à une demande professionnelle.',
          'Les données saisies restent en mémoire de la page jusqu’à sa fermeture ou son rechargement. Le site ne conserve pas les demandes. Les messages envoyés par WhatsApp relèvent des conditions et paramètres de ce service.',
        ],
      },
      {
        h: 'Destinataires et sous-traitants',
        p: [
          'Le site ne transmet pas les demandes à un serveur tiers. Si vous choisissez d’envoyer le message prérempli, son contenu est traité par WhatsApp/Meta selon leurs conditions et leur politique de confidentialité.',
          'Aucun transfert à des fins commerciales n’est réalisé par le site.',
        ],
      },
      {
        h: 'Vos droits',
        p: [
          'Vous pouvez demander l’accès, la rectification, la limitation ou la suppression de vos données, ainsi que le retrait de votre consentement, en contactant l’éditeur via les coordonnées indiquées sur la page Contact.',
          'Une réponse sera apportée dans un délai maximum de trente jours.',
        ],
      },
      {
        h: 'Sécurité',
        p: [
          'Le site est conçu avec une séparation entre espace public et espace d’administration, une authentification pour les contenus éditoriaux et des règles d’accès restrictives sur la base de données (Row Level Security).',
          'Les validations de formulaires et de téléversements sont appliquées côté serveur lors de la mise en production.',
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
