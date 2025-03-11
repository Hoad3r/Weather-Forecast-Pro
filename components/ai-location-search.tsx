"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslation } from "@/lib/translations"
import { Badge } from "@/components/ui/badge"

type Location = {
  id: string
  name: string
  country: string
}

type AILocationSearchProps = {
  locations: Location[]
  currentLocation: string
  onSelectLocation: (locationId: string) => void
  locale: string
}

export function AILocationSearch({ locations, currentLocation, onSelectLocation, locale }: AILocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Location[]>([])
  const [recentSearches, setRecentSearches] = useState<Location[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentLocationSearches")
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches)
        setRecentSearches(parsed)
      } catch (e) {
        console.error("Failed to parse recent searches", e)
      }
    }
  }, [])

  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recentLocationSearches", JSON.stringify(recentSearches))
    }
  }, [recentSearches])

  const searchLocations = (query: string) => {
    setIsLoading(true)

    setTimeout(() => {
      if (!query.trim()) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      const results = locations.filter((location) => {
        const directNameMatch = location.name.toLowerCase().includes(query.toLowerCase())
        const directCountryMatch = location.country.toLowerCase().includes(query.toLowerCase())

        const fuzzyMatches = [
          { term: "brasil", match: location.country === "BR" },
          { term: "brazil", match: location.country === "BR" },
          { term: "rio", match: location.name === "Rio de Janeiro" },
          { term: "sampa", match: location.name === "São Paulo" },
          { term: "sp", match: location.name === "São Paulo" },
          { term: "rj", match: location.name === "Rio de Janeiro" },
          { term: "df", match: location.name === "Brasília" },

          {
            term: "northeast",
            match: [
              "Recife",
              "Fortaleza",
              "Salvador",
              "Natal",
              "João Pessoa",
              "Maceió",
              "São Luís",
              "Teresina",
              "Aracaju",
            ].includes(location.name),
          },
          {
            term: "north",
            match: ["Manaus", "Belém", "Porto Velho", "Boa Vista", "Macapá", "Rio Branco", "Palmas"].includes(
              location.name,
            ),
          },
          { term: "south", match: ["Porto Alegre", "Curitiba", "Florianópolis"].includes(location.name) },
          {
            term: "southeast",
            match: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Vitória"].includes(location.name),
          },
          { term: "midwest", match: ["Brasília", "Goiânia", "Cuiabá", "Campo Grande"].includes(location.name) },

          {
            term: "beach",
            match: [
              "Rio de Janeiro",
              "Fernando de Noronha",
              "Búzios",
              "Salvador",
              "Fortaleza",
              "Recife",
              "Natal",
            ].includes(location.name),
          },
          { term: "mountain", match: ["Gramado", "Chapada Diamantina", "Petrópolis"].includes(location.name) },
          {
            term: "nature",
            match: ["Amazônia", "Pantanal", "Bonito", "Chapada Diamantina", "Fernando de Noronha"].includes(
              location.name,
            ),
          },
          { term: "waterfall", match: ["Foz do Iguaçu", "Chapada Diamantina", "Bonito"].includes(location.name) },
        ]

        const hasFuzzyMatch = fuzzyMatches.some((fuzzy) => query.toLowerCase().includes(fuzzy.term) && fuzzy.match)

        return directNameMatch || directCountryMatch || hasFuzzyMatch
      })

      const sortedResults = results.sort((a, b) => {
        const aExactMatch = a.name.toLowerCase() === query.toLowerCase()
        const bExactMatch = b.name.toLowerCase() === query.toLowerCase()

        if (aExactMatch && !bExactMatch) return -1
        if (!aExactMatch && bExactMatch) return 1

        const aStartsWith = a.name.toLowerCase().startsWith(query.toLowerCase())
        const bStartsWith = b.name.toLowerCase().startsWith(query.toLowerCase())

        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1

        const isBrazilQuery = query.toLowerCase().includes("brazil") || query.toLowerCase().includes("brasil")
        if (isBrazilQuery) {
          if (a.country === "BR" && b.country !== "BR") return -1
          if (a.country !== "BR" && b.country === "BR") return 1
        }

        return a.name.localeCompare(b.name)
      })

      setSuggestions(sortedResults)
      setIsLoading(false)
    }, 300) 
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSuggestions(true)
    searchLocations(query)
  }

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location.id)
    setSearchQuery("")
    setShowSuggestions(false)

    if (!recentSearches.some((item) => item.id === location.id)) {
      setRecentSearches((prev) => [location, ...prev].slice(0, 5))
    } else {
      setRecentSearches((prev) => [location, ...prev.filter((item) => item.id !== location.id)].slice(0, 5))
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSuggestions([])
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          placeholder={getTranslation("searchLocation", locale)}
          value={searchQuery}
          onChange={handleSearch}
          className="pr-16"
        />
        <div className="absolute right-2 top-2.5 flex items-center">
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>}
          {searchQuery ? (
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={clearSearch}>
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          ) : (
            <Search className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {showSuggestions && (searchQuery || recentSearches.length > 0) && (
        <Card className="absolute z-10 w-full mt-1 max-h-80 overflow-auto">
          <CardContent className="p-2">
            {searchQuery && suggestions.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 px-2">{getTranslation("searchResults", locale)}</p>
                <div className="space-y-1">
                  {suggestions.map((location) => (
                    <Button
                      key={location.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="mr-1">{location.name},</span>
                      <Badge variant="outline" className="ml-auto">
                        {location.country}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && suggestions.length === 0 && !isLoading && (
              <p className="text-sm text-gray-500 p-2">{getTranslation("noLocationsFound", locale)}</p>
            )}

            {!searchQuery && recentSearches.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1 px-2">{getTranslation("recentSearches", locale)}</p>
                <div className="space-y-1">
                  {recentSearches.map((location) => (
                    <Button
                      key={location.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="mr-1">{location.name},</span>
                      <Badge variant="outline" className="ml-auto">
                        {location.country}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

