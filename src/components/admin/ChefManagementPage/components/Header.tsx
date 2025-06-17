import { ChefHat } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <ChefHat size={28} className="text-red-600 mr-3" />
          <h1 className="text-2xl font-bold text-red-900">Chef Management</h1>
        </div>
        <p className="text-gray-600 text-sm">Manage all registered chefs on the platform.</p>
      </div>
    </header>
  );
};

export default Header;