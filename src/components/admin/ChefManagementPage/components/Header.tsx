import { ChefHat } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <ChefHat size={28} className="text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Chef Management</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;