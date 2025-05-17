'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerChef, resetRegisterState,sendOtpForChef,setRegistrationData } from '../../features/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import dynamic from 'next/dynamic';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';


const ChefLocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
});

const ChefRegister = () => {
    const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [specialize, setSpecialize] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
     
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chefData = {
      name,
      email,
      phone,
      password,
      experience,
      specializations,
      location,
      role: 'chef',
      
    };
    dispatch(setRegistrationData(chefData));
    
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('specialize', JSON.stringify(specializations));
    formData.append('locationLat', location.lat.toString());
    formData.append('locationLng', location.lng.toString());
    formData.append('role', 'chef');
    if (certificate) formData.append('certificate', certificate);
    dispatch(sendOtpForChef(formData));
  };

//   useEffect(() => {
//     if (success) {
//     //   alert('Chef registered successfully!');
//     //   setName('');
//     //   setEmail('');
//     //   setPhone('');
//     //   setPassword('');
//     //   setExperience('');
//     //   setSpecialize('');
//     //   setSpecializations([]);
//     //   setCertificate(null);
     
  
     
//       router.push(`/verifyotp?email=${email}&role=chef`);
//       dispatch(resetRegisterState());
       
//     }
//   }, [success, dispatch, router]);


useEffect(() => {
    if (success) {
      router.push(`/verifyotp?email=${encodeURIComponent(email)}&role=chef`);
  
      
      setTimeout(() => {
        dispatch(resetRegisterState());
      }, 60000);
    }
  }, [success, dispatch, router, email]);
  
  

  const inputStyles =
    'w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition';

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-teal-700">Chef Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {[
          { label: 'Name', value: name, set: setName, type: 'text' },
          { label: 'Email', value: email, set: setEmail, type: 'email' },
          { label: 'Phone Number', value: phone, set: setPhone, type: 'tel' },
          { label: 'Password', value: password, set: setPassword, type: 'password' },
          { label: 'Experience', value: experience, set: setExperience, type: 'number' },
        ].map(({ label, value, set, type }) => (
          <div key={label}>
            <label className="block text-gray-700 font-medium mb-1">{label}</label>
            <input
              type={type}
              value={value}
              onChange={(e) => set(e.target.value)}
              required
              className={inputStyles}
            />
          </div>
        ))}

        {/* Specialize In with plus button */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Specialize In</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={specialize}
              onChange={(e) => setSpecialize(e.target.value)}
              placeholder="e.g., Biryani, Desserts"
              className={`${inputStyles} flex-1`}
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = specialize.trim();
                if (trimmed && !specializations.includes(trimmed)) {
                  setSpecializations([...specializations, trimmed]);
                  setSpecialize('');
                }
              }}
              className="flex items-center justify-center p-2 rounded-lg bg-teal-600 hover:bg-teal-700 transition"
              aria-label="Add specialization"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {specializations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {specializations.map((item, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() =>
                      setSpecializations(specializations.filter((_, i) => i !== idx))
                    }
                    className="hover:text-red-600 focus:outline-none"
                    aria-label={`Remove specialization ${item}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Pick Location</label>
          <ChefLocationPicker onLocationChange={(lat, lng) => setLocation({ lat, lng })} />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Certificate</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setCertificate(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-teal-600 hover:file:bg-teal-700 transition"
          />
          {certificate && (
            <p className="text-sm text-gray-600 mt-1">
              Selected file: <strong>{certificate.name}</strong>
            </p>
          )}
        </div>

        {loading && <p className="text-blue-500 text-sm">Registering...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Chef registered successfully!</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default ChefRegister;