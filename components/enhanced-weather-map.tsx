"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Layers, MapPin } from 'lucide-react'
import { getTranslation } from "@/lib/translations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type WeatherMapProps = {
  location: string
  mapType?: string
  locale: string
  latitude?: number
  longitude?: number
  countryCode?: string
}

export function EnhancedWeatherMap({ 
  location, 
  mapType = "temperature", 
  locale,
  latitude = -15.7801, 
  longitude = -47.9292,
  countryCode = "BR"
}: WeatherMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [activeMap, setActiveMap] = useState(mapType)
  const [zoom, setZoom] = useState(5)
  const [mapStyle, setMapStyle] = useState<"satellite" | "terrain" | "roadmap" | "hybrid">("terrain")
  const [isLoading, setIsLoading] = useState(true)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [weatherOverlay, setWeatherOverlay] = useState<google.maps.OverlayView | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([])
  
  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
      return () => {
        document.head.removeChild(script)
      }
    } else {
      initializeMap()
    }
  }, [])

  useEffect(() => {
    if (mapInstance) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const position = results[0].geometry.location
          mapInstance.setCenter(position)
          
          markers.forEach(marker => marker.setMap(null))
          
          const marker = new google.maps.Marker({
            position,
            map: mapInstance,
            title: location,
            animation: google.maps.Animation.DROP,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#F44336',
              fillOpacity: 0.8,
              strokeColor: '#FFFFFF',
              strokeWeight: 2
            }
          })
          
          setMarkers([marker])
          
          findNearbyPlaces(position)
        }
      })
    }
  }, [mapInstance, location])

  useEffect(() => {
    if (mapInstance) {
      if (weatherOverlay) {
        weatherOverlay.setMap(null)
      }
      
      const overlay = createWeatherOverlay(activeMap)
      if (overlay) {
        overlay.setMap(mapInstance)
        setWeatherOverlay(overlay)
      }
    }
  }, [mapInstance, activeMap])

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setMapTypeId(mapStyle)
    }
  }, [mapInstance, mapStyle])

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setZoom(zoom)
    }
  }, [mapInstance, zoom])

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.google) return
    
    setIsLoading(true)
    
    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: zoom,
      mapTypeId: mapStyle,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      styles: getMapStyles()
    })
    
    map.addListener('tilesloaded', () => {
      setIsLoading(false)
    })
    
    setMapInstance(map)
  }

  const getMapStyles = () => {
    return [
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          { "color": "#B3E5FC" }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          { "color": "#E8F5E9" }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          { "color": "#FFFFFF" }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          { "color": "#C5E1A5" }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          { "color": "#ECEFF1" }
        ]
      }
    ]
  }

  const createWeatherOverlay = (type: string) => {
    if (!window.google) return null
    
    class WeatherOverlay extends google.maps.OverlayView {
      private div: HTMLDivElement | null = null
      private weatherType: string
      
      constructor(weatherType: string) {
        super()
        this.weatherType = weatherType
      }
      
      onAdd() {
        const div = document.createElement('div')
        div.style.position = 'absolute'
        div.style.width = '100%'
        div.style.height = '100%'
        div.style.pointerEvents = 'none'
        
        this.div = div
        
        const panes = this.getPanes()
        panes?.overlayLayer.appendChild(div)
      }
      
      draw() {
        if (!this.div) return
        
        const overlayProjection = this.getProjection()
        const sw = overlayProjection.fromLatLngToDivPixel(
          new google.maps.LatLng(
            mapInstance?.getBounds()?.getSouthWest().lat() || 0,
            mapInstance?.getBounds()?.getSouthWest().lng() || 0
          )
        )
        const ne = overlayProjection.fromLatLngToDivPixel(
          new google.maps.LatLng(
            mapInstance?.getBounds()?.getNorthEast().lat() || 0,
            mapInstance?.getBounds()?.getNorthEast().lng() || 0
          )
        )
        
        if (!sw || !ne) return
        
        this.div.style.left = sw.x + 'px'
        this.div.style.top = ne.y + 'px'
        this.div.style.width = (ne.x - sw.x) + 'px'
        this.div.style.height = (sw.y - ne.y) + 'px'
        
        this.div.innerHTML = ''
        
        switch (this.weatherType) {
          case 'temperature':
            this.drawTemperatureOverlay()
            break
          case 'precipitation':
            this.drawPrecipitationOverlay()
            break
          case 'clouds':
            this.drawCloudsOverlay()
            break
          case 'wind':
            this.drawWindOverlay()
            break
          case 'pressure':
            this.drawPressureOverlay()
            break
          case 'humidity':
            this.drawHumidityOverlay()
            break
        }
      }
      
      drawTemperatureOverlay() {
        if (!this.div) return
        
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(this.div.style.width)
        canvas.height = parseInt(this.div.style.height)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        canvas.style.opacity = '0.6'
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, 'rgba(33, 150, 243, 0.7)') 
        gradient.addColorStop(0.25, 'rgba(0, 188, 212, 0.7)') 
        gradient.addColorStop(0.5, 'rgba(255, 235, 59, 0.7)') 
        gradient.addColorStop(0.75, 'rgba(255, 152, 0, 0.7)') 
        gradient.addColorStop(1, 'rgba(244, 67, 54, 0.7)') 
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        this.div.appendChild(canvas)
        
        this.addTemperaturePoints()
      }
      
      addTemperaturePoints() {
        if (!this.div || !mapInstance) return
        
        
        const bounds = mapInstance.getBounds()
        if (!bounds) return
        
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        
      
        for (let i = 0; i < 10; i++) {
          const lat = sw.lat() + (ne.lat() - sw.lat()) * Math.random()
          const lng = sw.lng() + (ne.lng() - sw.lng()) * Math.random()
          const temp = Math.round(Math.random() * 40 - 5) 
          
          const point = document.createElement('div')
          point.className = 'temperature-point'
          point.style.position = 'absolute'
          point.style.width = '40px'
          point.style.height = '40px'
          point.style.borderRadius = '50%'
          point.style.backgroundColor = this.getTemperatureColor(temp)
          point.style.color = 'white'
          point.style.display = 'flex'
          point.style.alignItems = 'center'
          point.style.justifyContent = 'center'
          point.style.fontWeight = 'bold'
          point.style.fontSize = '12px'
          point.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
          point.style.transform = 'translate(-50%, -50%)'
          point.style.zIndex = '1000'
          point.textContent = `${temp}°`
          
          const position = new google.maps.LatLng(lat, lng)
          const pixel = this.getProjection().fromLatLngToDivPixel(position)
          
          point.style.left = (pixel.x - parseInt(this.div.style.left)) + 'px'
          point.style.top = (pixel.y - parseInt(this.div.style.top)) + 'px'
          
          this.div.appendChild(point)
        }
      }
      
      getTemperatureColor(temp: number): string {
        if (temp < 0) return '#2196F3' 
        if (temp < 10) return '#03A9F4' 
        if (temp < 20) return '#4CAF50' 
        if (temp < 30) return '#FFC107'
        return '#F44336' 
      }
      
      drawPrecipitationOverlay() {
        if (!this.div) return
        
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(this.div.style.width)
        canvas.height = parseInt(this.div.style.height)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 30 + 10
          const intensity = Math.random()
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
          
          if (intensity < 0.3) {
            gradient.addColorStop(0, 'rgba(179, 229, 252, 0.7)')
            gradient.addColorStop(1, 'rgba(179, 229, 252, 0)')
          } else if (intensity < 0.7) {
            gradient.addColorStop(0, 'rgba(33, 150, 243, 0.7)')
            gradient.addColorStop(1, 'rgba(33, 150, 243, 0)')
          } else {
            gradient.addColorStop(0, 'rgba(25, 118, 210, 0.7)')
            gradient.addColorStop(1, 'rgba(25, 118, 210, 0)')
          }
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
        
        this.div.appendChild(canvas)
      }
      
      drawCloudsOverlay() {
        if (!this.div) return
        
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(this.div.style.width)
        canvas.height = parseInt(this.div.style.height)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height
          const radius = Math.random() * 50 + 20
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
        
        this.div.appendChild(canvas)
      }
      
      drawWindOverlay() {
        if (!this.div) return
        
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(this.div.style.width)
        canvas.height = parseInt(this.div.style.height)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        ctx.strokeStyle = 'rgba(55, 71, 79, 0.7)'
        ctx.lineWidth = 2
        
        const gridSize = 40
        for (let x = gridSize; x < canvas.width; x += gridSize) {
          for (let y = gridSize; y < canvas.height; y += gridSize) {
            const angle = Math.random() * Math.PI * 2
            const length = Math.random() * 15 + 10
            
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
            
            ctx.lineTo(
              x + Math.cos(angle) * length - Math.cos(angle + Math.PI / 6) * 5,
              y + Math.sin(angle) * length - Math.sin(angle + Math.PI / 6) * 5
            )
            ctx.moveTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
            ctx.lineTo(
              x + Math.cos(angle) * length - Math.cos(angle - Math.PI / 6) * 5,
              y + Math.sin(angle) * length - Math.sin(angle - Math.PI / 6) * 5
            )
            
            ctx.stroke()
          }
        }
        
        this.div.appendChild(canvas)
      }
      
      drawPressureOverlay() {
        if (!this.div) return
        
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(this.div.style.width)
        canvas.height = parseInt(this.div.style.height)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        ctx.strokeStyle = 'rgba(96, 125, 139, 0.7)'
        ctx.lineWidth = 1.5
        
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        
        for (let i = 1; i <= 10; i++) {
          const radius = i * 30
          
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
          ctx.stroke()
          
          if (i % 2 === 0) {
            ctx.fillStyle = '#37474F'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(`${1000 + i * 4} hPa`, centerX, centerY - radius - 5)
          }
        }
        
        this.div.appendChild(canvas)
      }
      
      drawHumidityOverlay() {
        if (!this.div) return
        
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(this.div.style.width)
        canvas.height = parseInt(this.div.style.height)
        canvas.style.position = 'absolute'
        canvas.style.left = '0'
        canvas.style.top = '0'
        canvas.style.opacity = '0.6'
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, 'rgba(255, 235, 59, 0.7)') 
        gradient.addColorStop(0.5, 'rgba(76, 175, 80, 0.7)') 
        gradient.addColorStop(1, 'rgba(33, 150, 243, 0.7)') 
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        this.div.appendChild(canvas)
        
        this.addHumidityPoints()
      }
      
      addHumidityPoints() {
        if (!this.div || !mapInstance) return
        
        
        const bounds = mapInstance.getBounds()
        if (!bounds) return
        
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        
        
        for (let i = 0; i < 8; i++) {
          const lat = sw.lat() + (ne.lat() - sw.lat()) * Math.random()
          const lng = sw.lng() + (ne.lng() - sw.lng()) * Math.random()
          const humidity = Math.round(Math.random() * 100) 
          
          const point = document.createElement('div')
          point.className = 'humidity-point'
          point.style.position = 'absolute'
          point.style.width = '40px'
          point.style.height = '40px'
          point.style.borderRadius = '50%'
          point.style.backgroundColor = this.getHumidityColor(humidity)
          point.style.color = 'white'
          point.style.display = 'flex'
          point.style.alignItems = 'center'
          point.style.justifyContent = 'center'
          point.style.fontWeight = 'bold'
          point.style.fontSize = '12px'
          point.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
          point.style.transform = 'translate(-50%, -50%)'
          point.style.zIndex = '1000'
          point.textContent = `${humidity}%`
          
          const position = new google.maps.LatLng(lat, lng)
          const pixel = this.getProjection().fromLatLngToDivPixel(position)
          
          point.style.left = (pixel.x - parseInt(this.div.style.left)) + 'px'
          point.style.top = (pixel.y - parseInt(this.div.style.top)) + 'px'
          
          this.div.appendChild(point)
        }
      }
      
      getHumidityColor(humidity: number): string {
        if (humidity < 30) return '#FFC107' 
        if (humidity < 60) return '#4CAF50' 
        return '#03A9F4' 
      }
      
      onRemove() {
        if (this.div) {
          this.div.parentNode?.removeChild(this.div)
          this.div = null
        }
      }
    }
    
    return new WeatherOverlay(type)
  }

  const findNearbyPlaces = (position: google.maps.LatLng) => {
    if (!mapInstance || !window.google) return
    
    const service = new google.maps.places.PlacesService(mapInstance)
    
    service.nearbySearch({
      location: position,
      radius: 50000, 
      type: 'locality'
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(results)
        
        results.slice(0, 5).forEach(place => {
          if (place.geometry && place.geometry.location) {
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: mapInstance,
              title: place.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#4CAF50',
                fillOpacity: 0.7,
                strokeColor: '#FFFFFF',
                strokeWeight: 1
              }
            })
            
            const infoWindow = new google.maps.InfoWindow({
              content: `<div style="font-family: Arial, sans-serif; padding: 5px;">
                <strong>${place.name}</strong>
                <p>${place.vicinity || ''}</p>
              </div>`
            })
            
            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker)
            })
            
            setMarkers(prev => [...prev, marker])
          }
        })
      }
    })
  }

  const resetView = () => {
    if (mapInstance) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          mapInstance.setCenter(results[0].geometry.location)
          setZoom(5)
        }
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{getTranslation("weatherMap", locale)}</span>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Layers className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{getTranslation("mapStyle", locale)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={mapStyle} onValueChange={(value: any) => setMapStyle(value)}>
                  <DropdownMenuRadioItem value="roadmap">{getTranslation("standard", locale)}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="satellite">{getTranslation("satellite", locale)}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="terrain">{getTranslation("terrain", locale)}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="hybrid">{getTranslation("hybrid", locale)}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Button variant="secondary" size="icon" onClick={() => setZoom(prev => Math.min(prev + 1, 15))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => setZoom(prev => Math.max(prev - 1, 1))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          
          <div 
            ref={mapContainerRef} 
            className="w-full h-full"
          />
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Slider
            value={[zoom]}
            min={1}
            max={15}
            step={1}
            onValueChange={(values) => setZoom(values[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1x</span>
            <span>Zoom: {zoom}x</span>
            <span>15x</span>
          </div>
        </div>
        
        {nearbyPlaces.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{getTranslation("nearbyPlaces", locale)}</h3>
            <div className="flex flex-wrap gap-2">
              {nearbyPlaces.slice(0, 5).map((place, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    if (mapInstance && place.geometry && place.geometry.location) {
                      mapInstance.setCenter(place.geometry.location)
                      mapInstance.  {
                      mapInstance.setCenter(place.geometry.location)
                      mapInstance.setZoom(12)
                    }
                  }}
                >
                  <MapPin className="h-3 w-3" />
                  {place.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

