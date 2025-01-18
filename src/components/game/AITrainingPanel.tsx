import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AITrainingSystem } from '@/lib/ai/training'
import type { GameState } from '@/types/game'

interface AITrainingPanelProps {
  gameState: GameState
  onTrainingComplete: (results: any) => void
}

export function AITrainingPanel({ gameState, onTrainingComplete }: AITrainingPanelProps) {
  const [training, setTraining] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const aiSystem = React.useMemo(() => new AITrainingSystem(), [])

  const handleStartTraining = async () => {
    setTraining(true)
    setProgress(0)

    const trainingData = {
      inputs: [gameState.playerStats.health, gameState.playerStats.mana],
      outputs: [1, 0],
      metadata: {
        timestamp: Date.now(),
        context: gameState.currentScene
      }
    }

    // Simulate training progress
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 100))
    }, 500)

    try {
      const results = await aiSystem.train(gameState, trainingData)
      onTrainingComplete(results)
    } finally {
      clearInterval(interval)
      setTraining(false)
      setProgress(100)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Training System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Training Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Button 
          onClick={handleStartTraining}
          disabled={training}
          className="w-full"
        >
          {training ? 'Training in Progress...' : 'Start AI Training'}
        </Button>
      </CardContent>
    </Card>
  )
}