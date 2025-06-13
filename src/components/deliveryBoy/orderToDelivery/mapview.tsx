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
  const [showDeliverButton, setShowDeliverButton] = useState(false)
  const [isDelivered, setIsDelivered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    if (order?.status === 'picked up' || order?.status === 'delivered') {
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

  const handleAction = async (action: 'pickup' | 'deliver') => {
    if (!order) return
    
    setIsLoading(true)
    try {
      const endpoint = action === 'pickup' ? 'pickup' : 'deliver'
      await axiosInstance.post(`/delivery/${order._id}/${endpoint}`)
      
      if (action === 'pickup') {
        setShowPickupButton(false)
        setIsPickedUp(true)
      } else {
        setShowDeliverButton(false)
        setIsDelivered(true)
      }
      
      showSuccess(`Order marked as ${action === 'pickup' ? 'picked up' : 'delivered'}`)
      refreshOrders()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onMarkerClick = (e: any, type: 'pickup' | 'deliver') => {
    if ((type === 'pickup' && isPickedUp) || (type === 'deliver' && (!isPickedUp || isDelivered))) return
    
    const map = mapRef.current
    if (!map) return

    const containerPoint = map.latLngToContainerPoint(e.latlng)
    setButtonPosition({ top: containerPoint.y, left: containerPoint.x })
    
    if (type === 'pickup') {
      setShowPickupButton(true)
      setShowDeliverButton(false)
    } else {
      setShowDeliverButton(true)
      setShowPickupButton(false)
    }
  }

  if (!order || !leafletReady || !order.chefLocation || !order.bidId?.postId?.location) {
    return (
      <div className="flex justify-center items-center h-52">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B61FF]"></div>
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
    <div className="relative w-full rounded-xl overflow-hidden shadow-xl border border-gray-200">
      {/* Floating action buttons */}
      {showPickupButton && buttonPosition && (
        <div
          className="absolute z-[1000] animate-fade-in"
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={() => handleAction('pickup')}
            disabled={isLoading}
            className="bg-[#7B61FF] hover:bg-[#6a50e0] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            Mark as Picked Up
          </button>
        </div>
      )}

      {showDeliverButton && buttonPosition && (
        <div
          className="absolute z-[1000] animate-fade-in"
          style={{
            top: buttonPosition.top,
            left: buttonPosition.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <button
            onClick={() => handleAction('deliver')}
            disabled={isLoading}
            className="bg-[#10B981] hover:bg-[#0ea371] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
              </svg>
            )}
            Mark as Delivered
          </button>
        </div>
      )}

      {/* Main Map */}
      <MapContainer
        center={startingPoint}
        zoom={13}
        style={{ height: mapHeight, width: '100%' }}
        className="z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <SetMapRef mapRef={mapRef} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker 
          position={startingPoint} 
          icon={startIcon} 
          eventHandlers={{ click: (e) => onMarkerClick(e, 'pickup') }}
        >
          <Tooltip 
            direction="top" 
            offset={[0, -20]} 
            opacity={1} 
            permanent
            className={`!rounded-lg !px-3 !py-1 !text-sm !font-semibold !shadow-md ${
              isPickedUp ? '!bg-green-500 !text-white' : '!bg-yellow-400 !text-gray-800'
            }`}
          >
            <div className="flex items-center gap-1">
              {isPickedUp ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              )}
              {isPickedUp ? 'Picked Up' : 'Pickup Location'}
            </div>
          </Tooltip>
        </Marker>

        <Marker 
          position={endingPoint} 
          icon={endIcon} 
          eventHandlers={{ click: (e) => onMarkerClick(e, 'deliver') }}
        >
          <Tooltip 
            direction="top" 
            offset={[0, -20]} 
            opacity={1}
            permanent
            className={`!rounded-lg !px-3 !py-1 !text-sm !font-semibold !shadow-md ${
              isDelivered ? '!bg-green-500 !text-white' : '!bg-[#7B61FF] !text-white'
            }`}
          >
            <div className="flex items-center gap-1">
              {isDelivered ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
                </svg>
              )}
              {isDelivered ? 'Delivered' : 'Delivery Location'}
            </div>
          </Tooltip>
        </Marker>

        <FitBounds from={startingPoint} to={endingPoint} />
        <Routing from={startingPoint} to={endingPoint} />
      </MapContainer>

      {/* Bottom action buttons */}
      {!isDelivered && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[1000] flex gap-4">
          {!isPickedUp && (
            <button
              onClick={() => handleAction('pickup')}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg font-medium transition-all transform hover:scale-105 ${
                isLoading ? 'bg-[#7B61FF]/80' : 'bg-[#7B61FF] hover:bg-[#6a50e0]'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mark as Picked Up
                </>
              )}
            </button>
          )}

          {isPickedUp && !isDelivered && (
            <button
              onClick={() => handleAction('deliver')}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-lg font-medium transition-all transform hover:scale-105 ${
                isLoading ? 'bg-[#10B981]/80' : 'bg-[#10B981] hover:bg-[#0ea371]'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
                  </svg>
                  Mark as Delivered
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DeliveryMap