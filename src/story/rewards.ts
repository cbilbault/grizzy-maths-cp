import { asset } from '../lib/assets'

export interface RewardClip {
  id: string
  src: string
  poster: string
  line: string
}

export const REWARD_CLIPS: RewardClip[] = [
  {
    id: 'sofa',
    src: asset('assets/rewards/sofa.mp4'),
    poster: asset('assets/rewards/sofa.jpg'),
    line: 'Grizzy récupère le canapé ! Les Lemmings rebondissent.',
  },
  {
    id: 'pile',
    src: asset('assets/rewards/pile.mp4'),
    poster: asset('assets/rewards/pile.jpg'),
    line: 'Une pile de dix Lemmings… et patatras !',
  },
  {
    id: 'fridge',
    src: asset('assets/rewards/fridge.mp4'),
    poster: asset('assets/rewards/fridge.jpg'),
    line: 'Les pots s’envolent. Grizzy rattrape la tartinade !',
  },
  {
    id: 'tv',
    src: asset('assets/rewards/tv.mp4'),
    poster: asset('assets/rewards/tv.jpg'),
    line: 'La télé s’allume. Grizzy danse sa danse ridicule.',
  },
  {
    id: 'chase',
    src: asset('assets/rewards/chase.mp4'),
    poster: asset('assets/rewards/chase.jpg'),
    line: 'Un Lemming vole le pot… et il revient dans les pattes de Grizzy.',
  },
  {
    id: 'salute',
    src: asset('assets/rewards/salute.mp4'),
    poster: asset('assets/rewards/salute.jpg'),
    line: 'Salut du forestier ! Les pots sautent en l’air.',
  },
]

export function pickReward(seen: string[]): RewardClip {
  const fresh = REWARD_CLIPS.filter((c) => !seen.includes(c.id))
  const pool = fresh.length ? fresh : REWARD_CLIPS
  return pool[Math.floor(Math.random() * pool.length)]
}
