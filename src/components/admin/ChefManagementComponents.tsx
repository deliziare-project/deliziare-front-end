'use client';

import React  from 'react';
import ChefManagementPage from './ChefManagementPage/ChefManagementPage';


const initialChef= [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    experience: 5,
    location: { lat: 8.5241, lng: 76.9366 }, 
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    isBlocked: false,
    specialisations: ['Italian', 'Dessert'],
    certificate: 'https://fostac.fssai.gov.in/assets/certificate/fostac.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    experience: 3,
    location: { lat: 9.5011, lng: 76.5484 },
    state: 'Kerala',
    district: 'Alappuzha',
    isBlocked: true,
    specialisations: ['Chinese', 'Vegan'],
    certificate: 'https://fostac.fssai.gov.in/assets/certificate/fostac.jpg',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael@example.com',
    experience: 7,
    location: { lat: 10.8505, lng: 76.2711 }, 
    state: 'Kerala',
    district: 'Palakkad',
    isBlocked: false,
    specialisations: ['French', 'Mediterranean'],
    certificate: 'https://fostac.fssai.gov.in/assets/certificate/fostac.jpg',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    experience: 4,
    location: { lat: 11.8745, lng: 75.3704 }, 
    state: 'Kerala',
    district: 'Kannur',
    isBlocked: false,
    specialisations: ['Seafood', 'Caribbean'],
    certificate: 'https://fostac.fssai.gov.in/assets/certificate/fostac.jpg',
  },
];

const ChefManagementComponents = () => {

  return (
    <div className="min-h-screen bg-gray-50">
    <ChefManagementPage initialChefs={initialChef}  />
    </div>
  );
};

export default ChefManagementComponents;