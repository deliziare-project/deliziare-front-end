'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type Props = {
  onLocationChange: (lat: number, lng: number) => void;
   initialLocation?: { lat: number; lng: number };
};

function LocationMarker({
  position,
  setPosition,
  onLocationChange,
}: {
  position: { lat: number; lng: number } | null;
  setPosition: (pos: { lat: number; lng: number }) => void;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition(newPos);
      onLocationChange(newPos.lat, newPos.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);
  return null;
}

export default function ChefLocationPicker({ onLocationChange,initialLocation }: Props) {
  const fallback: [number, number] = [20, 78];
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>( initialLocation ?? null);
  const [mapCenter, setMapCenter] = useState<[number, number]>( initialLocation ? [initialLocation.lat, initialLocation.lng] : fallback);
  const [searchQuery, setSearchQuery] = useState('');

    

  // useEffect to update state if initialLocation changes (optional)
  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
      setMapCenter([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const userPos: [number, number] = [latitude, longitude];
          setMapCenter(userPos);
          const posObj = { lat: latitude, lng: longitude };
          setPosition(posObj);
          onLocationChange(latitude, longitude);
        },
        () => {
          setPosition({ lat: fallback[0], lng: fallback[1] });
          onLocationChange(fallback[0], fallback[1]);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setPosition({ lat: fallback[0], lng: fallback[1] });
      onLocationChange(fallback[0], fallback[1]);
    }
  }, []);

  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPosition({ lat, lng: lon });
        setMapCenter([lat, lon]);
        onLocationChange(lat, lon);
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      alert('Failed to find location');
    }
  };

  return (
    <div className="w-full mt-4">
      {/* Search input */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
        />
        <button
          onClick={handleSearch}
          type="button"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Search
        </button>
      </div>

      {/* Map */}
      <div className="h-64 w-full rounded overflow-hidden">
        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationChange={onLocationChange}
          />
        </MapContainer>
      </div>
    </div>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Configure leaflet marker icons
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x.src,
//   iconUrl: markerIcon.src,
//   shadowUrl: markerShadow.src,
// });

// type Props = {
//   onLocationChange?: (lat: number, lng: number) => void; // Make optional
//   initialLocation?: { lat: number; lng: number };
//   value?: { lat: number; lng: number }; // For controlled usage
//   onChange?: (location: { lat: number; lng: number }) => void; // For controlled usage
// };

// function LocationMarker({
//   position,
//   setPosition,
//   onLocationChange,
// }: {
//   position?: { lat: number; lng: number };
//   setPosition: (pos: { lat: number; lng: number }) => void;
//   onLocationChange?: (lat: number, lng: number) => void;
// }) {
//   useMapEvents({
//     click(e) {
//       const newPos = e.latlng;
//       setPosition(newPos);
//       onLocationChange?.(newPos.lat, newPos.lng);
//     },
//   });

//   return position ? <Marker position={position} /> : null;
// }

// function MapUpdater({ center }: { center: [number, number] }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, map.getZoom());
//   }, [center]);
//   return null;
// }

// export default function ChefLocationPicker({ 
//   value, 
//   onChange, 
//   initialLocation 
// }: Props) {
//   const fallback: [number, number] = [20, 78];
//   const [mapCenter, setMapCenter] = useState<[number, number]>(fallback);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Initialize with the current value or initial location
//   useEffect(() => {
//     if (value) {
//       setMapCenter([value.lat, value.lng]);
//     } else if (initialLocation) {
//       setMapCenter([initialLocation.lat, initialLocation.lng]);
//       onChange?.(initialLocation); // Propagate initial location up
//     } else {
//       // Default behavior - get current location
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (pos) => {
//             const { latitude, longitude } = pos.coords;
//             const newLocation = { lat: latitude, lng: longitude };
//             setMapCenter([latitude, longitude]);
//             onChange?.(newLocation);
//           },
//           () => {
//             const fallbackLocation = { lat: fallback[0], lng: fallback[1] };
//             setMapCenter(fallback);
//             onChange?.(fallbackLocation);
//           },
//           { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//         );
//       } else {
//         const fallbackLocation = { lat: fallback[0], lng: fallback[1] };
//         setMapCenter(fallback);
//         onChange?.(fallbackLocation);
//       }
//     }
//   }, [value, initialLocation]); // React to value changes

//   const handleLocationUpdate = (lat: number, lng: number) => {
//     const newLocation = { lat, lng };
//     setMapCenter([lat, lng]);
//     onChange?.(newLocation); // Always propagate changes up
//   };

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;

//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
//       );
//       const data = await res.json();
//       if (data && data.length > 0) {
//         const lat = parseFloat(data[0].lat);
//         const lon = parseFloat(data[0].lon);
//         handleLocationUpdate(lat, lon);
//       } else {
//         alert('Location not found');
//       }
//     } catch (err) {
//       console.error('Geocoding error:', err);
//       alert('Failed to find location');
//     }
//   };

//   return (
//     <div className="w-full mt-4">
//       {/* Search input and button */}
//       <div className="flex gap-2 mb-2">
//         <input
//           type="text"
//           placeholder="Search a location"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
//         />
//         <button
//           onClick={handleSearch}
//           type="button"
//           className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
//         >
//           Search
//         </button>
//       </div>

//       {/* Map container */}
//       <div className="h-64 w-full rounded overflow-hidden">
//         <MapContainer 
//           center={mapCenter} 
//           zoom={12} 
//           scrollWheelZoom={true} 
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <MapUpdater center={mapCenter} />
//           <LocationMarker
//             position={value || undefined}
//             setPosition={(pos) => handleLocationUpdate(pos.lat, pos.lng)}
//             onLocationChange={handleLocationUpdate}
//           />
//         </MapContainer>
//       </div>
//     </div>
//   );
// }
