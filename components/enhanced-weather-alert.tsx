"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CloudLightning, CloudRain, CloudSnow, CloudFog, X, Info, AlertCircle } from "lucide-react"
import { getTranslation } from "@/lib/translations"
import { motion, AnimatePresence } from "framer-motion"

type AlertSeverity = "warning" | "severe" | "extreme" | "advisory"

type WeatherAlertProps = {
  type: string
  message: string
  locale: string
  severity?: AlertSeverity
  expiresAt?: string
  recommendations?: string[]
}

export function EnhancedWeatherAlert({
  type,
  message,
  locale,
  severity = "warning",
  expiresAt,
  recommendations = [],
}: WeatherAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (severity !== "extreme" && severity !== "severe") {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [severity])

  const getAlertIcon = () => {
    switch (type) {
      case "Rain":
        return <CloudRain className="h-5 w-5" />
      case "Storm":
        return <CloudLightning className="h-5 w-5" />
      case "Fog":
        return <CloudFog className="h-5 w-5" />
      case "Snow":
        return <CloudSnow className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSeverityColor = () => {
    switch (severity) {
      case "advisory":
        return "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/60 dark:border-blue-600 dark:text-blue-100"
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/60 dark:border-yellow-600 dark:text-yellow-100"
      case "severe":
        return "bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/60 dark:border-orange-600 dark:text-orange-100"
      case "extreme":
        return "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/60 dark:border-red-600 dark:text-red-100"
      default:
        return "bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/60 dark:border-yellow-600 dark:text-yellow-100"
    }
  }

  const getSeverityText = () => {
    switch (severity) {
      case "advisory":
        return getTranslation("advisory", locale)
      case "warning":
        return getTranslation("warning", locale)
      case "severe":
        return getTranslation("severe", locale)
      case "extreme":
        return getTranslation("extreme", locale)
      default:
        return getTranslation("warning", locale)
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`mb-4 rounded-lg border-l-4 p-4 shadow-md ${getSeverityColor()}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">{getAlertIcon()}</div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">
                  {getTranslation(type, locale)} {getSeverityText()}
                </h3>
                {severity === "extreme" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="ml-2"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </motion.div>
                )}
              </div>
              <p className="mt-1">{getTranslation(message, locale)}</p>

              {expiresAt && (
                <p className="text-sm mt-1">
                  {getTranslation("expiresAt", locale)}: {expiresAt}
                </p>
              )}

              {recommendations.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm font-medium underline"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {isExpanded
                      ? getTranslation("hideRecommendations", locale)
                      : getTranslation("showRecommendations", locale)}
                  </button>

                  {isExpanded && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 ml-5 list-disc text-sm space-y-1"
                    >
                      {recommendations.map((rec, index) => (
                        <li key={index}>{getTranslation(rec, locale)}</li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setIsVisible(false)} className="flex-shrink-0 ml-2" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

