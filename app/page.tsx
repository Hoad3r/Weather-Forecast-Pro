"use client"

import { useState, useEffect } from "react"
import { format, subDays, addHours } from "date-fns"
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  Compass,
  Sunrise,
  Sunset,
  Umbrella,
  Eye,
  Gauge,
  ThermometerSun,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AirQualityIndicator } from "@/components/air-quality-indicator"
import { FavoriteLocations } from "@/components/favorite-locations"
import { ExtendedForecast } from "@/components/extended-forecast"
import { getTranslation, formatDate } from "@/lib/translations"
import { EnhancedWeatherAlert } from "@/components/enhanced-weather-alert"
import { WeatherAnimation } from "@/components/weather-animation"
import { getCountryClimate, getAppropriateWeatherConditions, isWeatherConditionAppropriate } from "@/lib/climate-zones"
import { SimpleWeatherMap } from "@/components/simple-weather-map"
import { AILocationSearch } from "@/components/ai-location-search"

const weatherTypes = {
  Sunny: {
    icon: Sun,
    bgClass: "bg-gradient-to-b from-yellow-300 to-blue-400",
    darkBgClass: "dark:from-blue-900 dark:to-gray-900",
    animation: "sunny",
  },
  Cloudy: {
    icon: Cloud,
    bgClass: "bg-gradient-to-b from-gray-300 to-blue-300",
    darkBgClass: "dark:from-gray-800 dark:to-gray-900",
    animation: "cloudy",
  },
  Rainy: {
    icon: CloudRain,
    bgClass: "bg-gradient-to-b from-gray-400 to-blue-500",
    darkBgClass: "dark:from-gray-800 dark:to-gray-900",
    animation: "rainy",
  },
  Drizzle: {
    icon: CloudDrizzle,
    bgClass: "bg-gradient-to-b from-gray-300 to-blue-400",
    darkBgClass: "dark:from-gray-800 dark:to-gray-900",
    animation: "drizzle",
  },
  Thunderstorm: {
    icon: CloudLightning,
    bgClass: "bg-gradient-to-b from-gray-600 to-blue-700",
    darkBgClass: "dark:from-gray-900 dark:to-gray-950",
    animation: "thunderstorm",
  },
  Foggy: {
    icon: CloudFog,
    bgClass: "bg-gradient-to-b from-gray-300 to-gray-400",
    darkBgClass: "dark:from-gray-800 dark:to-gray-900",
    animation: "foggy",
  },
  Snowy: {
    icon: CloudSnow,
    bgClass: "bg-gradient-to-b from-blue-100 to-blue-200",
    darkBgClass: "dark:from-gray-800 dark:to-gray-900",
    animation: "snowy",
  },
}

const locations = [
  { id: "nyc", name: "New York", country: "US" },
  { id: "ldn", name: "London", country: "UK" },
  { id: "tky", name: "Tokyo", country: "JP" },
  { id: "syd", name: "Sydney", country: "AU" },
  { id: "par", name: "Paris", country: "FR" },
  { id: "ber", name: "Berlin", country: "DE" },
  { id: "rom", name: "Rome", country: "IT" },
  { id: "mex", name: "Mexico City", country: "MX" },
  { id: "dub", name: "Dubai", country: "AE" },
  { id: "tor", name: "Toronto", country: "CA" },
  { id: "sin", name: "Singapore", country: "SG" },
  { id: "hkg", name: "Hong Kong", country: "CN" },
  { id: "mum", name: "Mumbai", country: "IN" },

  { id: "rio", name: "Rio de Janeiro", country: "BR" },
  { id: "sao", name: "São Paulo", country: "BR" },
  { id: "bsb", name: "Brasília", country: "BR" },
  { id: "bel", name: "Belém", country: "BR" },
  { id: "bho", name: "Belo Horizonte", country: "BR" },
  { id: "for", name: "Fortaleza", country: "BR" },
  { id: "man", name: "Manaus", country: "BR" },
  { id: "rec", name: "Recife", country: "BR" },
  { id: "sal", name: "Salvador", country: "BR" },
  { id: "cur", name: "Curitiba", country: "BR" },
  { id: "poa", name: "Porto Alegre", country: "BR" },
  { id: "goi", name: "Goiânia", country: "BR" },
  { id: "mac", name: "Maceió", country: "BR" },
  { id: "slz", name: "São Luís", country: "BR" },
  { id: "cgr", name: "Campo Grande", country: "BR" },
  { id: "cgh", name: "Cuiabá", country: "BR" },
  { id: "jpa", name: "João Pessoa", country: "BR" },
  { id: "nat", name: "Natal", country: "BR" },
  { id: "aju", name: "Aracaju", country: "BR" },
  { id: "vix", name: "Vitória", country: "BR" },
  { id: "fln", name: "Florianópolis", country: "BR" },
  { id: "the", name: "Teresina", country: "BR" },
  { id: "pvh", name: "Porto Velho", country: "BR" },
  { id: "bvb", name: "Boa Vista", country: "BR" },
  { id: "mcp", name: "Macapá", country: "BR" },
  { id: "rbr", name: "Rio Branco", country: "BR" },
  { id: "pmw", name: "Palmas", country: "BR" },

  { id: "foz", name: "Foz do Iguaçu", country: "BR" },
  { id: "gra", name: "Gramado", country: "BR" },
  { id: "buz", name: "Búzios", country: "BR" },
  { id: "pty", name: "Paraty", country: "BR" },
  { id: "bon", name: "Bonito", country: "BR" },
  { id: "fno", name: "Fernando de Noronha", country: "BR" },
  { id: "jer", name: "Jericoacoara", country: "BR" },
  { id: "chd", name: "Chapada Diamantina", country: "BR" },
  { id: "amz", name: "Amazônia", country: "BR" },
  { id: "pnt", name: "Pantanal", country: "BR" },
]

const locales = [
  { id: "en-US", name: "English (US)" },
  { id: "en-GB", name: "English (UK)" },
  { id: "fr-FR", name: "French" },
  { id: "es-ES", name: "Spanish" },
  { id: "pt-BR", name: "Portuguese (Brazil)" },
  { id: "ja-JP", name: "Japanese" },
  { id: "de-DE", name: "German" },
  { id: "it-IT", name: "Italian" },
  { id: "ru-RU", name: "Russian" },
  { id: "zh-CN", name: "Chinese (Simplified)" },
]

const generateWeatherData = (locationId) => {
  const today = new Date()
  const location = locations.find((loc) => loc.id === locationId) || { id: locationId, name: "", country: "US" }
  const countryCode = location.country

  const climate = getCountryClimate(countryCode)

  const baseWeatherConditions = [
    {
      condition: "Sunny",
      temp: {
        min: climate.avgTemperature.min + 10,
        max: climate.avgTemperature.max - 2,
      },
      humidity: 45,
      precipitation: 0,
      windSpeed: 8,
      windDirection: "NE",
      uvIndex: 8,
      visibility: 10,
      sunrise: "06:15",
      sunset: "20:45",
      pressure: 1012,
      feelsLike: climate.avgTemperature.max - 5,
      airQuality: { index: 35, level: "Good" },
      alerts: [],
      chanceOfRain: 0,
    },
    {
      condition: "Cloudy",
      temp: {
        min: climate.avgTemperature.min + 5,
        max: climate.avgTemperature.max - 6,
      },
      humidity: 60,
      precipitation: 10,
      windSpeed: 12,
      windDirection: "SW",
      uvIndex: 4,
      visibility: 8,
      sunrise: "06:17",
      sunset: "20:43",
      pressure: 1010,
      feelsLike: climate.avgTemperature.max - 8,
      airQuality: { index: 42, level: "Good" },
      alerts: [],
      chanceOfRain: 20,
    },
    {
      condition: "Rainy",
      temp: {
        min: climate.avgTemperature.min + 3,
        max: climate.avgTemperature.max - 10,
      },
      humidity: 85,
      precipitation: 70,
      windSpeed: 18,
      windDirection: "S",
      uvIndex: 2,
      visibility: 5,
      sunrise: "06:18",
      sunset: "20:42",
      pressure: 1008,
      feelsLike: climate.avgTemperature.max - 12,
      airQuality: { index: 28, level: "Good" },
      alerts: [{ type: "Rain", message: "Heavy rain expected" }],
      chanceOfRain: 90,
    },
    {
      condition: "Drizzle",
      temp: {
        min: climate.avgTemperature.min + 4,
        max: climate.avgTemperature.max - 8,
      },
      humidity: 75,
      precipitation: 30,
      windSpeed: 10,
      windDirection: "SE",
      uvIndex: 3,
      visibility: 7,
      sunrise: "06:19",
      sunset: "20:41",
      pressure: 1009,
      feelsLike: climate.avgTemperature.max - 10,
      airQuality: { index: 38, level: "Good" },
      alerts: [],
      chanceOfRain: 60,
    },
    {
      condition: "Thunderstorm",
      temp: {
        min: climate.avgTemperature.min + 4,
        max: climate.avgTemperature.max - 9,
      },
      humidity: 90,
      precipitation: 80,
      windSpeed: 25,
      windDirection: "S",
      uvIndex: 1,
      visibility: 3,
      sunrise: "06:20",
      sunset: "20:40",
      pressure: 1005,
      feelsLike: climate.avgTemperature.max - 11,
      airQuality: { index: 55, level: "Moderate" },
      alerts: [{ type: "Storm", message: "Thunderstorms with possible lightning" }],
      chanceOfRain: 95,
    },
    {
      condition: "Foggy",
      temp: {
        min: climate.avgTemperature.min + 2,
        max: climate.avgTemperature.max - 11,
      },
      humidity: 80,
      precipitation: 5,
      windSpeed: 5,
      windDirection: "E",
      uvIndex: 2,
      visibility: 2,
      sunrise: "06:21",
      sunset: "20:39",
      pressure: 1011,
      feelsLike: climate.avgTemperature.max - 13,
      airQuality: { index: 65, level: "Moderate" },
      alerts: [{ type: "Fog", message: "Dense fog reducing visibility" }],
      chanceOfRain: 10,
    },
    {
      condition: "Snowy",
      temp: {
        min: climate.avgTemperature.min - 5,
        max: climate.avgTemperature.min + 7,
      },
      humidity: 70,
      precipitation: 60,
      windSpeed: 15,
      windDirection: "N",
      uvIndex: 1,
      visibility: 4,
      sunrise: "06:22",
      sunset: "20:38",
      pressure: 1020,
      feelsLike: climate.avgTemperature.min + 2,
      airQuality: { index: 25, level: "Good" },
      alerts: [{ type: "Snow", message: "Heavy snowfall expected" }],
      chanceOfRain: 0,
    },
  ]

  const weatherConditions = baseWeatherConditions.filter((weather) =>
    isWeatherConditionAppropriate(countryCode, weather.condition),
  )

  return Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(today, index)
    const randomIndex = Math.floor(Math.random() * weatherConditions.length)
    const dayData = { ...weatherConditions[randomIndex] }

    const hourlyForecasts = Array.from({ length: 24 }).map((_, hourIndex) => {
      const hourTime = addHours(new Date(date).setHours(0, 0, 0, 0), hourIndex)
      const hourTemp = Math.round(
        dayData.temp.min +
          ((Math.sin(((hourIndex - 6) * Math.PI) / 12) + 1) / 2) * (dayData.temp.max - dayData.temp.min),
      )

      let hourCondition = dayData.condition
      if (Math.random() > 0.7) {
        const conditions = getAppropriateWeatherConditions(countryCode)
        hourCondition = conditions[Math.floor(Math.random() * conditions.length)]
      }

      return {
        time: hourTime,
        temp: hourTemp,
        feelsLike: hourTemp + (Math.random() > 0.5 ? 2 : -2),
        condition: hourCondition,
        icon: weatherTypes[hourCondition].icon,
        windSpeed: dayData.windSpeed + Math.floor(Math.random() * 5) - 2,
        precipitation: Math.max(0, dayData.precipitation + Math.floor(Math.random() * 20) - 10),
        chanceOfRain: Math.min(100, Math.max(0, dayData.chanceOfRain + Math.floor(Math.random() * 20) - 10)),
      }
    })

    return {
      date,
      formattedDate: format(date, "EEEE, MMMM d"),
      condition: dayData.condition,
      icon: weatherTypes[dayData.condition].icon,
      temp: {
        current: Math.round((dayData.temp.min + dayData.temp.max) / 2),
        min: dayData.temp.min,
        max: dayData.temp.max,
      },
      feelsLike: dayData.feelsLike,
      humidity: dayData.humidity,
      precipitation: dayData.precipitation,
      windSpeed: dayData.windSpeed,
      windDirection: dayData.windDirection,
      uvIndex: dayData.uvIndex,
      visibility: dayData.visibility,
      sunrise: dayData.sunrise,
      sunset: dayData.sunset,
      pressure: dayData.pressure,
      airQuality: dayData.airQuality,
      alerts: dayData.alerts,
      chanceOfRain: dayData.chanceOfRain,
      hourlyForecasts,
    }
  })
}

export default function WeatherApp() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedLocation, setSelectedLocation] = useState("nyc")
  const [searchQuery, setSearchQuery] = useState("")
  const [locale, setLocale] = useState("en-US")
  const [weatherData, setWeatherData] = useState([])
  const [activeTab, setActiveTab] = useState("daily")
  const [showExtendedForecast, setShowExtendedForecast] = useState(false)
  const [showWeatherMap, setShowWeatherMap] = useState(false)

  useEffect(() => {
    setWeatherData(generateWeatherData(selectedLocation))
  }, [selectedLocation])

  const currentWeather = weatherData[activeIndex] || {
    condition: "Loading",
    temp: { current: 0, min: 0, max: 0 },
    hourlyForecasts: [],
  }

  const getBgClasses = () => {
    const weatherInfo = weatherTypes[currentWeather.condition] || weatherTypes["Sunny"]
    return `${weatherInfo.bgClass} ${weatherInfo.darkBgClass} transition-all duration-1000`
  }
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={`min-h-screen ${getBgClasses()} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white dark:text-white">{getTranslation("weatherForecast", locale)}</h1>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <AILocationSearch
                locations={locations}
                currentLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                locale={locale}
              />
            </div>

            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={getTranslation("selectLocale", locale)} />
              </SelectTrigger>
              <SelectContent>
                {locales.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <Badge variant="outline" className="text-white border-white text-sm px-3 py-1">
            {locations.find((loc) => loc.id === selectedLocation)?.name},
            {locations.find((loc) => loc.id === selectedLocation)?.country}
          </Badge>
        </div>
        {currentWeather.alerts && currentWeather.alerts.length > 0 && (
          <div className="mb-4">
            {currentWeather.alerts.map((alert, index) => {
              const recommendations = (() => {
                switch (alert.type) {
                  case "Rain":
                    return ["stayIndoors", "useUmbrella", "avoidFlooding", "driveSafely"]
                  case "Storm":
                    return ["seekShelter", "avoidTrees", "unpluggElectronics", "stayInformed", "avoidMetalObjects"]
                  case "Fog":
                    return ["reduceDrivingSpeed", "useFogLights", "keepDistance", "avoidTravel"]
                  case "Snow":
                    return ["dressWarmly", "clearSnow", "prepareCar", "carryEmergencyKit"]
                  default:
                    return []
                }
              })()

              const severity = (() => {
                if (alert.type === "Storm" && currentWeather.windSpeed > 20) return "extreme"
                if (alert.type === "Rain" && currentWeather.precipitation > 75) return "severe"
                if (alert.type === "Snow" && currentWeather.temp.current < -10) return "severe"
                if (alert.type === "Fog" && currentWeather.visibility < 3) return "severe"
                return "warning"
              })()

              const expiryDate = new Date()
              expiryDate.setHours(expiryDate.getHours() + 3)
              const expiryTime = expiryDate.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })

              return (
                <EnhancedWeatherAlert
                  key={index}
                  type={alert.type}
                  message={alert.message}
                  locale={locale}
                  severity={severity}
                  expiresAt={expiryTime}
                  recommendations={recommendations}
                />
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <WeatherAnimation
              type={currentWeather.condition}
              className="mb-4 h-48 relative overflow-hidden rounded-lg"
            />

            <Card className="mb-4 overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white">
                <CardTitle className="text-2xl">{formatDate(currentWeather.date, "EEEE, MMMM d", locale)}</CardTitle>
                <CardDescription className="text-blue-100 dark:text-blue-200">
                  {activeIndex === 0
                    ? getTranslation("today", locale)
                    : `${activeIndex} ${
                        activeIndex === 1 ? getTranslation("dayAgo", locale) : getTranslation("daysAgo", locale)
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    {currentWeather.icon && (
                      <currentWeather.icon size={64} className="text-blue-500 dark:text-blue-400" />
                    )}
                    <div className="ml-4">
                      <h2 className="text-3xl font-bold">{currentWeather.temp?.current}°C</h2>
                      <div className="flex text-sm text-gray-600 dark:text-gray-300 gap-2">
                        <span>H: {currentWeather.temp?.max}°</span>
                        <span>L: {currentWeather.temp?.min}°</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <ThermometerSun size={16} className="text-orange-500" />
                        <span>
                          {getTranslation("feelsLike", locale)}: {currentWeather.feelsLike}°
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {getTranslation(currentWeather.condition, locale)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Droplets className="text-blue-500 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation("humidity", locale)}</p>
                        <p className="font-medium">{currentWeather.humidity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Umbrella className="text-blue-500 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getTranslation("precipitation", locale)}
                        </p>
                        <p className="font-medium">{currentWeather.precipitation}%</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Wind className="text-blue-500 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation("wind", locale)}</p>
                        <p className="font-medium">
                          {currentWeather.windSpeed} {getTranslation("kmh", locale)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Compass className="text-blue-500 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getTranslation("direction", locale)}
                        </p>
                        <p className="font-medium">{currentWeather.windDirection}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Sun className="text-orange-500 dark:text-orange-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation("uvIndex", locale)}</p>
                        <p className="font-medium">
                          {currentWeather.uvIndex} {getTranslation("of10", locale)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Eye className="text-blue-500 dark:text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getTranslation("visibility", locale)}
                        </p>
                        <p className="font-medium">
                          {currentWeather.visibility} {getTranslation("km", locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Sunrise className="text-orange-500 mr-1" size={16} />
                    <span>
                      {getTranslation("sunrise", locale)}: {currentWeather.sunrise}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="text-blue-500 mr-1" size={16} />
                    <span>
                      {currentWeather.pressure} {getTranslation("hPa", locale)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Sunset className="text-orange-500 mr-1" size={16} />
                    <span>
                      {getTranslation("sunset", locale)}: {currentWeather.sunset}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">{getTranslation("airQuality", locale)}</h3>
                  {currentWeather.airQuality && (
                    <AirQualityIndicator
                      index={currentWeather.airQuality.index}
                      level={currentWeather.airQuality.level}
                      locale={locale}
                    />
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="daily">{getTranslation("dailyForecast", locale)}</TabsTrigger>
                    <TabsTrigger value="hourly">{getTranslation("hourlyForecast", locale)}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="daily" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
                      {weatherData.map((day, idx) => (
                        <Card
                          key={idx}
                          className={`cursor-pointer transition-all ${
                            activeIndex === idx ? "border-2 border-blue-500" : ""
                          }`}
                          onClick={() => setActiveIndex(idx)}
                        >
                          <CardContent className="p-2 text-center">
                            <p className="text-xs">{formatDate(day.date, "EEE", locale)}</p>
                            <day.icon size={24} className="mx-auto my-1 text-blue-500" />
                            <div className="flex justify-center gap-2 text-xs">
                              <span className="font-medium">{day.temp.max}°</span>
                              <span className="text-gray-500">{day.temp.min}°</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      variant="link"
                      className="mt-2 w-full"
                      onClick={() => setShowExtendedForecast(!showExtendedForecast)}
                    >
                      {showExtendedForecast
                        ? getTranslation("hideExtendedForecast", locale)
                        : getTranslation("showExtendedForecast", locale)}
                    </Button>
                  </TabsContent>

                  <TabsContent value="hourly" className="mt-4">
                    <Carousel
                      opts={{
                        align: "start",
                      }}
                    >
                      <CarouselContent>
                        {currentWeather.hourlyForecasts?.map((hour, idx) => (
                          <CarouselItem key={idx} className="basis-1/4 md:basis-1/6 lg:basis-1/8">
                            <Card>
                              <CardContent className="p-2 text-center">
                                <p className="text-xs">{formatDate(hour.time, "h a", locale)}</p>
                                <hour.icon size={24} className="mx-auto my-1 text-blue-500" />
                                <p className="font-medium text-sm">{hour.temp}°</p>
                                <p className="text-xs text-gray-500">
                                  {getTranslation("feelsLike", locale)}: {hour.feelsLike}°
                                </p>
                                <div className="flex items-center justify-center mt-1">
                                  <Wind size={12} className="text-gray-500 mr-1" />
                                  <span className="text-xs">{hour.windSpeed}</span>
                                </div>
                                <div className="flex items-center justify-center">
                                  <Droplets size={12} className="text-blue-500 mr-1" />
                                  <span className="text-xs">{hour.precipitation}%</span>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </Carousel>
                  </TabsContent>
                </Tabs>
              </CardFooter>
            </Card>

            {showExtendedForecast && (
              <ExtendedForecast
                days={14}
                currentCondition={currentWeather.condition}
                weatherTypes={weatherTypes}
                locale={locale}
              />
            )}

            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full bg-white/80 dark:bg-gray-800/80"
                onClick={() => setShowWeatherMap(!showWeatherMap)}
              >
                {showWeatherMap ? getTranslation("hideWeatherMap", locale) : getTranslation("showWeatherMap", locale)}
              </Button>
            </div>

            {showWeatherMap && (
              <SimpleWeatherMap
                location={locations.find((loc) => loc.id === selectedLocation)?.name || ""}
                mapType="temperature"
                locale={locale}
                countryCode={locations.find((loc) => loc.id === selectedLocation)?.country || "US"}
              />
            )}
          </div>

          <div className="space-y-4">
            <FavoriteLocations
              locations={locations}
              currentLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              locale={locale}
            />

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{getTranslation("last7Days", locale)}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <Carousel
                  className="w-full"
                  onSelect={(index) => setActiveIndex(index)}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {weatherData.map((day, index) => (
                      <CarouselItem key={index} className="basis-full">
                        <div className="p-1">
                          <Card
                            className={`cursor-pointer transition-all ${
                              activeIndex === index
                                ? "border-2 border-blue-500 dark:border-blue-400 shadow-lg"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => setActiveIndex(index)}
                          >
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                              <p className="text-sm font-medium mb-2">{formatDate(day.date, "EEE, MMM d", locale)}</p>
                              {day.icon && <day.icon size={32} className="text-blue-500 dark:text-blue-400 mb-2" />}
                              <div className="flex items-center gap-2">
                                <Thermometer size={16} className="text-red-500" />
                                <span className="font-bold">{day.temp.current}°C</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {getTranslation(day.condition, locale)}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Wind size={12} className="mr-1" />
                                <span>
                                  {day.windSpeed} {getTranslation("kmh", locale)}
                                </span>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Droplets size={12} className="mr-1" />
                                <span>
                                  {getTranslation("rain", locale)}: {day.chanceOfRain}%
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{getTranslation("precipitationChance", locale)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weatherData.slice(0, 5).map((day, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-20 text-sm">{formatDate(day.date, "EEE", locale)}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-500"
                            style={{ width: `${day.chanceOfRain}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm">{day.chanceOfRain}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

