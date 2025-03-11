"use client"

import { useState, useEffect } from "react"
import { Star, StarOff, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTranslation } from "@/lib/translations"

type Location = {
  id: string
  name: string
  country: string
}

type FavoriteLocationsProps = {
  locations: Location[]
  currentLocation: string
  onSelectLocation: (locationId: string) => void
  locale: string
}

export function FavoriteLocations({ locations, currentLocation, onSelectLocation, locale }: FavoriteLocationsProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteLocations")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("favoriteLocations", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (locationId: string) => {
    if (favorites.includes(locationId)) {
      setFavorites(favorites.filter((id) => id !== locationId))
    } else {
      setFavorites([...favorites, locationId])
    }
  }

  const isFavorite = (locationId: string) => favorites.includes(locationId)

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.country.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const favoriteLocations = locations.filter((location) => favorites.includes(location.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{getTranslation("favoriteLocations", locale)}</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{getTranslation("addFavoriteLocations", locale)}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder={getTranslation("searchLocation", locale)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        <span>
                          {location.name}, {location.country}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(location.id)}>
                          {isFavorite(location.id) ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favoriteLocations.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {favoriteLocations.map((location) => (
              <Button
                key={location.id}
                variant={location.id === currentLocation ? "default" : "outline"}
                className="justify-start"
                onClick={() => onSelectLocation(location.id)}
              >
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                <span className="truncate">{location.name}</span>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">{getTranslation("noFavoriteLocations", locale)}</p>
        )}
      </CardContent>
    </Card>
  )
}

