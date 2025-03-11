"use client"

import { useEffect, useRef } from "react"

type WeatherAnimationType = "Sunny" | "Cloudy" | "Rainy" | "Drizzle" | "Thunderstorm" | "Foggy" | "Snowy"

interface WeatherAnimationProps {
  type: WeatherAnimationType
  className?: string
}

export function WeatherAnimation({ type, className = "" }: WeatherAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    switch (type) {
      case "Sunny":
        createSunnyElements()
        break
      case "Cloudy":
        createCloudyElements()
        break
      case "Rainy":
        createRainyElements()
        break
      case "Thunderstorm":
        createThunderstormElements()
        break
      case "Foggy":
        createFoggyElements()
        break
      case "Snowy":
        createSnowyElements()
        break
      case "Drizzle":
        createDrizzleElements()
        break
    }
  }, [type])

  const createSunnyElements = () => {
    if (!containerRef.current) return

    const cloud1 = document.createElement("div")
    cloud1.className = "cloud"
    containerRef.current.appendChild(cloud1)

    const cloud2 = document.createElement("div")
    cloud2.className = "cloud"
    containerRef.current.appendChild(cloud2)
  }

  const createCloudyElements = () => {
    if (!containerRef.current) return

    const cloudContainer = document.createElement("div")
    cloudContainer.className = "cloud-container"

    const cloud1 = document.createElement("div")
    cloud1.className = "cloud cloud-1"
    cloudContainer.appendChild(cloud1)

    const cloud2 = document.createElement("div")
    cloud2.className = "cloud cloud-2"
    cloudContainer.appendChild(cloud2)

    const cloud3 = document.createElement("div")
    cloud3.className = "cloud cloud-3"
    cloudContainer.appendChild(cloud3)

    const cloud4 = document.createElement("div")
    cloud4.className = "cloud cloud-4"
    cloudContainer.appendChild(cloud4)

    containerRef.current.appendChild(cloudContainer)
  }

  const createRainyElements = () => {
    if (!containerRef.current) return

    const cloudContainer = document.createElement("div")
    cloudContainer.className = "cloud-container"

    const cloud1 = document.createElement("div")
    cloud1.className = "cloud cloud-1"
    cloudContainer.appendChild(cloud1)

    const cloud2 = document.createElement("div")
    cloud2.className = "cloud cloud-2"
    cloudContainer.appendChild(cloud2)

    containerRef.current.appendChild(cloudContainer)

    const rainContainer = document.createElement("div")
    rainContainer.className = "rain-container"

    for (let i = 0; i < 50; i++) {
      const raindrop = document.createElement("div")
      raindrop.className = "raindrop"
      raindrop.style.left = `${Math.random() * 100}%`
      raindrop.style.top = `${Math.random() * 100}%`
      raindrop.style.animationDelay = `${Math.random() * 2}s`
      rainContainer.appendChild(raindrop)
    }

    containerRef.current.appendChild(rainContainer)
  }

  const createThunderstormElements = () => {
    if (!containerRef.current) return

    const cloudContainer = document.createElement("div")
    cloudContainer.className = "cloud-container"

    const cloud1 = document.createElement("div")
    cloud1.className = "cloud cloud-1"
    cloudContainer.appendChild(cloud1)

    const cloud2 = document.createElement("div")
    cloud2.className = "cloud cloud-2"
    cloudContainer.appendChild(cloud2)

    containerRef.current.appendChild(cloudContainer)

    const lightning = document.createElement("div")
    lightning.className = "lightning"
    containerRef.current.appendChild(lightning)

    const rainContainer = document.createElement("div")
    rainContainer.className = "rain-container"

    for (let i = 0; i < 40; i++) {
      const raindrop = document.createElement("div")
      raindrop.className = "raindrop"
      raindrop.style.left = `${Math.random() * 100}%`
      raindrop.style.top = `${Math.random() * 100}%`
      raindrop.style.animationDelay = `${Math.random() * 2}s`
      rainContainer.appendChild(raindrop)
    }

    containerRef.current.appendChild(rainContainer)
  }

  const createFoggyElements = () => {
    if (!containerRef.current) return

    const fogContainer = document.createElement("div")
    fogContainer.className = "fog-container"

    for (let i = 0; i < 3; i++) {
      const fogLayer = document.createElement("div")
      fogLayer.className = "fog-layer"
      fogContainer.appendChild(fogLayer)
    }

    containerRef.current.appendChild(fogContainer)
  }

  const createSnowyElements = () => {
    if (!containerRef.current) return

    const cloudContainer = document.createElement("div")
    cloudContainer.className = "cloud-container"

    const cloud1 = document.createElement("div")
    cloud1.className = "cloud cloud-1"
    cloudContainer.appendChild(cloud1)

    const cloud2 = document.createElement("div")
    cloud2.className = "cloud cloud-2"
    cloudContainer.appendChild(cloud2)

    containerRef.current.appendChild(cloudContainer)

    const snowContainer = document.createElement("div")
    snowContainer.className = "snow-container"

    for (let i = 0; i < 50; i++) {
      const snowflake = document.createElement("div")
      snowflake.className = "snowflake"
      snowflake.style.left = `${Math.random() * 100}%`
      snowflake.style.animationDuration = `${5 + Math.random() * 5}s`
      snowflake.style.animationDelay = `${Math.random() * 5}s`
      snowContainer.appendChild(snowflake)
    }

    containerRef.current.appendChild(snowContainer)
  }

  const createDrizzleElements = () => {
    if (!containerRef.current) return

    const cloudContainer = document.createElement("div")
    cloudContainer.className = "cloud-container"

    const cloud1 = document.createElement("div")
    cloud1.className = "cloud cloud-1"
    cloudContainer.appendChild(cloud1)

    const cloud2 = document.createElement("div")
    cloud2.className = "cloud cloud-2"
    cloudContainer.appendChild(cloud2)

    containerRef.current.appendChild(cloudContainer)

    const drizzleContainer = document.createElement("div")
    drizzleContainer.className = "drizzle-container"

    for (let i = 0; i < 30; i++) {
      const drizzleDrop = document.createElement("div")
      drizzleDrop.className = "drizzle-drop"
      drizzleDrop.style.left = `${Math.random() * 100}%`
      drizzleDrop.style.top = `${Math.random() * 100}%`
      drizzleDrop.style.animationDelay = `${Math.random() * 2}s`
      drizzleContainer.appendChild(drizzleDrop)
    }

    containerRef.current.appendChild(drizzleContainer)
  }

  return (
    <div
      ref={containerRef}
      className={`weather-animation ${type.toLowerCase()} ${className}`}
      aria-label={`${type} weather animation`}
    />
  )
}

