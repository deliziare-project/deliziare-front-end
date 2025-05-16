import { X } from 'lucide-react';

interface CertificateModalProps {
  imageUrl: string;
  onClose: () => void;
}

const CertificateModal = ({ imageUrl, onClose }: CertificateModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Certificate Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Chef Certificate"
              className="w-full h-auto object-contain"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;