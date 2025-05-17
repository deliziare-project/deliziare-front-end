import { X, Mail, Clock, MapPin, Award } from 'lucide-react';
import { Chef } from './chef';

interface ChefDetailModalProps {
  chef: Chef;
  onClose: () => void;
  onToggleBlock: (id: number) => void;
}

const ChefDetailModal = ({ chef, onClose, onToggleBlock }: ChefDetailModalProps) => {
  console.log(chef.specialisations)
  const sp=JSON.parse(chef.specialisations)
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-[#e04a2b] to-[#f78f60] p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all duration-200"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold">{chef.name}</h2>
            <div className="flex items-center mt-1 text-white/90">
              <Mail size={16} className="mr-2" />
              <span>{chef.email}</span>
            </div>
          </div>

          <div className="px-6 -mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                chef.isBlocked
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {chef.isBlocked ? 'Blocked' : 'Active'}
            </span>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900 font-medium">{chef.experience}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">
                      Lat: {chef.location.lat}, Lng: {chef.location.lng}
                    </p>
                    <p className="text-gray-700 text-sm">{chef.district}, {chef.state}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start">
                  <Award size={18} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Specialisations</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sp.map((spec:string, index:number) => (
                        <span 
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => onToggleBlock(chef.userId)}
                className={`${
                  chef.isBlocked
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium`}
              >
                {chef.isBlocked ? 'Unblock Chef' : 'Block Chef'}
              </button>
              {/* <button
                onClick={onClose}
                className="ml-auto text-gray-600 hover:text-gray-800 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefDetailModal;