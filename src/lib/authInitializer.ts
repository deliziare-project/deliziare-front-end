'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkCurrentUser } from '@/features/authSlice';
import axiosInstance from '@/api/axiosInstance';
import { AppDispatch } from '@/redux/store';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
   
const checkcookie=async()=>{
  const res=await axiosInstance.get('/users/check-cookie',{ withCredentials: true })
       if(res.data.message) {
            try {
        
            dispatch(checkCurrentUser());
            } catch (err) {
            console.log("User not authenticated or session expired.");
   
             }
       }
}
checkcookie()

  }, [dispatch]);

  return null;
}


// 'use client';

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { checkCurrentUser } from '@/features/authSlice';
// import { AppDispatch } from '@/redux/store';

// export default function AuthInitializer() {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(checkCurrentUser());
//   }, [dispatch]);

//   return null;
// }
