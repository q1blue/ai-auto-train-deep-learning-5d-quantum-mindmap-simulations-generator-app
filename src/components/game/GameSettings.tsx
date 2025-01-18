import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { GameSettings } from '@/types/game'

interface GameSettingsProps {
  settings: GameSettings
  onSettingChange: (setting: string, value: any) => void
  onAccessibilityChange: (setting: string, value: boolean) => void
}

export function GameSettings({ settings, onSettingChange, onAccessibilityChange }: GameSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Graphics Quality</Label>
            <Select
              value={settings.graphics}
              onValueChange={(value) => onSettingChange('graphics', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="ultra">Ultra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sound Volume</Label>
            <Slider
              value={[settings.sound]}
              onValueChange={([value]) => onSettingChange('sound', value)}
              max={100}
              step={1}
            />
          </div>

          <div>
            <Label>Difficulty</Label>
            <Select
              value={settings.difficulty}
              onValueChange={(value) => onSettingChange('difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <CardTitle className="text-lg">Accessibility</CardTitle>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="subtitles">Subtitles</Label>
            <Switch
              id="subtitles"
              checked={settings.accessibility.subtitles}
              onCheckedChange={(checked) => onAccessibilityChange('subtitles', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="colorblind">Colorblind Mode</Label>
            <Switch
              id="colorblind"
              checked={settings.accessibility.colorblindMode}
              onCheckedChange={(checked) => onAccessibilityChange('colorblindMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="tts">Text to Speech</Label>
            <Switch
              id="tts"
              checked={settings.accessibility.textToSpeech}
              onCheckedChange={(checked) => onAccessibilityChange('textToSpeech', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="contrast">High Contrast</Label>
            <Switch
              id="contrast"
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) => onAccessibilityChange('highContrast', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}