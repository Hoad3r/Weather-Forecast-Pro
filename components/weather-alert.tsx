import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getTranslation } from "@/lib/translations"

type WeatherAlertProps = {
  type: string
  message: string
  locale: string
}

export function WeatherAlert({ type, message, locale }: WeatherAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="ml-2">
        {getTranslation(type, locale)} {getTranslation("alert", locale)}
      </AlertTitle>
      <AlertDescription className="ml-2">{getTranslation(message, locale)}</AlertDescription>
    </Alert>
  )
}

