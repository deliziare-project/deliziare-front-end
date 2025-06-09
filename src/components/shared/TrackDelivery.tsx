'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import io, { Socket } from 'socket.io-client'


interface Coordinates {
  lat: number
  lng: number
}

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  transports: ['websocket'],
  withCredentials: true,
})

const TrackDelivery: React.FC = () => {
  const [position, setPosition] = useState<Coordinates | null>(null)

  useEffect(() => {
     socket.on('newLocation', (data: Coordinates) => {
      console.log('📍 Received new location:', data)
      setPosition(data)
    })

    return () => {
      socket.off('newLocation')
    }
  }, [])

  if (!position) {
    return (
      <div className="text-center font-medium text-gray-500 py-5">
        Waiting for delivery location...
      </div>
    )
  }

  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={15}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToMarker position={position} />
    </MapContainer>
  )
}

interface FlyToMarkerProps {
  position: LatLngExpression
}

const FlyToMarker: React.FC<FlyToMarkerProps> = ({ position }) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, 15)
  }, [position, map])

  return <Marker position={position} />
}

export default TrackDelivery
