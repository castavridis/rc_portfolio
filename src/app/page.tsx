"use client"

import Link from 'next/link'
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES, useEffect, useState } from 'react'

function Card({ children }:{ children: React.ReactNode }): React.ReactNode {
  return (
    <div className="rounded-md p-4 border-2">
      { children }
    </div>
  )
}

type OpenMeteoSubset = {
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: 0 | 1
  weather_code: number
  cloud_cover: number
  precipitation: number
  rain: number
  showers: number
  snowfall: number
  wind_speed_10m: number
  wind_direction_10m: number
  wind_gusts_10m: number
  pressure_msl: number
  surface_pressure: DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES
}

export default function Page() {
  const [temp, setTemp] = useState(0)
  const [wind, setWind] = useState(0)

  async function fetchWeather () {
    const response: Response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=38.627003&longitude=-90.199402&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch")
    if (response.status === 200) {
      const data = response.json()
      console.log(data)
    }
  }
  useEffect(() => {
    fetchWeather()
  }, [])
  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="bg-amber-200 h-full flex items-center">
        <h2 className="text-2xl text-center">
          C is a full-stack designer and engineer who builds across the entire product development lifecycle to deliver tailored customer experiences.
        </h2>
        <div>
          {temp}
        </div>
      </div>
      <div className="flex h-full items-center justify-around">
        <Card>
          <Link href="/sandy">Sandy</Link>
          <p>Generate a small poster here based on a Calder function</p>
        </Card>
        <Card>
          <Link href="/toys">Keyboard Twister</Link>
          <p>Show the keyboard twister opening letter animation</p>
        </Card>
        <Card>
          <Link href="/">Battery Randomizer</Link>
          <p>Show the battery going in a negative direction despite charging</p>
        </Card>
        <Card>
          <Link href="/toys">Toys</Link>
        </Card>
      </div>
    </div>
  )
}