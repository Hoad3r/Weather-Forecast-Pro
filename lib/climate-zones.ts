export type ClimateZone = "tropical" | "subtropical" | "temperate" | "continental" | "polar" | "arid" | "mediterranean"

export interface CountryClimate {
  zone: ClimateZone
  hasSnow: boolean
  avgTemperature: {
    min: number
    max: number
  }
  humidity: number
  precipitation: number
  windiness: number
  cloudiness: number
  commonWeather: string[]
}

export const climateData: Record<string, CountryClimate> = {
  US: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: -5, max: 30 },
    humidity: 60,
    precipitation: 65,
    windiness: 60,
    cloudiness: 60,
    commonWeather: ["Sunny", "Cloudy", "Rainy", "Snowy", "Thunderstorm"],
  },
  CA: {
    zone: "continental",
    hasSnow: true,
    avgTemperature: { min: -20, max: 25 },
    humidity: 55,
    precipitation: 60,
    windiness: 65,
    cloudiness: 65,
    commonWeather: ["Snowy", "Cloudy", "Sunny", "Rainy"],
  },
  MX: {
    zone: "tropical",
    hasSnow: false,
    avgTemperature: { min: 10, max: 35 },
    humidity: 70,
    precipitation: 75,
    windiness: 50,
    cloudiness: 55,
    commonWeather: ["Sunny", "Rainy", "Thunderstorm", "Cloudy"],
  },
  BR: {
    zone: "tropical",
    hasSnow: false,
    avgTemperature: { min: 15, max: 35 },
    humidity: 80,
    precipitation: 85,
    windiness: 45,
    cloudiness: 60,
    commonWeather: ["Sunny", "Rainy", "Thunderstorm", "Cloudy", "Drizzle"],
  },
  AR: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: 0, max: 30 },
    humidity: 65,
    precipitation: 60,
    windiness: 75,
    cloudiness: 55,
    commonWeather: ["Sunny", "Cloudy", "Rainy", "Windy"],
  },
  UK: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: 0, max: 25 },
    humidity: 75,
    precipitation: 80,
    windiness: 80,
    cloudiness: 85,
    commonWeather: ["Cloudy", "Rainy", "Drizzle", "Foggy", "Snowy"],
  },
  FR: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: 0, max: 30 },
    humidity: 65,
    precipitation: 70,
    windiness: 60,
    cloudiness: 65,
    commonWeather: ["Sunny", "Cloudy", "Rainy", "Snowy"],
  },
  DE: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: -5, max: 28 },
    humidity: 70,
    precipitation: 75,
    windiness: 65,
    cloudiness: 70,
    commonWeather: ["Cloudy", "Rainy", "Snowy", "Sunny"],
  },
  IT: {
    zone: "mediterranean",
    hasSnow: true,
    avgTemperature: { min: 0, max: 32 },
    humidity: 60,
    precipitation: 65,
    windiness: 55,
    cloudiness: 50,
    commonWeather: ["Sunny", "Cloudy", "Rainy"],
  },
  ES: {
    zone: "mediterranean",
    hasSnow: true,
    avgTemperature: { min: 5, max: 35 },
    humidity: 55,
    precipitation: 50,
    windiness: 60,
    cloudiness: 45,
    commonWeather: ["Sunny", "Cloudy", "Rainy"],
  },
  RU: {
    zone: "continental",
    hasSnow: true,
    avgTemperature: { min: -30, max: 25 },
    humidity: 65,
    precipitation: 60,
    windiness: 70,
    cloudiness: 70,
    commonWeather: ["Snowy", "Cloudy", "Sunny", "Rainy"],
  },
  JP: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: -5, max: 32 },
    humidity: 70,
    precipitation: 75,
    windiness: 65,
    cloudiness: 65,
    commonWeather: ["Sunny", "Rainy", "Snowy", "Cloudy", "Thunderstorm"],
  },
  CN: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: -10, max: 35 },
    humidity: 65,
    precipitation: 70,
    windiness: 60,
    cloudiness: 65,
    commonWeather: ["Sunny", "Cloudy", "Rainy", "Snowy", "Foggy"],
  },
  IN: {
    zone: "tropical",
    hasSnow: true,
    avgTemperature: { min: 5, max: 40 },
    humidity: 75,
    precipitation: 80,
    windiness: 55,
    cloudiness: 60,
    commonWeather: ["Sunny", "Rainy", "Thunderstorm", "Cloudy"],
  },
  SG: {
    zone: "tropical",
    hasSnow: false,
    avgTemperature: { min: 23, max: 33 },
    humidity: 85,
    precipitation: 80,
    windiness: 40,
    cloudiness: 65,
    commonWeather: ["Sunny", "Rainy", "Thunderstorm", "Cloudy"],
  },
  AE: {
    zone: "arid",
    hasSnow: false,
    avgTemperature: { min: 15, max: 45 },
    humidity: 40,
    precipitation: 10,
    windiness: 60,
    cloudiness: 20,
    commonWeather: ["Sunny", "Cloudy", "Foggy"],
  },
  ZA: {
    zone: "subtropical",
    hasSnow: true,
    avgTemperature: { min: 5, max: 35 },
    humidity: 60,
    precipitation: 55,
    windiness: 65,
    cloudiness: 50,
    commonWeather: ["Sunny", "Cloudy", "Rainy", "Thunderstorm"],
  },
  EG: {
    zone: "arid",
    hasSnow: false,
    avgTemperature: { min: 10, max: 40 },
    humidity: 30,
    precipitation: 5,
    windiness: 55,
    cloudiness: 15,
    commonWeather: ["Sunny", "Cloudy", "Foggy"],
  },
  AU: {
    zone: "subtropical",
    hasSnow: true,
    avgTemperature: { min: 5, max: 40 },
    humidity: 55,
    precipitation: 50,
    windiness: 60,
    cloudiness: 45,
    commonWeather: ["Sunny", "Cloudy", "Rainy", "Thunderstorm"],
  },
  NZ: {
    zone: "temperate",
    hasSnow: true,
    avgTemperature: { min: 0, max: 28 },
    humidity: 70,
    precipitation: 75,
    windiness: 85,
    cloudiness: 70,
    commonWeather: ["Cloudy", "Rainy", "Sunny", "Snowy", "Windy"],
  },
}

export function getCountryClimate(countryCode: string): CountryClimate {
  return (
    climateData[countryCode] || {
      zone: "temperate",
      hasSnow: true,
      avgTemperature: { min: 0, max: 30 },
      humidity: 65,
      precipitation: 65,
      windiness: 60,
      cloudiness: 60,
      commonWeather: ["Sunny", "Cloudy", "Rainy", "Snowy"],
    }
  )
}

export function getAppropriateWeatherConditions(countryCode: string): string[] {
  const climate = getCountryClimate(countryCode)

  if (!climate.hasSnow) {
    return climate.commonWeather.filter((condition) => condition !== "Snowy")
  }

  return climate.commonWeather
}

export function getTemperatureRange(countryCode: string): { min: number; max: number } {
  return getCountryClimate(countryCode).avgTemperature
}

export function isWeatherConditionAppropriate(countryCode: string, condition: string): boolean {
  const appropriateConditions = getAppropriateWeatherConditions(countryCode)
  return appropriateConditions.includes(condition)
}
