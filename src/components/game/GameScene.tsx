import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { Scene, SceneOption } from '@/types/game'

interface GameSceneProps {
  scene: Scene
  onOptionSelect: (option: SceneOption) => void
}

export function GameScene({ scene, onOptionSelect }: GameSceneProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{scene.title}</CardTitle>
        <CardDescription>{scene.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9}>
          <img
            src={scene.image}
            alt={scene.title}
            className="rounded-md object-cover w-full h-full"
          />
        </AspectRatio>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-4">
          <p className="text-foreground">{scene.narrative}</p>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <p className="font-semibold">What's your next move?</p>
        {scene.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onOptionSelect(option)}
            className="w-full justify-start text-left"
            variant="outline"
          >
            {option.text}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}