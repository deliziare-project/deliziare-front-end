import { ChefHat } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No chefs found</h3>
      <p className="mt-1 text-gray-500">
        Add chefs to your database to see them listed here.
      </p>
    </div>
  );
};

export default EmptyState;