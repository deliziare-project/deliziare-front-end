import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowUpDown, Mail, Phone } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';
import {Replay} from '@/types/Replay'
import StatusBadge from './StatusBadge';
import ReplayCard from './ReplayCard';
import './ReplayModal.css';

interface ReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  replays: Replay[];
}

const ReplayModal: React.FC<ReplayModalProps> = ({ isOpen, onClose, replays }) => {
  const [sortedReplays, setSortedReplays] = useState<Replay[]>([]);
  const [sortBy, setSortBy] = useState<'bidAmount' | 'createdAt'>('bidAmount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const modalRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  useEffect(() => {
    if (replays.length === 0) return;
    
    const sorted = [...replays].sort((a, b) => {
      if (sortBy === 'bidAmount') {
        return sortDirection === 'asc' 
          ? a.bidAmount - b.bidAmount 
          : b.bidAmount - a.bidAmount;
      } else {
    
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Date.now();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Date.now();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    setSortedReplays(sorted);
  }, [replays, sortBy, sortDirection]);
  

  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  

  const handleSort = (field: 'bidAmount' | 'createdAt') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop"
      onClick={handleModalClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col modal-content"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Chef Responses</h2>
          <button 
            onClick={onClose}
            className="p-1 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center p-4 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button 
              className={`flex cursor-pointer items-center space-x-1 ${sortBy === 'bidAmount' ? 'text-blue-600 font-medium' : ''}`}
              onClick={() => handleSort('bidAmount')}
            >
              <span>Bid Amount</span>
              <ArrowUpDown size={16} className={sortBy === 'bidAmount' ? 'opacity-100' : 'opacity-50'} />
            </button>
            
            <button 
              className={`flex cursor-pointer items-center space-x-1 ${sortBy === 'createdAt' ? 'text-blue-600 font-medium' : ''}`}
              onClick={() => handleSort('createdAt')}
            >
              <span>Date</span>
              <ArrowUpDown size={16} className={sortBy === 'createdAt' ? 'opacity-100' : 'opacity-50'} />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow p-4">
          {sortedReplays.length > 0 ? (
            <div className="space-y-4">
              {sortedReplays.map(replay => (
                <ReplayCard key={replay._id} replay={replay} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>No chef responses yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplayModal;