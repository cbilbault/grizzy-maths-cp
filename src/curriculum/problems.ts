export interface ProblemSeed {
  unknown: 'left' | 'right' | 'whole'
  story: string
  good: string
  bad1: string
  bad2: string
  unit: string
  regulation: string
  regYes: boolean
}

export const PROBLEM_BANK: Record<string, ProblemSeed[]> = {
  p1: [
    {
      unknown: 'whole',
      story: 'Grizzy a {a} pots dans le frigo. Les Lemmings en apportent encore {b}. Combien de pots maintenant ?',
      good: 'On met ensemble les pots de Grizzy et ceux des Lemmings.',
      bad1: 'Les Lemmings ont tout mangé, il n’en reste plus.',
      bad2: 'On enlève les pots des Lemmings.',
      unit: 'pots',
      regulation: 'Y a-t-il plus de pots qu’au début ?',
      regYes: true,
    },
    {
      unknown: 'right',
      story: 'Il y avait {w} Lemmings sur le canapé. {a} sont allés dans le frigo. Combien restent sur le canapé ?',
      good: 'On enlève ceux du frigo, on cherche ceux du canapé.',
      bad1: 'On ajoute encore des Lemmings sur le canapé.',
      bad2: 'Tous les Lemmings sont partis.',
      unit: 'Lemmings',
      regulation: 'Y a-t-il moins de Lemmings sur le canapé qu’au début ?',
      regYes: true,
    },
    {
      unknown: 'left',
      story: 'Les Lemmings ont mangé {b} poissons. Il en reste {w}. Combien y en avait-il dans l’assiette de Grizzy ?',
      good: 'On cherche combien il y avait avant : les mangés plus les restants.',
      bad1: 'On enlève encore des poissons.',
      bad2: 'Grizzy n’avait aucun poisson.',
      unit: 'poissons',
      regulation: 'Y avait-il plus de poissons au début qu’à la fin ?',
      regYes: true,
    },
    {
      unknown: 'whole',
      story: '{a} Lemmings sont derrière la télé. {b} Lemmings sont sous le tapis. Combien de Lemmings se cachent ?',
      good: 'On réunit les deux cachettes.',
      bad1: 'On compare les deux cachettes.',
      bad2: 'On enlève ceux du tapis.',
      unit: 'Lemmings',
      regulation: 'Le total est-il plus grand que chaque cachette ?',
      regYes: true,
    },
    {
      unknown: 'right',
      story: 'Grizzy avait {w} noisettes. Il en donne {a} à She-Bear. Combien lui en reste-t-il ?',
      good: 'On retire les noisettes données.',
      bad1: 'She-Bear lui en donne encore.',
      bad2: 'On additionne les noisettes.',
      unit: 'noisettes',
      regulation: 'Grizzy a-t-il moins de noisettes qu’avant ?',
      regYes: true,
    },
  ],
  p2: [
    {
      unknown: 'whole',
      story: 'Dans une caisse il y a {a} pots. Dans l’autre, {b}. Combien de pots en tout ?',
      good: 'On ajoute les deux caisses.',
      bad1: 'On garde seulement la plus grande caisse.',
      bad2: 'On retire une caisse.',
      unit: 'pots',
      regulation: 'Le tout est-il plus grand que chaque caisse ?',
      regYes: true,
    },
    {
      unknown: 'right',
      story: 'Grizzy a {w} euros. Un pot coûte {a} euros. Combien lui reste-t-il ?',
      good: 'On retire le prix du pot.',
      bad1: 'On ajoute le prix du pot.',
      bad2: 'Le pot est gratuit.',
      unit: 'euros',
      regulation: 'Lui reste-t-il moins que {w} euros ?',
      regYes: true,
    },
  ],
  p3: [
    {
      unknown: 'right',
      story: 'Il y avait {w} Lemmings dans le grenier. {a} sont descendus. Combien restent en haut ?',
      good: 'On retire ceux qui sont descendus.',
      bad1: 'On ajoute encore des Lemmings.',
      bad2: 'Tout le grenier est vide.',
      unit: 'Lemmings',
      regulation: 'Y en a-t-il moins qu’au départ dans le grenier ?',
      regYes: true,
    },
    {
      unknown: 'whole',
      story: 'Grizzy range {a} cubes puis encore {b} cubes. Combien a-t-il rangés ?',
      good: 'On réunit les deux tas.',
      bad1: 'On compare les deux tas.',
      bad2: 'On jette les cubes.',
      unit: 'cubes',
      regulation: 'Le total est-il plus grand que {a} ?',
      regYes: true,
    },
  ],
  p4: [
    {
      unknown: 'whole',
      story: 'Sur le canapé : {a} Lemmings. {b} autres montent. Combien maintenant ? Puis 2 redescendent au prochain écran… d’abord le tout.',
      good: 'D’abord on ajoute ceux qui montent.',
      bad1: 'On enlève tout de suite.',
      bad2: 'On ignore ceux du canapé.',
      unit: 'Lemmings',
      regulation: 'Après l’arrivée, y en a-t-il plus ?',
      regYes: true,
    },
  ],
  p5: [
    {
      unknown: 'whole',
      story: 'Grizzy compte {a} pots le matin et {b} le soir. Combien dans la journée ?',
      good: 'On additionne matin et soir.',
      bad1: 'On garde seulement le soir.',
      bad2: 'On soustrait le matin.',
      unit: 'pots',
      regulation: 'Le total de la journée est-il plus grand que chaque moment ?',
      regYes: true,
    },
  ],
}
