"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { getTranslation } from "@/lib/translations"

type WeatherMapProps = {
  location: string
  mapType?: string
  locale: string
  latitude?: number
  longitude?: number
  countryCode?: string
}

const brazilianCapitals = [
  { name: "Brasília", lat: -15.7801, lng: -47.9292 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Belém", lat: -1.4558, lng: -48.4902 },
  { name: "Belo Horizonte", lat: -19.9167, lng: -43.9345 },
  { name: "Fortaleza", lat: -3.7172, lng: -38.5433 },
  { name: "Manaus", lat: -3.119, lng: -60.0217 },
  { name: "Recife", lat: -8.0476, lng: -34.877 },
  { name: "Salvador", lat: -12.9714, lng: -38.5014 },
  { name: "Curitiba", lat: -25.4284, lng: -49.2733 },
  { name: "Porto Alegre", lat: -30.0346, lng: -51.2177 },
  { name: "Goiânia", lat: -16.6799, lng: -49.255 },
  { name: "Maceió", lat: -9.6498, lng: -35.7089 },
  { name: "São Luís", lat: -2.5297, lng: -44.3044 },
  { name: "Campo Grande", lat: -20.4697, lng: -54.6201 },
  { name: "Cuiabá", lat: -15.6014, lng: -56.0979 },
  { name: "João Pessoa", lat: -7.1195, lng: -34.845 },
  { name: "Natal", lat: -5.7945, lng: -35.212 },
  { name: "Aracaju", lat: -10.9472, lng: -37.0731 },
  { name: "Vitória", lat: -20.2976, lng: -40.2958 },
  { name: "Florianópolis", lat: -27.5969, lng: -48.5495 },
  { name: "Teresina", lat: -5.092, lng: -42.8038 },
  { name: "Porto Velho", lat: -8.7608, lng: -63.9039 },
  { name: "Boa Vista", lat: 2.8235, lng: -60.6758 },
  { name: "Macapá", lat: 0.0356, lng: -51.0705 },
  { name: "Rio Branco", lat: -9.9754, lng: -67.8249 },
  { name: "Palmas", lat: -10.2491, lng: -48.3243 },
]

const brazilianTouristDestinations = [
  { name: "Foz do Iguaçu", lat: -25.5478, lng: -54.5882 },
  { name: "Gramado", lat: -29.3747, lng: -50.8765 },
  { name: "Búzios", lat: -22.7469, lng: -41.8816 },
  { name: "Paraty", lat: -23.2175, lng: -44.7208 },
  { name: "Bonito", lat: -21.1261, lng: -56.4836 },
  { name: "Fernando de Noronha", lat: -3.8447, lng: -32.4268 },
  { name: "Jericoacoara", lat: -2.7983, lng: -40.5114 },
  { name: "Chapada Diamantina", lat: -12.9425, lng: -41.4073 },
  { name: "Amazônia", lat: -3.4653, lng: -62.2159 },
  { name: "Pantanal", lat: -17.6874, lng: -57.2281 },
]

export function SimpleWeatherMap({
  location,
  mapType = "temperature",
  locale,
  latitude = -15.7801, 
  longitude = -47.9292,
  countryCode = "BR",
}: WeatherMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeMap, setActiveMap] = useState(mapType)
  const [zoom, setZoom] = useState(5)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 })
  const [showCapitals, setShowCapitals] = useState(true)
  const [showTouristSpots, setShowTouristSpots] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(panOffset.x, panOffset.y)
    ctx.scale(zoom, zoom)

    drawBrazilMap(ctx, canvas.clientWidth, canvas.clientHeight)

    drawWeatherOverlay(ctx, canvas.clientWidth, canvas.clientHeight, activeMap)

    

    drawCurrentLocationMarker(ctx, canvas.clientWidth, canvas.clientHeight, location)

    ctx.restore()
  }, [activeMap, location, zoom, panOffset, showCapitals, showTouristSpots, selectedLocation])

  const drawBrazilMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#E8F5E9"
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8)

    ctx.strokeStyle = "#4CAF50"
    ctx.lineWidth = 2
    ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8)

    ctx.strokeStyle = "#81C784"
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(width * 0.1, height * 0.3)
    ctx.lineTo(width * 0.9, height * 0.3)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.1, height * 0.5)
    ctx.lineTo(width * 0.9, height * 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.1, height * 0.7)
    ctx.lineTo(width * 0.9, height * 0.7)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.3, height * 0.1)
    ctx.lineTo(width * 0.3, height * 0.9)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.5, height * 0.1)
    ctx.lineTo(width * 0.5, height * 0.9)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(width * 0.7, height * 0.1)
    ctx.lineTo(width * 0.7, height * 0.9)
    ctx.stroke()

    ctx.fillStyle = "#1B5E20"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    ctx.fillText("NORTE", width * 0.2, height * 0.2)
    ctx.fillText("NORDESTE", width * 0.6, height * 0.2)
    ctx.fillText("CENTRO-OESTE", width * 0.4, height * 0.4)
    ctx.fillText("SUDESTE", width * 0.6, height * 0.6)
    ctx.fillText("SUL", width * 0.4, height * 0.8)

    ctx.fillStyle = "#B3E5FC"

    ctx.beginPath()
    ctx.moveTo(width * 0.1, height * 0.2)
    ctx.lineTo(width * 0.4, height * 0.25)
    ctx.lineTo(width * 0.3, height * 0.3)
    ctx.lineTo(width * 0.1, height * 0.25)
    ctx.closePath()
    ctx.fill()

    ctx.fillRect(width * 0.9, height * 0.1, width * 0.1, height * 0.8)
  }

  const drawWeatherOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number, type: string) => {
    switch (type) {
      case "temperature":
        drawTemperatureOverlay(ctx, width, height)
        break
      case "precipitation":
        drawPrecipitationOverlay(ctx, width, height)
        break
      case "wind":
        drawWindOverlay(ctx, width, height)
        break
      case "pressure":
        drawPressureOverlay(ctx, width, height)
        break
      case "clouds":
        drawCloudsOverlay(ctx, width, height)
        break
      case "humidity":
        drawHumidityOverlay(ctx, width, height)
        break
    }
  }

  const drawTemperatureOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(width * 0.1, height * 0.1, width * 0.9, height * 0.9)
    gradient.addColorStop(0, "rgba(33, 150, 243, 0.3)") 
    gradient.addColorStop(0.3, "rgba(76, 175, 80, 0.3)") 
    gradient.addColorStop(0.7, "rgba(255, 235, 59, 0.3)") 
    gradient.addColorStop(1, "rgba(244, 67, 54, 0.3)") 

    ctx.fillStyle = gradient
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8)

    const temperatures = [
      { x: width * 0.2, y: height * 0.2, temp: 28 }, 
      { x: width * 0.6, y: height * 0.2, temp: 30 }, 
      { x: width * 0.4, y: height * 0.4, temp: 26 }, 
      { x: width * 0.6, y: height * 0.6, temp: 24 }, 
      { x: width * 0.4, y: height * 0.8, temp: 18 }, 
    ]

    temperatures.forEach((point) => {
      ctx.fillStyle = getTemperatureColor(point.temp)
      ctx.beginPath()
      ctx.arc(point.x, point.y, 15, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${point.temp}°`, point.x, point.y)
    })

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("cold", locale), getTranslation("hot", locale)],
      ["#2196F3", "#F44336"],
    )
  }

  const getTemperatureColor = (temp: number): string => {
    if (temp < 10) return "#2196F3" 
    if (temp < 20) return "#4CAF50" 
    if (temp < 30) return "#FFC107" 
    return "#F44336" 
  }

  const drawPrecipitationOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const precipitationAreas = [
      { x: width * 0.2, y: height * 0.2, radius: 40, intensity: 0.8 }, 
      { x: width * 0.6, y: height * 0.2, radius: 30, intensity: 0.6 }, 
      { x: width * 0.4, y: height * 0.4, radius: 20, intensity: 0.3 }, 
      { x: width * 0.6, y: height * 0.6, radius: 25, intensity: 0.4 }, 
      { x: width * 0.4, y: height * 0.8, radius: 35, intensity: 0.7 }, 
    ]

    precipitationAreas.forEach((area) => {
      const gradient = ctx.createRadialGradient(area.x, area.y, 0, area.x, area.y, area.radius)

      if (area.intensity < 0.3) {
        gradient.addColorStop(0, "rgba(179, 229, 252, 0.7)")
        gradient.addColorStop(1, "rgba(179, 229, 252, 0)")
      } else if (area.intensity < 0.7) {
        gradient.addColorStop(0, "rgba(33, 150, 243, 0.7)")
        gradient.addColorStop(1, "rgba(33, 150, 243, 0)")
      } else {
        gradient.addColorStop(0, "rgba(25, 118, 210, 0.7)")
        gradient.addColorStop(1, "rgba(25, 118, 210, 0)")
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("none", locale), getTranslation("heavy", locale)],
      ["transparent", "#1976D2"],
    )
  }

  const drawWindOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(55, 71, 79, 0.7)"
    ctx.lineWidth = 2

    const gridSize = 40
    for (let x = width * 0.1 + gridSize; x < width * 0.9; x += gridSize) {
      for (let y = height * 0.1 + gridSize; y < height * 0.9; y += gridSize) {
        let angle = Math.PI / 4 
        let length = 15

        if (y < height * 0.3) {
          angle = 0 
          length = 20
        }
        else if (x > width * 0.5 && y < height * 0.3) {
          angle = Math.PI / 4 
          length = 18
        }
        else if (y > height * 0.7) {
          angle = Math.PI * 1.5 
          length = 22
        }
        else if (x > width * 0.5 && y > height * 0.5) {
          angle = Math.random() * Math.PI 
          length = 12 + Math.random() * 8
        }

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
      ["#CFD8DC", "#37474F"],
    )
  }

  const drawPressureOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(96, 125, 139, 0.7)"
    ctx.lineWidth = 1.5

    const centerX = width * 0.5
    const centerY = height * 0.5

    for (let i = 1; i <= 5; i++) {
      const radius = i * 40

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()

      if (i % 2 === 0) {
        ctx.fillStyle = "#37474F"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`${1020 - i * 4} hPa`, centerX, centerY - radius - 5)
      }
    }

    const northX = width * 0.2
    const northY = height * 0.2

    for (let i = 1; i <= 3; i++) {
      const radius = i * 30

      ctx.beginPath()
      ctx.arc(northX, northY, radius, 0, Math.PI * 2)
      ctx.stroke()

      if (i === 2) {
        ctx.fillStyle = "#37474F"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText("1008 hPa", northX, northY - radius - 5)
      }
    }

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("low", locale), getTranslation("high", locale)],
      ["#90A4AE", "#455A64"],
    )
  }

  const drawCloudsOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cloudAreas = [
      { x: width * 0.2, y: height * 0.2, radius: 40, opacity: 0.8 }, 
      { x: width * 0.6, y: height * 0.2, radius: 30, opacity: 0.5 }, 
      { x: width * 0.4, y: height * 0.4, radius: 20, opacity: 0.3 }, 
      { x: width * 0.6, y: height * 0.6, radius: 35, opacity: 0.6 }, 
      { x: width * 0.4, y: height * 0.8, radius: 25, opacity: 0.4 }, 
    ]

    cloudAreas.forEach((cloud) => {
      const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${cloud.opacity})`)
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("clear", locale), getTranslation("overcast", locale)],
      ["transparent", "#BDBDBD"],
    )
  }

  const drawHumidityOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createLinearGradient(width * 0.1, height * 0.1, width * 0.9, height * 0.9)
    gradient.addColorStop(0, "rgba(33, 150, 243, 0.5)") 
    gradient.addColorStop(0.3, "rgba(76, 175, 80, 0.4)") 
    gradient.addColorStop(0.6, "rgba(255, 235, 59, 0.3)") 
    gradient.addColorStop(1, "rgba(255, 152, 0, 0.3)") 

    ctx.fillStyle = gradient
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8)

    const humidityPoints = [
      { x: width * 0.2, y: height * 0.2, humidity: 85 }, 
      { x: width * 0.6, y: height * 0.2, humidity: 70 }, 
      { x: width * 0.4, y: height * 0.4, humidity: 60 }, 
      { x: width * 0.6, y: height * 0.6, humidity: 65 }, 
      { x: width * 0.4, y: height * 0.8, humidity: 50 }, 
    ]

    humidityPoints.forEach((point) => {
      ctx.fillStyle = getHumidityColor(point.humidity)
      ctx.beginPath()
      ctx.arc(point.x, point.y, 15, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(`${point.humidity}%`, point.x, point.y)
    })

    drawLegend(
      ctx,
      width,
      height,
      [getTranslation("dry", locale), getTranslation("humid", locale)],
      ["#FFC107", "#2196F3"],
    )
  }

  const getHumidityColor = (humidity: number): string => {
    if (humidity < 30) return "#FFC107" 
    if (humidity < 60) return "#4CAF50" 
    return "#2196F3" 
  }

  const drawLegend = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    labels: string[],
    colors: string[],
  ) => {
    const legendWidth = 150
    const legendHeight = 20
    const x = width - legendWidth - 20
    const y = height - legendHeight - 20

    const gradient = ctx.createLinearGradient(x, y, x + legendWidth, y)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(1, colors[1])

    ctx.fillStyle = gradient
    ctx.fillRect(x, y, legendWidth, legendHeight)

    ctx.strokeStyle = "#455A64"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, legendWidth, legendHeight)

    ctx.fillStyle = "#37474F"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.fillText(labels[0], x, y + legendHeight + 12)
    ctx.fillText(labels[1], x + legendWidth, y + legendHeight + 12)
  }

  

  const drawCurrentLocationMarker = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    locationName: string,
  ) => {
    const locationCoords = { x: width / 2, y: height / 2 }

    const capital = brazilianCapitals.find((cap) => cap.name === locationName)
    if (capital) {
      locationCoords.x = mapCoordinateX(capital.lat, capital.lng, width)
      locationCoords.y = mapCoordinateY(capital.lat, capital.lng, height)
    }

    const destination = brazilianTouristDestinations.find((dest) => dest.name === locationName)
    if (destination) {
      locationCoords.x = mapCoordinateX(destination.lat, destination.lng, width)
      locationCoords.y = mapCoordinateY(destination.lat, destination.lng, height)
    }

    ctx.fillStyle = "#F44336"
    ctx.beginPath()
    ctx.arc(locationCoords.x, locationCoords.y, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = "rgba(244, 67, 54, 0.5)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(locationCoords.x, locationCoords.y, 12 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = "#000"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(locationName, locationCoords.x, locationCoords.y + 25)

    setSelectedLocation(locationName)
  }

  const mapCoordinateY = (lat: number, lng: number, height: number): number => {
    const minLat = -33
    const maxLat = 5
    const yRatio = (lat - minLat) / (maxLat - minLat)
    return height * 0.9 - yRatio * height * 0.8 
  }

  const mapCoordinateX = (lat: number, lng: number, width: number): number => {
    const minLng = -74
    const maxLng = -34
    const xRatio = (lng - minLng) / (maxLng - minLng)
    return width * 0.1 + xRatio * width * 0.8
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true)
    setStartPanPoint({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return

    setPanOffset({
      x: e.clientX - startPanPoint.x,
      y: e.clientY - startPanPoint.y,
    })
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleMouseLeave = () => {
    setIsPanning(false)
  }

  const resetView = () => {
    setZoom(5)
    setPanOffset({ x: 0, y: 0 })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{getTranslation("weatherMap", locale)}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={resetView}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <Tabs value={activeMap} onValueChange={setActiveMap} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="temperature">{getTranslation("temperature", locale)}</TabsTrigger>
            <TabsTrigger value="precipitation">{getTranslation("precipitation", locale)}</TabsTrigger>
            <TabsTrigger value="wind">{getTranslation("wind", locale)}</TabsTrigger>
            <TabsTrigger value="pressure">{getTranslation("pressure", locale)}</TabsTrigger>
            <TabsTrigger value="clouds">{getTranslation("clouds", locale)}</TabsTrigger>
            <TabsTrigger value="humidity">{getTranslation("humidity", locale)}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px] rounded-md overflow-hidden">
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
            <Button variant="secondary" size="icon" onClick={() => setZoom((prev) => Math.min(prev + 1, 15))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => setZoom((prev) => Math.max(prev - 1, 1))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button
              variant={showCapitals ? "default" : "secondary"}
              size="sm"
              onClick={() => setShowCapitals(!showCapitals)}
            >
              {showCapitals ? "Hide Capitals" : "Show Capitals"}
            </Button>
            <Button
              variant={showTouristSpots ? "default" : "secondary"}
              size="sm"
              onClick={() => setShowTouristSpots(!showTouristSpots)}
            >
              {showTouristSpots ? "Hide Tourist Spots" : "Show Tourist Spots"}
            </Button>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isPanning ? "grabbing" : "grab" }}
          />
        </div>

        <div className="mt-4">
          <Slider value={[zoom]} min={1} max={15} step={1} onValueChange={(values) => setZoom(values[0])} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1x</span>
            <span>Zoom: {zoom}x</span>
            <span>15x</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

