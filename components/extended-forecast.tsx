import type React from "react"
import { addDays } from "date-fns"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getTranslation, formatDate } from "@/lib/translations"

type ForecastDay = {
  date: Date
  condition: string
  icon: React.ElementType
  temp: {
    min: number
    max: number
  }
  precipitation: number
  windSpeed: number
  humidity: number
}

type ExtendedForecastProps = {
  days: number
  currentCondition: string
  weatherTypes: Record<string, { icon: React.ElementType }>
  locale: string
}

export function ExtendedForecast({ days = 14, currentCondition, weatherTypes, locale }: ExtendedForecastProps) {
  const today = new Date()

  const generateExtendedForecast = (): ForecastDay[] => {
    const conditions = Object.keys(weatherTypes)
    let lastCondition = currentCondition

    return Array.from({ length: days }).map((_, index) => {
      const date = addDays(today, index + 1)

      if (Math.random() > 0.7) {
        lastCondition = conditions[Math.floor(Math.random() * conditions.length)]
      }

      return {
        date,
        condition: lastCondition,
        icon: weatherTypes[lastCondition].icon,
        temp: {
          min: Math.round(15 + Math.random() * 10),
          max: Math.round(25 + Math.random() * 10),
        },
        precipitation: Math.round(Math.random() * 100),
        windSpeed: Math.round(5 + Math.random() * 20),
        humidity: Math.round(40 + Math.random() * 50),
      }
    })
  }

  const extendedForecast = generateExtendedForecast()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {days}-{getTranslation("extendedForecast", locale)}
          </span>
          <ChevronRight className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation("date", locale) || "Date"}</TableHead>
              <TableHead>{getTranslation("condition", locale) || "Condition"}</TableHead>
              <TableHead>{getTranslation("temperature", locale)} (°C)</TableHead>
              <TableHead className="hidden md:table-cell">{getTranslation("precipitation", locale)}</TableHead>
              <TableHead className="hidden md:table-cell">{getTranslation("wind", locale)}</TableHead>
              <TableHead className="hidden md:table-cell">{getTranslation("humidity", locale)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extendedForecast.map((day, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{formatDate(day.date, "EEE", locale)}</div>
                  <div className="text-xs text-gray-500">{formatDate(day.date, "MMM d", locale)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <day.icon className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="hidden sm:inline">{getTranslation(day.condition, locale)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <span className="font-medium">{day.temp.max}°</span>
                    <span className="text-gray-500">{day.temp.min}°</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{day.precipitation}%</TableCell>
                <TableCell className="hidden md:table-cell">
                  {day.windSpeed} {getTranslation("kmh", locale)}
                </TableCell>
                <TableCell className="hidden md:table-cell">{day.humidity}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

