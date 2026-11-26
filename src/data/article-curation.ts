export interface ArticleCuration {
  relatedSlugs: string[]
}

export const ARTICLE_CURATION: Record<string, ArticleCuration> = {
  'apres-la-mao-lia': {
    relatedSlugs: ['ia-va-t-elle-remplacer-les-musiciens', 'musicien-augmente-definition', 'ia-mao-creation-musicale'],
  },
  'ia-va-t-elle-remplacer-les-musiciens': {
    relatedSlugs: ['apres-la-mao-lia', 'musicien-augmente-definition', '5-facons-ia-carriere-musicien'],
  },
  'musicien-augmente-definition': {
    relatedSlugs: ['apres-la-mao-lia', 'ia-mao-creation-musicale', 'ia-droits-auteur-musique-africaine'],
  },
  'ia-et-musique-live': {
    relatedSlugs: ['piano-bar-construire-progression-musicale', 'duo-piano-voix-arrangements-tessitures-dialogue', 'sonorisation-piano-bar-equilibre-voix-clavier'],
  },
  '5-facons-ia-carriere-musicien': {
    relatedSlugs: ['travail-invisible-musicien-facturation-valeur', 'construire-marque-artistique-singuliere-ere-streaming', 'ia-va-t-elle-remplacer-les-musiciens'],
  },
  'ia-mao-creation-musicale': {
    relatedSlugs: ['apres-la-mao-lia', 'ai-music-evaluation-human-listening', 'suno-visuals-deezer-musiciens-africains'],
  },
  'musiciens-africains-et-ia': {
    relatedSlugs: ['souverainete-musicale-africaine-ia', 'ia-droits-auteur-musique-africaine', 'documenter-les-traditions-musicales-orales'],
  },
  'fela-kuti-afrobeat-revolution-musicale-politique': {
    relatedSlugs: ['le-bikutsi-au-dela-de-la-mesure', 'traduire-tradition-orale-au-clavier-rythmes-camerounais', 'documenter-les-traditions-musicales-orales'],
  },
  'musique-a-l-image-cinema-africain': {
    relatedSlugs: ['composer-pour-l-image-dramaturgie-cinema-africain', 'musiciens-africains-et-ia', 'suno-visuals-deezer-musiciens-africains'],
  },
  'methode-permis-de-jouer-pedagogie-musicale': {
    relatedSlugs: ['apprendre-accompagner-chanson-clavier', 'enseigner-la-musique-sans-enfermer-eleve', 'traduire-tradition-orale-au-clavier-rythmes-camerounais'],
  },
  'musicien-marque-recit': {
    relatedSlugs: ['construire-marque-artistique-singuliere-ere-streaming', 'travail-invisible-musicien-facturation-valeur', '5-facons-ia-carriere-musicien'],
  },
  'ia-droits-auteur-musique-africaine': {
    relatedSlugs: ['droit-auteur-ia-musique-cameroun-oapi', 'souverainete-musicale-africaine-ia', 'ai-music-evaluation-human-listening'],
  },
  'le-bikutsi-au-dela-de-la-mesure': {
    relatedSlugs: ['traduire-tradition-orale-au-clavier-rythmes-camerounais', 'documenter-les-traditions-musicales-orales', 'fela-kuti-afrobeat-revolution-musicale-politique'],
  },
  'documenter-les-traditions-musicales-orales': {
    relatedSlugs: ['traduire-tradition-orale-au-clavier-rythmes-camerounais', 'souverainete-musicale-africaine-ia', 'le-bikutsi-au-dela-de-la-mesure'],
  },
  'apprendre-accompagner-chanson-clavier': {
    relatedSlugs: ['methode-permis-de-jouer-pedagogie-musicale', 'enseigner-la-musique-sans-enfermer-eleve', 'piano-bar-construire-progression-musicale'],
  },
  'enseigner-la-musique-sans-enfermer-eleve': {
    relatedSlugs: ['methode-permis-de-jouer-pedagogie-musicale', 'apprendre-accompagner-chanson-clavier', 'traduire-tradition-orale-au-clavier-rythmes-camerounais'],
  },
  'piano-bar-construire-progression-musicale': {
    relatedSlugs: ['duo-piano-voix-arrangements-tessitures-dialogue', 'sonorisation-piano-bar-equilibre-voix-clavier', 'balance-sonore-concert-gains-retours-larsen'],
  },
  'duo-piano-voix-arrangements-tessitures-dialogue': {
    relatedSlugs: ['piano-bar-construire-progression-musicale', 'sonorisation-piano-bar-equilibre-voix-clavier', 'balance-sonore-concert-gains-retours-larsen'],
  },
  'balance-sonore-concert-gains-retours-larsen': {
    relatedSlugs: ['sonorisation-piano-bar-equilibre-voix-clavier', 'amenager-home-studio-moyens-limites-acoustique', 'duo-piano-voix-arrangements-tessitures-dialogue'],
  },
  'amenager-home-studio-moyens-limites-acoustique': {
    relatedSlugs: ['interfaces-audio-sans-souffle-home-studio', 'balance-sonore-concert-gains-retours-larsen', 'sonorisation-piano-bar-equilibre-voix-clavier'],
  },
  'travail-invisible-musicien-facturation-valeur': {
    relatedSlugs: ['economie-du-musicien-afrique-modele-hybride', 'construire-marque-artistique-singuliere-ere-streaming', 'musicien-marque-recit'],
  },
  'construire-marque-artistique-singuliere-ere-streaming': {
    relatedSlugs: ['musicien-marque-recit', 'travail-invisible-musicien-facturation-valeur', '5-facons-ia-carriere-musicien'],
  },
  'composer-pour-l-image-dramaturgie-cinema-africain': {
    relatedSlugs: ['musique-a-l-image-cinema-africain', 'fela-kuti-afrobeat-revolution-musicale-politique', 'musiciens-africains-et-ia'],
  },
  'droit-auteur-ia-musique-cameroun-oapi': {
    relatedSlugs: ['ia-droits-auteur-musique-africaine', 'souverainete-musicale-africaine-ia', 'ai-music-evaluation-human-listening'],
  },
  'traduire-tradition-orale-au-clavier-rythmes-camerounais': {
    relatedSlugs: ['le-bikutsi-au-dela-de-la-mesure', 'documenter-les-traditions-musicales-orales', 'methode-permis-de-jouer-pedagogie-musicale'],
  },
  'economie-du-musicien-afrique-modele-hybride': {
    relatedSlugs: ['travail-invisible-musicien-facturation-valeur', 'musicien-marque-recit', '5-facons-ia-carriere-musicien'],
  },
  'ai-music-evaluation-human-listening': {
    relatedSlugs: ['ia-droits-auteur-musique-africaine', 'souverainete-musicale-africaine-ia', 'apres-la-mao-lia'],
  },
  'interfaces-audio-sans-souffle-home-studio': {
    relatedSlugs: ['amenager-home-studio-moyens-limites-acoustique', 'balance-sonore-concert-gains-retours-larsen', 'sonorisation-piano-bar-equilibre-voix-clavier'],
  },
  'souverainete-musicale-africaine-ia': {
    relatedSlugs: ['musiciens-africains-et-ia', 'ia-droits-auteur-musique-africaine', 'documenter-les-traditions-musicales-orales'],
  },
  'sonorisation-piano-bar-equilibre-voix-clavier': {
    relatedSlugs: ['piano-bar-construire-progression-musicale', 'duo-piano-voix-arrangements-tessitures-dialogue', 'balance-sonore-concert-gains-retours-larsen'],
  },
  'suno-visuals-deezer-musiciens-africains': {
    relatedSlugs: ['souverainete-musicale-africaine-ia', 'ai-music-evaluation-human-listening', 'ia-droits-auteur-musique-africaine'],
  },
}
