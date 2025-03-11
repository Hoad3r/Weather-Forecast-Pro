import { AlertCircle, CheckCircle } from "lucide-react"
import { getTranslation } from "@/lib/translations"

type AirQualityProps = {
  index: number
  level: string
  locale: string
}

export function AirQualityIndicator({ index, level, locale }: AirQualityProps) {
  const getColor = () => {
    if (index <= 50) return "bg-green-500"
    if (index <= 100) return "bg-yellow-500"
    if (index <= 150) return "bg-orange-500"
    if (index <= 200) return "bg-red-500"
    if (index <= 300) return "bg-purple-500"
    return "bg-rose-900"
  }

  const getIcon = () => {
    if (level === "Good" || level === "Moderate") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 mb-1">
        {getIcon()}
        <span className="text-sm font-medium">{getTranslation(level, locale)}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${getColor()}`} style={{ width: `${Math.min(100, index / 3)}%` }}></div>
      </div>
      <span className="text-xs mt-1">AQI: {index}</span>
    </div>
  )
}

