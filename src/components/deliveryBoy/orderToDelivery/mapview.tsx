'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L, { Icon, LatLngExpression } from 'leaflet'
import axios from 'axios'
import { Tooltip } from 'react-leaflet'


const ORS_API_KEY = process.env.MAP_KEY

interface Coordinates {
  lat: number
  lng: number
}

interface RoutingProps {
  from: Coordinates
  to: Coordinates
}

const Routing: React.FC<RoutingProps> = ({ from, to }) => {
  const map = useMap()

  React.useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [from.lng, from.lat],
              [to.lng, to.lat],
            ],
          },
          {
            headers: {
              Authorization: ORS_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        )

        const features = response.data.features
        if (!features || features.length === 0) {
          console.error('No route found.')
          return
        }

        const coords: [number, number][] = features[0].geometry.coordinates
        const latLngs: LatLngExpression[] = coords.map(([lng, lat]) => [lat, lng])
        const routeLine = L.polyline(latLngs, { color: '#3b82f6', weight: 5 }).addTo(map) // Tailwind blue-500 color
        map.fitBounds(routeLine.getBounds())
      } catch (error: any) {
        console.error('ORS routing error:', error.response?.data || error.message)
      }
    }

    if (from && to) fetchRoute()
  }, [from, to, map])

  return null
}

const FitBounds: React.FC<{ from: Coordinates; to: Coordinates }> = ({ from, to }) => {
  const map = useMap()

  React.useEffect(() => {
    if (from && to) {
      const bounds = L.latLngBounds([
        [from.lat, from.lng],
        [to.lat, to.lng],
      ])
      map.fitBounds(bounds, { padding: [50, 50] }) 
    }
  }, [from, to, map])

  return null
}

const DeliveryMap: React.FC<{ mapHeight?: string }> = ({ mapHeight = '100vh' }) => {
  const order = useSelector((state: RootState) => state.delivery.selectedOrder)

  if (!order || !order.chefLocation || !order.bidId?.postId?.location) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 font-semibold text-lg">
        Loading map...
      </div>
    )
  }

  const startingPoint = order.chefLocation
  const endingPoint = order.bidId.postId.location

  const startIcon = new Icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })

  const endIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })

  return (
    <MapContainer
      center={startingPoint}
      zoom={13}
      style={{ height: mapHeight, width: '100%' }}
      className="rounded-lg shadow-lg my-5"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

        <Marker position={startingPoint} icon={startIcon}>
        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
            Pickup
        </Tooltip>
        </Marker>

        <Marker position={endingPoint} icon={endIcon}>
        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
            Deliver
        </Tooltip>
        </Marker>

      <Routing from={startingPoint} to={endingPoint} />
      <FitBounds from={startingPoint} to={endingPoint} />

    </MapContainer>
  )
}

export default DeliveryMap
