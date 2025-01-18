import React from 'react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PlayerStats, InventoryItem, Objective } from '@/types/game'

interface GameHUDProps {
  playerStats: PlayerStats
  inventory: InventoryItem[]
  objectives: Objective[]
}

export function GameHUD({ playerStats, inventory, objectives }: GameHUDProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Player Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(playerStats).map(([stat, value]) => (
              <div key={stat}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{typeof value === 'number' ? `${value}%` : value}</span>
                </div>
                <Progress value={typeof value === 'number' ? value : 0} className="w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {inventory.slice(0, 4).map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.name}</span>
                <Badge variant="secondary">{item.quantity}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {objectives.filter(obj => !obj.completed).slice(0, 3).map((objective, index) => (
              <li key={index} className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                <span>{objective.description}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}