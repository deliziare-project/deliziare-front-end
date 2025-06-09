interface StatsCardsProps {
  totalChefs: number;
  activeChefs: number;
  blockedChefs: number;
}

const StatsCards = ({ totalChefs, activeChefs, blockedChefs }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Total Chefs</p>
        <p className="text-2xl font-semibold">{totalChefs}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Active Chefs</p>
        <p className="text-2xl font-semibold text-green-600">{activeChefs}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Blocked Chefs</p>
        <p className="text-2xl font-semibold text-red-600">{blockedChefs}</p>
      </div>
    </div>
  );
};

export default StatsCards;