'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import axiosInstance from '@/api/axiosInstance'
import { Map as LeafletMap } from 'leaflet'
import { showSuccess } from '@/components/shared/ToastUtilis'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false })

const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_KEY!

interface Coordinates {
  lat: number
  lng: number
}



const FitBounds: React.FC<{ from: Coordinates; to: Coordinates }> = ({ from, to }) => {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds([from, to])
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [from, to, map])

  return null
}

const Routing: React.FC<{ from: Coordinates; to: Coordinates }> = ({ from, to }) => {
  const map = useMap()

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [from.lng, from.lat],
              [to.lng, to.lat]
            ]
          },
          {
            headers: {
              Authorization: ORS_API_KEY,
              'Content-Type': 'application/json'
            }
          }
        )

        const coords: [number, number][] = res.data.features[0].geometry.coordinates
        const latLngs: [number, number][] = coords.map(([lng, lat]) => [lat, lng] as [number, number])

        L.polyline(latLngs, {
          color: '#7B61FF',
          weight: 5,
          opacity: 0.9,
          dashArray: '8,6',
        }).addTo(map)
      } catch (err) {
        console.error('Failed to fetch route:', err)
      }
    }

    fetchRoute()
  }, [from, to, map])

  return null
}

const SetMapRef: React.FC<{ mapRef: React.MutableRefObject<LeafletMap | null> }> = ({ mapRef }) => {
  const map = useMap()

  useEffect(() => {
    mapRef.current = map
  }, [map])

  return null
}

interface DeliveryMapProps {
  mapHeight?: string;
  refreshOrders: () => void;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ mapHeight = '100vh', refreshOrders }) => {
 
  const order = useSelector((state: RootState) => state.delivery.selectedOrder)
  const [leafletReady, setLeafletReady] = useState(false)
  const [showPickupButton, setShowPickupButton] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null)
  const [isPickedUp, setIsPickedUp] = useState(false) 
  const [showDeliverButton,setShowDeliverButton]=useState(false)
  const [isDelivered,setIsDelivered]=useState(false)

  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (order?.status === 'picked up'|| order?.status === 'delivered') {
      setIsPickedUp(true)
    }
    if (order?.status === 'delivered') {
    setIsDelivered(true)
  }
  }, [order])



  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('leaflet/dist/leaflet.css')
      setLeafletReady(true)
    }
  }, [])

  const handleDeliveredClick=()=>{
    if(!order) return 
    axiosInstance
    .post(`/delivery/${order._id}/deliver`)
    .then(()=>{
         setShowDeliverButton(false)
         setIsDelivered(true)
         showSuccess('Order marked as delivered')
         refreshOrders() 
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  const handlePickupClick = () => {
    if (!order) return
    console.log('orderId', order._id)
    axiosInstance
      .post(`/delivery/${order._id}/pickup`)
      .then(() => {
        setShowPickupButton(false)
        setIsPickedUp(true) 
       showSuccess('Order marked as picked up')
       refreshOrders() 
      })
      .catch(err => {
        console.error(err)
        
      })
  }

  const onPickupMarkerClick = (e: any) => {
    if (isPickedUp) return 
    const map = mapRef.current
    if (!map) return

    const containerPoint = map.latLngToContainerPoint(e.latlng)

    setButtonPosition({
      top: containerPoint.y,
      left: containerPoint.x
    })

    setShowPickupButton(true)
  }


  const onDeliverClick = (e: any) => {
  if (!isPickedUp || isDelivered) return
  const map = mapRef.current
  if (!map) return

  const containerPoint = map.latLngToContainerPoint(e.latlng)
  setButtonPosition({ top: containerPoint.y, left: containerPoint.x })
  setShowDeliverButton(true)
  
}



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
    iconAnchor: [18, 36]
  })

  const endIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
  })

 
  return (
    <div className="relative w-full">
      {showPickupButton && buttonPosition && (
        <div
          className="absolute z-[1000]"
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={handlePickupClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
          >
            Mark as Picked Up
          </button>
        </div>
      )}

      {showDeliverButton && buttonPosition && (
        <div
          className="absolute z-[1000]"
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={handleDeliveredClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Mark as Delivered
          </button>
        </div>
      )}


      <MapContainer
        center={startingPoint}
        zoom={13}
        style={{ height: mapHeight, width: '100%' }}
        className="rounded-lg shadow-lg my-5"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <SetMapRef mapRef={mapRef} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={startingPoint} icon={startIcon} eventHandlers={{ click: onPickupMarkerClick }}>
          <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent
          className={`!rounded-md !px-2 !py-1 !text-sm !font-semibold ${
            isPickedUp ? '!bg-green-500 !text-white' : '!bg-yellow-400 !text-black'
          }`}
          >
            {isPickedUp ? 'Picked' : 'Pickup'}
          </Tooltip>
        </Marker>

        <Marker position={endingPoint} icon={endIcon} eventHandlers={{click:onDeliverClick}}>
          <Tooltip direction="top" offset={[0, -20]} 
          opacity={1}
          permanent
          className={`!rounded-md !px-2 !py-1 !text-sm !font-semibold ${
            isDelivered ? '!bg-green-500 !text-white' : '!bg-yellow-400 !text-black'
          }`}
          >
            {isDelivered?'Delivered':'Deliver'}
          </Tooltip>
        </Marker>

        <FitBounds from={startingPoint} to={endingPoint} />
        <Routing from={startingPoint} to={endingPoint} />
      </MapContainer>

       {!isDelivered && (
  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[1000]">
    {!isPickedUp && (
      <button
        onClick={handlePickupClick}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-full shadow-lg"
      >
        Mark as Picked Up
      </button>
    )}

    {isPickedUp && !isDelivered && (
      <button
        onClick={handleDeliveredClick}
        className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-full shadow-lg"
      >
        Mark as Delivered
      </button>
    )}
  </div>
)}


    </div>
  )
}

export default DeliveryMap
