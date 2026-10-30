/**
 * Témoignages d'élèves et partenaires — A Laiz Academy (ex-RMA)
 * Source : profil officiel et retours d'expérience
 */

export interface Testimonial {
  id: string
  name: string
  role: string
  /** ville ou pays */
  location: string
  discipline: string
  palier?: string
  body: string
  /** Initiales pour l'avatar généré */
  initials: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t01",
    name: "Sandrine M.",
    role: "Élève adulte · Cours individuels",
    location: "Yaoundé",
    discipline: "Piano",
    palier: "Palier N2 — Méthode",
    body:
      "Avant A Laiz Academy (RMA), j'avais essayé deux autres académies et j'abandonnais toujours après deux mois. Ici, pour la première fois, je comprends vraiment ce que je joue. La progression par paliers change tout : on sait exactement où on en est et où on va. J'ai joué ma première pièce complète de mémoire devant ma famille, une chose que je croyais impossible.",
    initials: "SM",
  },
  {
    id: "t02",
    name: "Emmanuel K.",
    role: "Étudiant · Programme Vacances Utiles",
    location: "Yaoundé",
    discipline: "Piano & Formation musicale",
    palier: "Palier N1 — Fondations",
    body:
      "Les 7 semaines de Vacances Utiles m'ont appris plus que mes deux années de solfège traditionnel à l'école. Le module \"Pulsation & Body\" m'a ouvert les yeux : la musique est d'abord dans le corps avant d'être sur le papier. La restitution finale, jouer devant un vrai public, était le meilleur moment de mon été.",
    initials: "EK",
  },
  {
    id: "t03",
    name: "Chloé T.",
    role: "Musicienne professionnelle",
    location: "Douala",
    discipline: "Chant & Piano",
    palier: "Palier N3 — Identité",
    body:
      "Je chante dans des groupes depuis des années, mais je n'avais aucune base harmonique solide. Le travail sur les accords enrichis au palier N3 m'a permis de penser ma ligne vocale différemment. Pour la première fois, je peux réharmoniser un standard à ma façon, pas juste reproduire ce que j'entends.",
    initials: "CT",
  },
  {
    id: "t04",
    name: "Christian A.",
    role: "Responsable pédagogique · Partenaire institutionnel",
    location: "Ngaoundéré",
    discipline: "Formation de formateurs",
    body:
      "Nous avons fait appel à A Laiz Academy pour accompagner notre équipe pédagogique dans la refonte de nos curricula. La rigueur de la méthode, la clarté des outils d'évaluation et la capacité d'adaptation au contexte camerouno-africain nous ont impressionnés. Le livret de progression est désormais utilisé dans nos trois centres.",
    initials: "CA",
  },
  {
    id: "t05",
    name: "Nathalie P.",
    role: "Parent d'élève",
    location: "Yaoundé",
    discipline: "Guitare (enfant 9 ans)",
    palier: "Palier N1 — Fondations",
    body:
      "Mon fils avait peur de se tromper et s'arrêtait à chaque fausse note. Aujourd'hui, il joue en continu, il chante en même temps et il m'explique les accords qu'il utilise. Le changement en huit mois est remarquable. La pédagogie de la RMA est bienveillante sans être permissive : c'est exactement ce que je cherchais.",
    initials: "NP",
  },
  {
    id: "t06",
    name: "Rodrigue M.",
    role: "Compositeur & arrangeur",
    location: "Bafoussam",
    discipline: "Piano & Harmonie",
    palier: "Palier N4 — Maîtrise & Scène",
    body:
      "Le palier N4 m'a confronté à ce que je n'avais jamais vraiment travaillé : jouer en formation, gérer la dynamique d'un vrai live et diriger d'autres musiciens. La soutenance du récital devant jury était exigeante, mais c'est exactement ce niveau d'exigence que je cherchais pour me professionnaliser.",
    initials: "RM",
  },
]
