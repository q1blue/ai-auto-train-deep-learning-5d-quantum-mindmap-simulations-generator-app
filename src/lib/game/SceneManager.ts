import type { Scene, GameState } from '@/types/game'

export class SceneManager {
  private currentScene: Scene
  private scenes: Map<string, Scene>

  constructor() {
    this.scenes = new Map()
    this.currentScene = {
      title: '',
      description: '',
      image: '',
      narrative: '',
      options: []
    }
  }

  loadScene(sceneId: string): Scene {
    const scene = this.scenes.get(sceneId)
    if (!scene) throw new Error(`Scene ${sceneId} not found`)
    this.currentScene = scene
    return scene
  }

  async transitionTo(sceneId: string, gameState: GameState) {
    // Smooth scene transition with state management
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.loadScene(sceneId)
  }

  registerScene(sceneId: string, scene: Scene) {
    this.scenes.set(sceneId, scene)
  }
}