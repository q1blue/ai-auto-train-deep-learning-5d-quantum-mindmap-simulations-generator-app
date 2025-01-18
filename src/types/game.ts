export interface PlayerStats {
  health: number
  mana: number
  experience: number
  quantumEntanglement: number
  alchemicalMastery: number
  stealthRating: number
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  type: 'weapon' | 'potion' | 'artifact' | 'ingredient'
  rarity: 'common' | 'rare' | 'legendary'
  effects?: string[]
}

export interface Objective {
  id: string
  description: string
  completed: boolean
  type: 'main' | 'side' | 'hidden'
  rewards?: Reward[]
}

export interface Scene {
  title: string
  description: string
  image: string
  narrative: string
  options: SceneOption[]
  requirements?: Requirement[]
  effects?: Effect[]
}

export interface SceneOption {
  text: string
  action: () => void
  requirements?: Requirement[]
}

export interface GameState {
  playerStats: PlayerStats
  inventory: InventoryItem[]
  objectives: Objective[]
  currentScene: string
  quantumState: string
  timeElapsed: number
  achievements: Achievement[]
}

export interface GameSettings {
  graphics: 'low' | 'medium' | 'high' | 'ultra'
  sound: number
  difficulty: 'easy' | 'normal' | 'hard'
  accessibility: {
    subtitles: boolean
    colorblindMode: boolean
    textToSpeech: boolean
    highContrast: boolean
  }
}

export interface TrainingData {
  inputs: number[]
  outputs: number[]
  metadata: {
    timestamp: number
    context: string
  }
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

export interface Requirement {
  type: 'item' | 'stat' | 'objective'
  target: string
  value: number
}

export interface Effect {
  type: 'stat' | 'item' | 'objective'
  target: string
  value: number
  duration?: number
}

export interface Reward {
  type: 'item' | 'experience' | 'ability'
  value: any
}