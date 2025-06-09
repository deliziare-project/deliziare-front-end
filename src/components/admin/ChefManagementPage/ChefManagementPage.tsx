'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Chef, FilterStatus } from './components/chef';
import Header from './components/Header';
import Filters from './components/Filters';
import StatsCards from './components/StatsCards';
import ChefsTable from './components/ChefsTable';
import ChefDetailModal from './components/ChefDetailModal';
import CertificateModal from './components/CertificateModal';
import EmptyState from './components/EmptyState';
import axiosInstance from '@/api/axiosInstance';
import Pagination from '../userManagement/Pagination';

const ChefManagementPage = ({ initialChefs }: { initialChefs: Chef[] }) => {
  const [chefs, setChefs] = useState<Chef[]>(initialChefs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBlocked, setFilterBlocked] = useState<FilterStatus>('all');
  const [selectedChef, setSelectedChef] = useState<Chef | null>(null);
  const [certificateImage, setCertificateImage] = useState<string | null>(null);

  const districts = useMemo(() => {
    return [...new Set(chefs.map((chef) => chef.district))];
  }, [chefs]);

  const filteredChefs = useMemo(() => {
    return chefs.filter((chef) => {
      const matchName = chef.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDistrict = filterDistrict ? chef.district === filterDistrict : true;
      const matchBlocked =
        filterBlocked === 'all'
          ? true
          : filterBlocked === 'blocked'
          ? chef.isBlocked
          : !chef.isBlocked;
      return matchName && matchDistrict && matchBlocked;
    });
  }, [chefs, searchTerm, filterDistrict, filterBlocked]);

  const toggleBlockStatus = async(id: number) => {
   
        try {
         
          const response = await axiosInstance.patch(`/admin/chefs/${id}/toggle-block`,{withCredentials:true});
        const updatedStatus = response.data.isBlocked;
       console.log(chefs);
       
        setChefs((prev) =>
        prev.map((chef) =>
        chef.userId === id ? { ...chef, isBlocked: updatedStatus } : chef
        )
        );
        
       if (selectedChef && selectedChef.userId === id) {
        setSelectedChef({ ...selectedChef, isBlocked: updatedStatus });
        }
        } catch (error) {
            console.error('Failed to toggle block status:', error);
    alert('Failed to update block status. Please try again.');
        }

  };


  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; 


const paginatedChefs = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filteredChefs.slice(start, start + itemsPerPage);
}, [filteredChefs, currentPage]);

useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, filterDistrict, filterBlocked]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDistrict={filterDistrict}
          setFilterDistrict={setFilterDistrict}
          filterBlocked={filterBlocked}
          setFilterBlocked={setFilterBlocked}
          districts={districts}
        />
        
        <StatsCards 
          totalChefs={chefs.length}
          activeChefs={chefs.filter(c => !c.isBlocked).length}
          blockedChefs={chefs.filter(c => c.isBlocked).length}
        />
        
        {chefs.length === 0 ? (
          <EmptyState />
        ) : (
          <ChefsTable 
            chefs={paginatedChefs}
            onSelectChef={setSelectedChef}
            onViewCertificate={setCertificateImage}
          />
        )}
      </main>

      {selectedChef && (
        <ChefDetailModal 
          chef={selectedChef}
          onClose={() => setSelectedChef(null)}
          onToggleBlock={toggleBlockStatus}
        />
      )}

      {certificateImage && (
        <CertificateModal 
          imageUrl={certificateImage}
          onClose={() => setCertificateImage(null)}
        />
      )}

      
   <div className='p-3'>
       {filteredChefs.length > itemsPerPage && (
  <Pagination
    currentPage={currentPage}
    totalPages={Math.ceil(filteredChefs.length / itemsPerPage)}
    onPageChange={setCurrentPage}
  />
)}

   </div>
    </div>
  );
};

export default ChefManagementPage;