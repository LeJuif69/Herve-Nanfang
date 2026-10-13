/**
 * Le Journal du Musicien Augmenté — série fondatrice « Après la MAO, l'IA »
 * ============================================================================
 * Sept piliers SEO. Chaque pilier porte :
 *   • un angle éditorial assumé (pas un résumé d'outils) ;
 *   • un plan structuré ;
 *   • un public identifié (`audience`) ;
 *   • un renvoi systématique vers la chaîne de conversion :
 *     Hervé Nanfang → Musicien Augmenté™ → autres contenus → formation/contact.
 */

export type ArticleStatus = 'Publié' | 'En cours' | 'Planifié'

export type Article = {
  slug: string
  num: string
  category: string
  title: string
  excerpt: string
  readingTime: string
  status: ArticleStatus
  /** À qui l'article est destiné — affiché en tête d'article */
  audience: string
  /** Sous-titres : structure éditoriale prévue pour l'article */
  outline: string[]
  /** Texte intégral, lorsqu'il est prêt pour relecture ou publication */
  body?: { heading: string; paragraphs: string[] }[]
  keywords: string[]
  /** Concept ou page du site vers lesquels l'article renvoie naturellement */
  linkedConcept: { label: string; to: string }
  /** Titre SEO propre à l'article — ≤ 60 caractères, jamais tronqué dans Google */
  seoTitle: string
  /** Meta description propre à l'article — 120 à 165 caractères */
  seoDescription: string
}

export const CATEGORIES = [
  'Musique',
  'IA',
  'MAO',
  'Pédagogie',
  'Culture',
  'Technologie',
  'Entrepreneuriat',
  'Communication digitale',
  'Réflexions',
]

export const ARTICLES: Article[] = [
  {
    slug: 'apres-la-mao-lia',
    num: '01',
    category: 'IA',
    title:
      'Après la MAO, l’IA : comment les musiciens peuvent évoluer sans perdre leur identité',
    excerpt:
      'La MAO n’a pas supprimé le musicien. Elle a transformé ce qu’il devait savoir faire. L’IA ouvre une nouvelle étape : celle où le musicien doit apprendre à collaborer avec la machine sans lui abandonner son jugement, sa culture et sa voix.',
    readingTime: '7 min',
    status: 'Publié',
    audience:
      'Musiciens professionnels et semi-professionnels, enseignants, étudiants avancés — toute personne qui sent que son métier change.',
    linkedConcept: { label: 'Musicien Augmenté™', to: '/ia-technologie#musicien-augmente' },
    outline: [
      'La MAO comme précédent historique',
      'L’IA et le déplacement de la décision',
      'L’identité artistique',
      'La délégation maîtrisée',
      'La méthode en cinq étapes',
      'Le concept de Musicien Augmenté™',
    ],
    body: [
      {
        heading: 'La MAO comme précédent historique',
        paragraphs: [
          'J’ai d’abord abordé l’intelligence artificielle avec réticence. J’avais déjà vécu la transition vers la musique assistée par ordinateur, et je savais qu’un nouvel outil ne fait pas qu’ajouter une fonction : il change les habitudes de travail, les compétences attendues et la place du musicien dans la production. Cette expérience m’a rendu prudent. Elle m’a aussi appris à me méfier des réponses toutes faites, qu’elles annoncent la fin du métier ou un progrès automatique.',
          'La MAO a rapproché l’enregistrement, l’édition, le séquençage et le traitement du son du poste de travail du musicien. Elle a ouvert des possibilités, mais elle n’a pas supprimé le besoin d’écouter, de choisir, d’interpréter et de construire une direction. Elle a transformé une partie du travail ; elle n’a pas rendu le jugement musical superflu.',
          'Dans mon environnement musical au Cameroun, les pratiques live, le rapport à l’instrument et la transmission orale rappellent que le savoir musical ne se résume pas à manipuler un logiciel. Les conditions économiques comptent aussi : le coût d’un outil, le temps nécessaire pour le maîtriser et son utilité réelle font partie de la décision. Ce constat n’uniformise pas les parcours ; il m’oblige à parler de technologie à partir de pratiques et de contraintes concrètes, pas d’un récit abstrait du progrès.',
        ],
      },
      {
        heading: 'L’IA et le déplacement de la décision',
        paragraphs: [
          'Les outils d’intelligence artificielle peuvent aujourd’hui aider à explorer des pistes, organiser de l’information, produire des variantes, transcrire ou préparer des contenus. Selon l’outil et la tâche, le résultat peut être utile, incomplet ou faux. Le changement important n’est donc pas seulement la vitesse : certaines propositions qui demandaient auparavant une suite d’opérations techniques arrivent désormais sous une forme directement écoutable ou lisible.',
          'C’est là que se joue, à mes yeux, le changement décisif : la machine ne fait pas que faciliter une opération, elle peut formuler des propositions qui ressemblent déjà à des choix. Demander des variantes n’est pas choisir une esthétique. Générer un accompagnement n’est pas comprendre ce qu’il raconte dans un contexte donné. Le musicien doit établir le cadre, évaluer les propositions, les transformer ou les refuser, puis assumer ce qui sera présenté au public.',
        ],
      },
      {
        heading: 'L’identité artistique',
        paragraphs: [
          'Une identité artistique ne tient pas à une couleur sonore que l’on pourrait copier. Elle se construit dans le répertoire choisi, les références mobilisées, le rapport à l’instrument, la manière de travailler avec d’autres personnes et les décisions prises face à une situation précise. Sur scène, l’interprète adapte son jeu au lieu, au public et au moment. En studio, il arbitre entre l’intention, les prises disponibles, les contraintes techniques et le résultat recherché.',
          'Pour moi, protéger une identité ne consiste pas à défendre abstraitement « l’humain ». Il faut nommer ce qui porte une signature : les décisions, les connaissances musicales et culturelles, l’écoute et la relation. Quelles tâches sont répétitives sans être déterminantes ? Quelles compétences sont nécessaires pour juger le résultat ? La réponse dépend de la pratique de chacun ; c’est précisément pourquoi aucun outil ne peut décider seul de ce qu’un musicien devrait lui déléguer.',
        ],
      },
      {
        heading: 'La délégation maîtrisée',
        paragraphs: [
          'Ma règle est simple : on peut déléguer une opération, pas sa responsabilité. Une adoption lucide commence par une tâche limitée. Définissez le problème avant de choisir l’outil : préparer une première structure, comparer des options, retrouver une information ou automatiser une étape répétitive. Gardez une version de référence sans assistance lorsque c’est pertinent ; vous pourrez ainsi comparer le temps gagné et la qualité réellement obtenue.',
          'Évaluez ensuite le résultat selon des critères liés au métier : précision, cohérence, caractère exploitable, respect des droits et adéquation à l’intention. Vérifiez les informations et les éléments générés. Si une œuvre, une voix, un enregistrement ou un répertoire de tiers intervient, examinez les autorisations et les conditions d’utilisation avant toute diffusion. Une réponse convaincante en apparence n’est pas une preuve de fiabilité ni une autorisation.',
          'Enfin, décidez ce qui sera conservé, modifié ou écarté. Si l’outil a contribué à un résultat remis à un client, à un partenaire ou au public, demandez-vous si cette contribution doit être explicitée. La transparence dépend du contexte, des engagements pris et des règles applicables ; elle ne se remplace pas par une formule universelle.',
        ],
      },
      {
        heading: 'Une méthode en cinq étapes',
        paragraphs: [
          '1. Partez d’un besoin concret, pas d’une nouveauté logicielle.',
          '2. Délimitez la tâche et les données que vous êtes autorisé à utiliser.',
          '3. Testez l’outil sur un cas maîtrisé et conservez un point de comparaison.',
          '4. Vérifiez le résultat avec vos critères musicaux, pédagogiques ou professionnels.',
          '5. Décidez de poursuivre, de modifier le processus ou d’arrêter, puis consignez ce que le test vous a appris.',
          'Cette méthode ne garantit ni un gain de temps ni un meilleur résultat. Elle permet de le vérifier au lieu de le supposer. Un outil peut être adapté à une tâche et inutile pour une autre ; il peut aussi cesser de convenir si ses conditions, ses coûts ou ses usages changent. L’évaluation doit donc rester attachée au besoin réel.',
        ],
      },
      {
        heading: 'Musicien Augmenté™ : ma proposition',
        paragraphs: [
          'J’appelle cette proposition Musicien Augmenté™ : une pratique dans laquelle l’intelligence artificielle peut étendre les capacités du musicien — son temps, son analyse, son exploration ou sa diffusion — sans lui retirer la décision artistique, la responsabilité ni le rapport au public. Ce n’est ni un catalogue d’outils ni une promesse d’augmentation sans limite. C’est un cadre pour décider ce que l’on délègue et pourquoi.',
          'Après la MAO, l’IA ne commande ni le rejet systématique ni l’adoption enthousiaste. Elle appelle une compétence supplémentaire : formuler une demande, examiner une proposition, connaître les limites de l’outil et décider en professionnel. Ma position tient en une phrase : la technologie peut participer au travail ; elle ne doit pas prendre la place du musicien qui en fixe le sens.',
          'Préserver ce jugement ne garantit toutefois ni les commandes ni les revenus. Certaines tâches peuvent être automatisées et la valeur redistribuée sans revenir au musicien. C’est la question du pilier suivant : examiner ce qui change dans les métiers musicaux et qui supporte le coût de cette transformation.',
        ],
      },
    ],
    keywords: ['IA et musique', 'MAO', 'musicien augmenté', 'adoption IA musicien'],
    seoTitle: "Après la MAO, l’IA : adopter l’IA sans perdre son identité",
    seoDescription: "La MAO n’a pas détruit les musiciens : elle a redistribué les compétences. Méthode en cinq étapes pour adopter l’IA sans diluer sa voix d’artiste.",
  },
  {
    slug: 'ia-va-t-elle-remplacer-les-musiciens',
    num: '02',
    category: 'IA',
    title: 'L’IA va-t-elle remplacer les musiciens ?',
    excerpt:
      'L’IA peut automatiser certaines tâches et fragiliser des revenus, mais elle ne transforme pas tous les métiers musicaux de la même manière. Pour comprendre le risque, il faut regarder le travail réel, pas répondre par un slogan.',
    readingTime: '8 min',
    status: 'En cours',
    audience:
      'Musiciens inquiets, institutions culturelles, parents et étudiants qui cherchent une réponse argumentée plutôt qu’un slogan.',
    linkedConcept: { label: 'Les sept thèses du manifeste', to: '/ia-technologie#manifeste' },
    outline: [
      'Une question sur les métiers, pas sur une machine unique',
      'Quatre dimensions du travail musical',
      'La valeur se déplace, sans garantie de transfert',
      'Photographie et streaming : des analogies limitées',
      'Agir sans croire aux recettes miracles',
    ],
    body: [
      {
        heading: 'Une question sur les métiers, pas sur une machine unique',
        paragraphs: [
          '« L’IA va-t-elle remplacer les musiciens ? » La question est compréhensible, mais elle regroupe des métiers et des situations très différents : composer, accompagner, jouer en public, enregistrer, produire, enseigner ou concevoir un événement. Il n’existe pas un seul système d’IA, pas une seule demande musicale et pas une seule définition du travail d’un musicien.',
          'Les outils peuvent générer des propositions sonores, transformer un enregistrement, assister la transcription ou accélérer certaines opérations. Dans des contextes où un commanditaire cherche un résultat fonctionnel, rapide et peu coûteux, une production automatisée peut remplacer une commande qui aurait auparavant été rémunérée. Il faut le reconnaître : l’automatisation peut modifier les revenus et les occasions de travail, pas seulement les outils utilisés.',
          'Mais la capacité à produire un résultat n’équivaut pas à remplacer toutes les fonctions d’un musicien. Le risque dépend de la tâche, du niveau de qualité attendu, du contexte, du prix, de la fiabilité et des choix du client. La question utile est donc plus précise : quelle partie du travail change, qui choisit l’outil, et qui gagne ou perd dans cette transformation ?',
        ],
      },
      {
        heading: 'Quatre dimensions du travail musical',
        paragraphs: [
          'Les quatre dimensions qui suivent décrivent le travail musical, et non les axes par lesquels une technologie peut l’augmenter. La première est l’exécution : jouer, chanter, enregistrer, éditer ou produire un élément sonore. Des systèmes peuvent générer ou transformer certains résultats. Cela peut répondre à une demande simple ; cela ne garantit pas que le résultat convienne à chaque œuvre, interprète ou contexte.',
          'La deuxième est la préparation : organiser un répertoire, transcrire, comparer des options, préparer une répétition ou traiter des tâches répétitives. Des outils peuvent aider, mais la vérification demeure nécessaire. Une transcription approximative, une information erronée ou une proposition techniquement irréalisable peut déplacer le travail plutôt que le supprimer.',
          'La troisième est le jugement artistique : définir une intention, choisir une direction, reconnaître ce qui sert l’œuvre et décider ce qui sera retenu. Une IA peut produire ou classer des options ; le musicien doit encore les évaluer en fonction du projet et répondre de la décision. La quatrième dimension est la relation située : travailler avec un public, un élève, un ensemble, un commanditaire ou une équipe, dans un lieu et à un moment précis. La technologie peut y contribuer, mais la production d’un fichier n’est pas, à elle seule, l’ensemble de cette relation.',
          'Ces dimensions se combinent. Une prestation peut demander à la fois technique, écoute, adaptation et responsabilité ; une commande peut n’en rémunérer qu’une partie. Elles servent à analyser une activité, pas à garantir qu’une fonction humaine restera toujours protégée du marché.',
        ],
      },
      {
        heading: 'La valeur se déplace, sans garantie de transfert',
        paragraphs: [
          'Quand une opération devient plus facile ou moins coûteuse, la demande peut augmenter, diminuer ou se déplacer. Rien ne garantit que le temps économisé sera rendu au musicien, ni qu’une nouvelle activité compensera les missions qui se raréfient. Les effets dépendent des contrats, des usages, des habitudes des clients et du pouvoir de négociation de chacun.',
          'Les productions fonctionnelles, standardisées et peu différenciées peuvent être exposées lorsque le commanditaire ne demande qu’un fond sonore ou un résultat répondant à un brief générique. Cela ne signifie pas que toute musique de commande va disparaître. Cela invite à examiner quelles dimensions du travail sont distinctives, comment elles sont présentées et si elles sont réellement rémunérées.',
          'La technique seule ne protège personne. Développer une signature, une capacité d’adaptation, une expertise de production, de transmission ou de direction artistique peut rendre une offre plus lisible ; ce n’est ni une garantie de contrat ni une solution individuelle aux enjeux collectifs de droits, de consentement et de rémunération.',
        ],
      },
      {
        heading: 'Photographie et streaming : des analogies limitées',
        paragraphs: [
          'La photographie numérique montre qu’une technologie peut rendre certaines opérations plus accessibles, augmenter le nombre de productions et modifier les attentes des clients. Les photographes n’ont pas disparu, mais les pratiques et les marchés se sont transformés de façon inégale. Cette histoire aide à poser des questions ; elle ne prédit pas le devenir de la musique.',
          'Le streaming a profondément changé l’accès et la distribution des enregistrements, sans supprimer la création musicale. Il a aussi déplacé les conditions économiques de la diffusion. L’IA générative ajoute une autre différence : elle peut intervenir dans la production même de contenus qui concurrencent des travaux humains. On ne peut donc pas transposer directement les effets du streaming à l’IA.',
          'Ces précédents rappellent surtout qu’un changement technique ne répartit pas automatiquement ses bénéfices de manière équitable. Il faut observer qui contrôle les outils, qui détient les droits, qui touche les revenus et quelles possibilités restent ouvertes aux musiciens.',
        ],
      },
      {
        heading: 'Agir sans croire aux recettes miracles',
        paragraphs: [
          'Un musicien peut commencer par décrire ses missions et repérer où une assistance serait utile, où elle demanderait trop de corrections, et où le jugement ou la relation sont essentiels. Un test doit avoir un objectif clair : comparer le temps total, la qualité obtenue, le coût, les conditions d’utilisation et l’effet sur la manière de travailler. Si le résultat ne répond pas au besoin, ne pas adopter l’outil est aussi une décision professionnelle.',
          'Il est également utile de rendre explicite ce que l’on apporte : interprétation, direction, répertoire, écoute, expertise technique ou pédagogie. Cette clarté aide à cadrer une prestation, sans promettre qu’elle suffira à préserver un revenu. Les décisions individuelles doivent s’accompagner de règles collectives concernant les œuvres utilisées pour entraîner les systèmes, le consentement, l’attribution et la rémunération.',
          'Je ne réponds donc ni par un non rassurant ni par un oui général. Certaines tâches et certaines commandes peuvent être automatisées ; certains revenus seront mis sous pression. La responsabilité artistique ne protège pas à elle seule un marché. La question qui reste ouverte est économique et collective : qui contrôle les outils, qui capte la valeur créée et quelles règles protègent les personnes dont le travail alimente ces systèmes ?',
        ],
      },
    ],
    keywords: ['IA remplace musiciens', 'avenir musicien', 'musique et intelligence artificielle'],
    seoTitle: "L’IA va-t-elle remplacer les musiciens ? — analyse",
    seoDescription: 'L’IA peut automatiser certaines tâches musicales et fragiliser des revenus. Analyse du travail, des fonctions du métier et des transformations économiques.',
  },
  {
    slug: 'musicien-augmente-definition',
    num: '03',
    category: 'Réflexions',
    title: 'Musicien augmenté : définition, enjeux et perspectives',
    excerpt:
      'Musicien Augmenté™ ne désigne ni un logiciel ni une promesse de productivité illimitée. C’est un cadre pour utiliser l’IA afin d’étendre les capacités du musicien sans lui retirer le jugement, la responsabilité ou la relation au public.',
    readingTime: '5 min',
    status: 'En cours',
    audience:
      'Décideurs culturels, directions pédagogiques et musiciens qui veulent un cadre clair avant d’investir du temps ou du budget.',
    linkedConcept: { label: 'Le manifeste Musicien Augmenté™', to: '/ia-technologie#musicien-augmente' },
    outline: [
      'Augmenter ≠ automatiser',
      'Quatre axes : temps, analyse, exploration, diffusion',
      'Ce que « Musicien Augmenté™ » n’est pas',
      'Cinq principes de travail',
      'Une définition à éprouver',
    ],
    body: [
      {
        heading: 'Augmenter ne veut pas dire automatiser',
        paragraphs: [
          'Le mot « augmenté » peut laisser croire qu’il suffirait d’ajouter une technologie pour devenir plus compétent, plus créatif ou plus efficace. Ce n’est pas le sens que je lui donne. Un outil peut accélérer une opération ou ouvrir des pistes ; il ne transforme pas automatiquement ces possibilités en savoir-faire. Il faut encore comprendre le problème, juger le résultat et décider de ce qu’on en fait.',
          'Musicien Augmenté™ désigne une pratique professionnelle dans laquelle l’intelligence artificielle peut étendre les capacités du musicien — son temps, son analyse, son exploration et sa diffusion — tandis que la décision artistique, la responsabilité et le rapport au public restent humains. Le concept porte donc autant sur les limites posées que sur les usages autorisés.',
        ],
      },
      {
        heading: 'Quatre axes d’augmentation',
        paragraphs: [
          'Ces quatre axes décrivent les capacités que l’IA peut étendre ; ils ne classent pas les dimensions du métier examinées dans le pilier précédent. Le premier axe est le temps. Une assistance peut réduire certaines tâches répétitives : organiser des notes, préparer une première structure ou retrouver une information. Le gain doit être mesuré dans le travail réel, corrections comprises. Un outil qui fait produire plus vite mais impose beaucoup de vérifications ne libère pas nécessairement du temps.',
          'Le deuxième axe est l’analyse. Des outils peuvent aider à comparer, classer ou résumer des matériaux. Ils fournissent un appui, pas une interprétation définitive. En musique comme en pédagogie, l’analyse n’a de valeur que si le professionnel peut en vérifier les éléments et les relier à son intention.',
          'Le troisième axe est l’exploration. Générer plusieurs pistes peut aider à dépasser une première idée ou à comparer des directions. L’abondance de propositions ne remplace pas le goût : il faut sélectionner, transformer, combiner ou rejeter. La capacité à dire « non, ce n’est pas cela » fait partie du travail créatif.',
          'Le quatrième axe est la diffusion. L’IA peut contribuer à adapter ou préparer des contenus destinés à différents publics et formats. Mais publier davantage ne garantit ni une audience, ni une relation, ni une rémunération. Le musicien reste responsable de ce qui est communiqué, des droits mobilisés et de la manière dont son travail est présenté.',
        ],
      },
      {
        heading: 'Ce que Musicien Augmenté™ n’est pas',
        paragraphs: [
          'Ce n’est pas une promesse selon laquelle l’IA remplacerait l’apprentissage, la pratique instrumentale, la culture musicale ou l’expérience de scène. Ce n’est pas non plus une injonction à adopter chaque nouveauté, ni un classement des musiciens selon leur maîtrise des logiciels. Une personne peut exercer un métier musical exigeant sans utiliser l’IA ; une personne équipée d’outils n’est pas, pour cette seule raison, « augmentée ».',
          'Le concept n’est pas un catalogue de produits ou une garantie de résultat. Un usage pertinent dépend d’un besoin, des compétences de la personne, des conditions techniques, du coût, des données mobilisées et du cadre juridique applicable. Un outil peut aider dans une tâche et être inadapté à une autre. Savoir renoncer fait donc partie de la méthode.',
        ],
      },
      {
        heading: 'Cinq principes de travail',
        paragraphs: [
          '1. Partir d’une intention musicale, pédagogique ou professionnelle précise, plutôt que de l’outil à la mode.',
          '2. Définir ce qui peut être assisté et ce qui reste une décision humaine : goût, interprétation, validation et responsabilité.',
          '3. Vérifier les propositions avec des critères adaptés à la tâche. Une sortie convaincante n’est pas nécessairement juste, originale ou utilisable.',
          '4. Respecter les droits, le consentement et la confidentialité des œuvres, des voix et des informations confiées à un service.',
          '5. Documenter ce qui a été essayé, ce qui a fonctionné, ce qui a échoué et pourquoi. Une méthode transmissible vaut mieux qu’une dépendance à un outil particulier.',
        ],
      },
      {
        heading: 'Un cadre à éprouver, pas un dogme',
        paragraphs: [
          'Cette définition est ma proposition de travail, pas un label à obtenir ni une doctrine universelle. Elle devra évoluer avec les pratiques, les outils et les règles qui les encadrent.',
          'Pour évaluer un usage, trois questions suffisent à commencer : quelle capacité cherche-t-on à étendre ? Quelle décision reste sous la responsabilité du musicien ? Peut-il encore vérifier, modifier ou refuser le résultat ? Si ces réponses sont floues, on ne sait pas encore si l’outil augmente la pratique ou crée une dépendance.',
        ],
      },
    ],
    keywords: ['musicien augmenté', 'IA musique', 'Musicien Augmenté'],
    seoTitle: "Musicien augmenté : définition, enjeux et perspectives",
    seoDescription: "Musicien augmenté : ce que le terme recouvre réellement, ce qu’il n’est pas, et le cadre de travail en cinq principes proposé par Hervé Nanfang.",
  },
  {
    slug: 'ia-et-musique-live',
    num: '04',
    category: 'Musique',
    title: 'IA et musique live : ce que la technologie ne doit jamais remplacer',
    excerpt:
      'Le live n’est pas une scène sans technologie : c’est une situation où les choix doivent rester adaptés au lieu, au moment et aux personnes présentes. Où placer la limite quand l’IA entre dans le jeu ?',
    readingTime: '7 min',
    status: 'En cours',
    audience:
      'Musiciens de scène, producteurs de spectacles, programmateurs de lieux et de festivals.',
    linkedConcept: { label: 'Le Pianobariste™', to: '/musique#pianobariste' },
    outline: [
      'Le direct comme épreuve de vérité',
      'Préparation assistée : répétitions, setlists, arrangements',
      'Le risque de la perfection sans présence',
      'Définir sa propre ligne rouge',
      'Évaluer l’outil à l’aune de l’expérience live',
    ],
    body: [
      {
        heading: 'Le direct comme épreuve de vérité',
        paragraphs: [
          'Le live n’a jamais signifié « sans technique ». Instrument amplifié, clavier, logiciel, séquence, sonorisation et éclairage font déjà partie de nombreuses situations de scène. La vraie question n’est donc pas de séparer une performance pure d’une performance assistée. Elle est de savoir qui prend les décisions musicales, qui répond de ce qui arrive et quelle relation est promise au public.',
          'Depuis 2007, le piano-bar live est un repère de mon parcours. Le format Le Pianobariste™ est décrit sur ce site comme une présence musicale continue, qui cherche à s’adapter au lieu, aux personnes et au moment plutôt qu’à devenir un fond sonore interchangeable. Cette exigence donne un critère concret pour examiner l’IA : aide-t-elle l’interprète à mieux écouter et choisir, ou détourne-t-elle son attention de la situation réelle ?',
          'Un système peut analyser un signal, suivre un tempo ou proposer une réponse. Cela peut être utile. Mais réagir à une mesure ne suffit pas à décider si cette réponse convient à l’ambiance, au répertoire, au volume du lieu ou au moment de la soirée. Le direct met à l’épreuve non seulement le son produit, mais aussi la capacité de l’équipe à s’ajuster et à assumer ses choix.',
        ],
      },
      {
        heading: 'Préparer avec l’IA, jouer avec discernement',
        paragraphs: [
          'La préparation offre des usages relativement faciles à délimiter. Un musicien peut demander une première proposition de setlist à partir d’une durée et d’un répertoire qu’il connaît, comparer des tonalités, organiser des notes de répétition ou explorer des pistes d’arrangement. L’outil aide à préparer ; l’artiste vérifie les morceaux, leur faisabilité, leur cohérence et leur adéquation au contexte.',
          'La même prudence s’applique aux supports de répétition et aux documents de production. Une transcription automatique peut comporter des erreurs. Une proposition harmonique peut ignorer le style recherché. Des informations confiées à un service externe peuvent être sensibles. Avant d’y déposer une maquette, une voix ou un document de client, il faut comprendre les conditions du service et disposer des autorisations nécessaires.',
          'Sur scène, les contraintes changent : latence, connexion, retours audio, panne, bruit ambiant et attention du musicien comptent immédiatement. Tout dispositif qui intervient pendant la prestation doit être essayé dans des conditions proches du réel, disposer d’un mode de secours et ne pas devenir un point de défaillance que personne ne sait reprendre. Une démonstration réussie en répétition n’est pas une garantie pour chaque salle.',
        ],
      },
      {
        heading: 'Le risque d’une perfection sans présence',
        paragraphs: [
          'Une production peut être propre, régulière et techniquement convaincante, sans pour autant répondre à la situation. Le risque n’est pas que la perfection soit mauvaise en soi. C’est de la confondre avec la pertinence : le bon arrangement au mauvais volume, une transition impeccable au mauvais moment ou une suite de morceaux qui ne laisse aucune place à l’écoute peuvent rendre la prestation moins vivante.',
          'La présence ne se mesure pas à l’improvisation permanente. Elle apparaît dans des décisions parfois discrètes : prolonger un morceau, laisser un silence, simplifier un passage, changer de registre ou s’arrêter. Des outils peuvent aider à préparer ces choix. Ils ne doivent pas enfermer l’interprète dans un déroulé qu’il ne peut plus adapter.',
          'Il faut aussi surveiller l’attention. Si le musicien doit regarder sans cesse un écran, contrôler des consignes ou réparer un système, il risque de moins écouter ses partenaires et le public. Une technologie qui libère une tâche mais capte toute l’attention n’a peut-être pas amélioré le live.',
        ],
      },
      {
        heading: 'Définir sa ligne rouge avant la prestation',
        paragraphs: [
          'Ma ligne rouge n’est pas « aucune technologie sur scène ». Elle tient à quatre questions. Quelle fonction précise le système remplit-il ? Quelles décisions restent sous le contrôle de l’interprète ? Les œuvres, voix et données utilisées le sont-elles dans un cadre autorisé ? Que se passe-t-il si le dispositif tombe en panne ou si la situation demande une autre réponse ?',
          'Cette ligne peut autoriser l’IA à aider à préparer un répertoire, organiser les répétitions ou tester une idée d’arrangement. Elle peut aussi permettre un outil technique en concert s’il est maîtrisé, annoncé lorsque cela change la nature de la prestation, et réversible. En revanche, je ne veux pas qu’un système prenne silencieusement la place d’une interprétation humaine promise, utilise une voix ou une œuvre sans autorisation, ou empêche le musicien de répondre à ce qui se passe.',
          'Avant le concert, décrivez le rôle de l’outil et son mode de secours. Après, évaluez non seulement la qualité du son, mais aussi le temps gagné, l’attention disponible, les ajustements possibles et la réaction au contexte. Si l’assistance a réduit la capacité d’écoute ou n’a pas servi l’intention, il faut pouvoir la retirer.',
        ],
      },
      {
        heading: 'La technologie au service de l’expérience live',
        paragraphs: [
          'Pour moi, la technologie est bienvenue lorsqu’elle soutient la préparation et laisse au musicien la possibilité d’écouter, de choisir et de changer de direction. Dans le live, la réussite ne se limite pas à produire un fichier ou à exécuter un plan : elle dépend aussi d’une présence, d’un contexte et d’une responsabilité partagée avec le public et l’équipe.',
          'Le Musicien Augmenté™ ne cherche donc pas à automatiser la scène. Il cherche à employer les outils avec discernement pour mieux servir l’expérience musicale. Mon critère final est simple : l’interprète doit pouvoir écouter, adapter et interrompre l’assistance sans perdre la maîtrise de la prestation. Dans ce contexte, une technologie utile est celle qu’on peut aussi retirer.',
        ],
      },
    ],
    keywords: ['IA musique live', 'concert technologie', 'piano-bar'],
    seoTitle: "IA et musique live : ce que la technologie ne remplace pas",
    seoDescription: 'Au live, l’IA peut soutenir la préparation et la scène. Comment garder la décision musicale, l’écoute du public, les droits et une solution de secours.',
  },
  {
    slug: '5-facons-ia-carriere-musicien',
    num: '05',
    category: 'Entrepreneuriat',
    title: '5 façons dont un musicien peut utiliser l’IA dans sa carrière',
    excerpt:
      'Des usages concrets, immédiatement applicables : création, communication, organisation, facturation, veille. Sans gadget, sans dépendance.',
    readingTime: '10 min',
    status: 'Publié',
    audience:
      'Musiciens indépendants, intermittents et jeunes professionnels qui gèrent seuls leur activité.',
    linkedConcept: { label: 'Formats de formation', to: '/ia-technologie#formats' },
    outline: [
      '1. Idéation musicale et sortie du blocage',
      '2. Communication et contenu (le bon dosage)',
      '3. Organisation, planning, contrats et factures',
      '4. Veille et recherche sur son marché',
      '5. Formation continue personnalisée',
    ],
    body: [
      {
        heading: '1. Idéation musicale et sortie du blocage',
        paragraphs: [
          'Le blocage de la feuille blanche est une réalité que tout compositeur ou arrangeur a rencontrée. L’IA n’a pas vocation à composer à la place de l’artiste, mais elle peut agir comme un stimulant créatif : suggérer des suites d’accords inattendues, générer des contraintes stylistiques arbitraires, ou proposer des variations de tempo et de métrique.',
          'En pratique, le musicien utilise l’outil pour tester rapidement dix embranchements harmoniques en deux minutes. Il ne garde que ce qui résonne avec son intention intime, jette le reste, et réinjecte son toucher instrumental. L’outil agit comme un miroir déformant qui force l’oreille à réagir et à choisir.',
        ],
      },
      {
        heading: '2. Communication et contenu : le bon dosage',
        paragraphs: [
          'Un musicien indépendant passe aujourd’hui une part disproportionnée de son temps à rédiger : biographies d’artiste, notes de programme pour un concert, dossiers de presse pour des programmateurs, ou légendes de réseaux sociaux. C’est souvent une corvée chronophage qui empiète sur les heures de répétition.',
          'L’IA permet de structurer un premier jet en quelques secondes à partir de faits bruts. La règle est de ne jamais publier sans réécrire : ajuster le ton, injecter sa voix authentique et vérifier chaque mention. Le gain de temps est alors réel : l’artiste passe moins de temps devant l’écran et plus de temps sur son instrument.',
        ],
      },
      {
        heading: '3. Organisation, planning, contrats et factures',
        paragraphs: [
          'L’entrepreneuriat musical exige une rigueur administrative que les conservatoires n’enseignent que rarement. Établir des devis clairs, suivre des relances clients, rédiger des fiches de cession de droits ou des clauses de prestation pour un mariage ou une soirée privée relève souvent du casse-tête.',
          'En fournissant des modèles de correspondances professionnelles et en aidant à chiffrer les temps d’installation et de déplacement, les modèles de langage aident le musicien à se professionnaliser. Une gestion saine protège la rémunération et confère une crédibilité immédiate auprès des organisateurs d’événements.',
        ],
      },
      {
        heading: '4. Veille et recherche sur son marché',
        paragraphs: [
          'Comprendre son écosystème est une condition de survie pour tout créateur : quels festivals programment du jazz acoustique ? Quelles fondations soutiennent la préservation des patrimoines musicaux ? Quels sont les tarifs moyens pratiqués dans l’hôtellerie de luxe pour une animation piano-bar ?',
          'L’IA facilite la synthèse d’informations dispersées et la préparation de listes de prospection ciblées. Elle permet au musicien de cartographier ses opportunités au lieu d’attendre passivement que le téléphone sonne.',
        ],
      },
      {
        heading: '5. Formation continue personnalisée',
        paragraphs: [
          'Un musicien ne cesse jamais d’apprendre : approfondir une grille harmonique de bebop, comprendre le fonctionnement d’un compresseur multibande en MAO, ou décortiquer un système modal particulier.',
          'L’IA devient un tuteur disponible en permanence, capable d’expliquer un concept théorique complexe avec des analogies sur mesure. Ce compagnonnage intellectuel accélère l’assimilation, à condition de toujours valider la théorie par la pratique concrète sur l’instrument.',
        ],
      },
    ],
    keywords: ['IA musicien carrière', 'outils IA musique', 'productivité musicien'],
    seoTitle: "5 façons d’utiliser l’IA dans sa carrière de musicien",
    seoDescription: "Création, communication, organisation, veille, formation : cinq usages concrets de l’IA pour un musicien indépendant, sans gadget et sans dépendance.",
  },
  {
    slug: 'ia-mao-creation-musicale',
    num: '06',
    category: 'MAO',
    title: 'IA, MAO et création musicale : vers une nouvelle génération de musiciens',
    excerpt:
      'Deux vagues technologiques, un même mouvement : l’outil se rapproche de la décision créative. Ce que cela exige des musiciens qui arrivent maintenant.',
    readingTime: '13 min',
    status: 'Publié',
    audience:
      'Écoles de musique, enseignants en MAO, étudiants et musiciens qui construisent leur pratique aujourd’hui.',
    linkedConcept: { label: 'Formations & MAO', to: '/pedagogie#formations' },
    outline: [
      '1985 : le studio s’installe dans la chambre',
      '2005 : la distribution devient gratuite',
      '2023 : la décision créative est assistée',
      'Ce qu’une école doit enseigner en plus, désormais',
      'Préparer la quatrième vague',
    ],
    body: [
      {
        heading: '1985 : le studio s’installe dans la chambre',
        paragraphs: [
          'L’apparition de la norme MIDI au milieu des années 1980 a marqué la première grande fracture : pour la première fois, un synthétiseur pouvait dialoguer avec un ordinateur. Les premiers séquenceurs et échantillonneurs numériques ont suscité une vive inquiétude chez les musiciens de séance, craignant d’être rayés de la carte par des boîtes à rythmes.',
          'L’histoire a montré que le métier ne s’est pas éteint : il s’est transformé. Le home-studio a permis à des compositeurs indépendants de produire des maquettes sophistiquées chez eux, redistribuant les cartes de la création musicale.',
        ],
      },
      {
        heading: '2005 : la distribution devient gratuite',
        paragraphs: [
          'Vingt ans plus tard, la compression MP3 et l’avènement des plateformes de partage ont ouvert la deuxième vague. Le goulot d’étranglement n’était plus l’enregistrement, mais la diffusion. Tout le monde pouvait enregistrer un album sur un ordinateur portable et le mettre en ligne instantanément.',
          'Cette surabondance a révélé une leçon cruciale : lorsque la technique devient universellement accessible, la valeur se déplace vers l’identité, la voix singulière et la capacité à fédérer une communauté réelle autour d’un propos artistique fort.',
        ],
      },
      {
        heading: '2023 : la décision créative est assistée',
        paragraphs: [
          'Nous vivons aujourd’hui la troisième vague avec l’IA générative. La machine ne se contente plus de capturer ou de mixer du son : elle formule des propositions esthétiques complètes à partir d’une consigne textuelle. Elle génère des voix, des arrangements et des orchestrations entières.',
          'Cette proximité avec la décision créative exige du musicien une lucidité nouvelle. Déléguer la génération n’est pas déléguer le discernement. Savoir dire ce qui est juste, ce qui sonne creux, ce qui émeut et ce qui relève du cliché devient la compétence reine.',
        ],
      },
      {
        heading: 'Ce qu’une école doit enseigner en plus, désormais',
        paragraphs: [
          'Former un musicien aujourd’hui ne peut plus se limiter à la maîtrise d’une station audionumérique (DAW) ou à la virtuosité digitale. Les conservatoires et centres de formation doivent impérativement intégrer l’éducation à l’oreille critique, la compréhension des modèles algorithmiques, l’éthique de la propriété intellectuelle et la direction artistique.',
          'Plus l’outil est automatisé, plus l’élève doit posséder des bases harmoniques et acoustiques solides pour ne pas être le spectateur passif de logiciels propriétaires.',
        ],
      },
      {
        heading: 'Préparer la quatrième vague : l’hybridation live',
        paragraphs: [
          'L’avenir n’appartient ni aux technophobes nostalgiques ni aux adeptes aveugles du tout-automatisé. Il appartient aux musiciens hybrides : ceux qui maîtrisent leur instrument sur scène avec une présence charnelle incontestable, tout en sachant mobiliser les systèmes d’IA comme des extensions de leur imagination en studio.',
          'C’est précisément la mission du Musicien Augmenté™ : préserver l’âme vivante de l’artiste au cœur des révolutions technologiques.',
        ],
      },
    ],
    keywords: ['MAO et IA', 'création musicale IA', 'nouvelle génération musiciens'],
    seoTitle: "IA, MAO et création musicale : la nouvelle génération",
    seoDescription: "De 1985 à aujourd’hui, deux vagues technologiques ont déplacé la décision créative. Ce que cela exige des musiciens et des écoles qui les forment.",
  },
  {
    slug: 'musiciens-africains-et-ia',
    num: '07',
    category: 'Culture',
    title: 'Pourquoi les musiciens africains doivent comprendre l’intelligence artificielle',
    excerpt:
      "Ne pas comprendre l'IA, c'est accepter que d'autres modélisent et monétisent nos cultures. Une question de souveraineté autant que de technique.",
    readingTime: '11 min',
    status: 'Publié',
    audience:
      'Institutions culturelles africaines, artistes, chercheurs, ministères et organisations professionnelles.',
    linkedConcept: { label: 'Culture & Recherche', to: '/culture-recherche' },
    outline: [
      'Qui entraîne les modèles, avec quelles musiques ?',
      'Représentation, biais et patrimoine absent',
      'Opportunité : documenter, publier, protéger',
      'Souveraineté culturelle et outils locaux',
    ],
    body: [
      {
        heading: 'Qui entraîne les modèles, avec quelles musiques ?',
        paragraphs: [
          'Les grands modèles de fondation mondiaux ne tombent pas du ciel : ils sont entraînés sur d’immenses corpus sonores numérisés. Or, ces corpus reflètent une asymétrie historique flagrante. La musique savante occidentale tempérée et la pop anglo-saxonne y sont surreprésentées, tandis que les répertoires d’Afrique subsaharienne sont largement sous-représentés ou réduits à des étiquettes stéréotypées.',
          'Si les musiciens et musicologues africains n’interviennent pas dans ce débat, les algorithmes de demain produiront une musique standardisée qui ignorera la richesse fondamentale de nos polyrythmies, de nos modes et de nos intentions sacrées ou rituelles.',
        ],
      },
      {
        heading: 'Représentation, biais et patrimoine absent',
        paragraphs: [
          'La transmission musicale africaine a été majoritairement orale. Les trésors du Makossa, du Bikutsi, des chants rituels de l’Ouest camerounais ou des polyphonies forestières ne figurent que rarement dans des partitions normalisées ou des banques de données ouvertes.',
          'Ce silence numérique comporte un double danger : d’une part, l’oubli ou la caricature par des générateurs simplificateurs ; d’autre part, le pillage culturel sans citation ni redistribution financière par des acteurs extérieurs qui modélisent nos rythmes sans en connaître la sacralité.',
        ],
      },
      {
        heading: 'Opportunité : documenter, publier, protéger',
        paragraphs: [
          'Comprendre l’IA est d’abord une opportunité de réappropriation. Grâce aux outils d’analyse et de transcription assistée, les chercheurs et musiciens africains peuvent archiver avec une précision inédite leurs traditions orales, fixer leurs systèmes musicologiques et protéger leurs droits d’auteurs sur les plateformes globales.',
          'La documentation n’est pas une démarche muséale : c’est une arme économique. Ce qui est rigoureusement documenté et déposé ne peut pas être dépossédé en silence.',
        ],
      },
      {
        heading: 'Souveraineté culturelle et outils locaux',
        paragraphs: [
          'L’Afrique ne doit pas être un simple marché consommateur d’abonnements à des outils conçus ailleurs pour uniformiser les imaginaires. Nous devons former une génération d’ingénieurs du son, de musicologues et d’artistes capables de dialoguer avec les concepteurs de modèles, d’exiger la juste rémunération des corpus africains et d’imaginer nos propres outils d’assistance créative.',
          'La technologie doit servir la résonance de nos voix, la célébration de nos racines et l’émancipation économique de nos créateurs. C’est le sens même de notre engagement au Cameroun et sur tout le continent.',
        ],
      },
    ],
    keywords: ['IA Afrique musique', 'musiciens africains IA', 'souveraineté culturelle'],
    seoTitle: "Pourquoi les musiciens africains doivent comprendre l’IA",
    seoDescription: "Représentation, biais, patrimoine absent des corpus : comprendre l’IA est une question de souveraineté culturelle autant que de technique.",
  },
]

/**
 * Chaîne de conversion présente en fin de CHAQUE article.
 * Hervé Nanfang → Musicien Augmenté™ → autres contenus → contact / formation.
 */
export const ARTICLE_CHAIN = [
  { num: '1', label: 'Hervé Nanfang', detail: 'Parcours, compétences et vision', to: '/a-propos' },
  {
    num: '2',
    label: 'Musicien Augmenté™',
    detail: 'Le manifeste et la méthode',
    to: '/ia-technologie#musicien-augmente',
  },
  {
    num: '3',
    label: 'Les autres piliers',
    detail: 'Sept articles pour approfondir',
    to: '/journal',
  },
  {
    num: '4',
    label: 'Formation & contact',
    detail: 'Conférence, masterclass, formation, conseil',
    to: '/contact#formation',
  },
]

/** Série éditoriale du Journal */
export const JOURNAL_SERIES = [
  {
    num: 'A',
    title: 'Musicien Augmenté',
    text: 'Comprendre et utiliser l’IA dans la création musicale.',
  },
  {
    num: 'B',
    title: 'Transmission',
    text: 'Pédagogie musicale, programmes, méthodes et évaluation.',
  },
  {
    num: 'C',
    title: 'Ici et ailleurs',
    text: 'Culture, territoire, patrimoine et mondialisation.',
  },
  {
    num: 'D',
    title: 'Métier',
    text: 'Économie du musicien, organisation, communication.',
  },
]

export type JournalEntry = {
  date: string
  category: string
  title: string
  excerpt: string
  slug: string
}

/** Agenda éditorial — extensions après la série fondatrice */
export const JOURNAL_AGENDA: JournalEntry[] = [
  {
    date: 'Prochainement',
    category: 'Pédagogie',
    title: 'Évaluer la musique avec l’IA : ce qu’on mesure vraiment',
    excerpt:
      'Une évaluation techniquement possible n’est pas forcément pédagogiquement juste. Analyse critique des outils de correction automatique.',
    slug: 'evaluer-musique-ia',
  },
  {
    date: 'Prochainement',
    category: 'Communication digitale',
    title: 'Le musicien et sa marque : pourquoi le récit précède le logo',
    excerpt:
      'Avant l’identité visuelle, il y a une proposition de valeur. Méthode de positionnement pour les artistes.',
    slug: 'musicien-marque-recit',
  },
  {
    date: 'Prochainement',
    category: 'Culture',
    title: 'Transmission orale et archive numérique : un mariage à surveiller',
    excerpt:
      'Numériser n’est pas transmettre. Conditions pour que l’archive serve la culture vivante au lieu de la muséifier.',
    slug: 'transmission-orale-archive',
  },
  {
    date: 'Prochainement',
    category: 'Technologie',
    title: 'Cinq outils IA que j’utilise réellement dans ma pratique',
    excerpt:
      'Retour d’expérience sans promotion : ce qui tient, ce qui déçoit, ce qui est dangereux.',
    slug: 'cinq-outils-ia',
  },
]
