"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTranslation } from "@/lib/translations"

type WeatherMapProps = {
  location: string
  mapType: string
  locale: string
}

export function WeatherMap({ location, mapType = "temperature", locale }: WeatherMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeMap, setActiveMap] = useState(mapType)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    ctx.fillStyle = "#e5e7eb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2)
    ctx.fill()
    switch (activeMap) {
      case "temperature":
        drawTemperatureMap(ctx, canvas.width, canvas.height)
        break
      case "precipitation":
        drawPrecipitationMap(ctx, canvas.width, canvas.height)
        break
      case "wind":
        drawWindMap(ctx, canvas.width, canvas.height)
        break
      case "pressure":
        drawPressureMap(ctx, canvas.width, canvas.height)
        break
      default:
        break
    }

    ctx.fillStyle = "#000"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(location, canvas.width / 2, canvas.height / 2 + 25)
  }, [activeMap, location])

  const drawTemperatureMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2)
    gradient.addColorStop(0, "rgba(239, 68, 68, 0.7)") 
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.3)") 

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("cold", locale), getTranslation("hot", locale)],
      ["#3b82f6", "#ef4444"],
    )
  }

  const drawPrecipitationMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 20 + 5

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, "rgba(37, 99, 235, 0.7)")
      gradient.addColorStop(1, "rgba(37, 99, 235, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("none", locale), getTranslation("heavy", locale)],
      ["transparent", "#2563eb"],
    )
  }

  const drawWindMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(55, 65, 81, 0.7)"
    ctx.lineWidth = 2

    for (let x = 30; x < width; x += 60) {
      for (let y = 30; y < height; y += 60) {
        const angle = Math.random() * Math.PI * 2
        const length = Math.random() * 15 + 10

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)

        ctx.lineTo(
          x + Math.cos(angle) * length - Math.cos(angle + Math.PI / 6) * 5,
          y + Math.sin(angle) * length - Math.sin(angle + Math.PI / 6) * 5,
        )
        ctx.moveTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
        ctx.lineTo(
          x + Math.cos(angle) * length - Math.cos(angle - Math.PI / 6) * 5,
          y + Math.sin(angle) * length - Math.sin(angle - Math.PI / 6) * 5,
        )

        ctx.stroke()
      }
    }

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("calm", locale), getTranslation("strong", locale)],
      ["#d1d5db", "#374151"],
    )
  }

  const drawPressureMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(107, 114, 128, 0.7)"
    ctx.lineWidth = 1.5

    for (let i = 0; i < 10; i++) {
      const radius = ((i + 1) * width) / 20

      ctx.beginPath()
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2)
      ctx.stroke()

      if (i % 2 === 0) {
        ctx.fillStyle = "#000"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`${1000 + i * 4} hPa`, width / 2, height / 2 - radius - 5)
      }
    }

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("low", locale), getTranslation("high", locale)],
      ["#9ca3af", "#4b5563"],
    )
  }

  const drawLegend = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    labels: string[],
    colors: string[],
  ) => {
    const legendWidth = 100
    const legendHeight = 20
    const x = width - legendWidth - 10
    const y = height - legendHeight - 10

    const gradient = ctx.createLinearGradient(x, y, x + legendWidth, y)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(1, colors[1])

    ctx.fillStyle = gradient
    ctx.fillRect(x, y, legendWidth, legendHeight)

    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, legendWidth, legendHeight)

    ctx.fillStyle = "#000"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.fillText(labels[0], x, y + legendHeight + 12)
    ctx.fillText(labels[1], x + legendWidth, y + legendHeight + 12)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{getTranslation("weatherMap", locale)}</CardTitle>
        <Tabs value={activeMap} onValueChange={setActiveMap} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="temperature">{getTranslation("temperature", locale)}</TabsTrigger>
            <TabsTrigger value="precipitation">{getTranslation("precipitation", locale)}</TabsTrigger>
            <TabsTrigger value="wind">{getTranslation("wind", locale)}</TabsTrigger>
            <TabsTrigger value="pressure">{getTranslation("pressure", locale)}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[250px] rounded-md overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  )
}

