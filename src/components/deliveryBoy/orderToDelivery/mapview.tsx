'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import dynamic from 'next/dynamic'

// Dynamically import react-leaflet components only on client
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false })

let L: any
if (typeof window !== 'undefined') {
  L = require('leaflet')
}

interface Coordinates {
  lat: number
  lng: number
}

interface Props {
  mapHeight?: string
}

const DeliveryMap: React.FC<Props> = ({ mapHeight = '100vh' }) => {
  const order = useSelector((state: RootState) => state.delivery.selectedOrder)
  const [leafletReady, setLeafletReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('leaflet/dist/leaflet.css') // important: load only on client
      setLeafletReady(true)
    }
  }, [])

  if (!order || !leafletReady || !order.chefLocation || !order.bidId?.postId?.location) {
    return (
      <div className="flex justify-center items-center h-52 text-gray-600 font-semibold text-lg">
        Loading map...
      </div>
    )
  }

  const startingPoint = order.chefLocation
  const endingPoint = order.bidId.postId.location

  const startIcon = new L.Icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  })

  const endIcon = new L.Icon({
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
    </MapContainer>
  )
}

export default DeliveryMap
