// 'use client'

// import { AppDispatch, RootState } from '@/redux/store';
// import socket, { connectSocket } from '@/socket'
// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';

// const DeliveryBoyTracker: React.FC = () => {
//    const dispatch = useDispatch<AppDispatch>();
//     const {  currentUser, loading } = useSelector((state: RootState) => state.auth);
//    const userId=currentUser?._id
//   useEffect(() => {
//       if (!userId) return;
//     connectSocket(userId)

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const coords = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         }

//         console.log('Sending location:', coords)
//         socket.emit('locationUpdate', coords)
//       },
//       (err) => {
//         console.error('Geolocation error', err)
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     )

//     return () => {
//       navigator.geolocation.clearWatch(watchId)
//       socket.disconnect()
//     }
//   }, [userId])

//   return null ;
// }

// export default DeliveryBoyTracker
