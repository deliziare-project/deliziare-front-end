import { Eye } from 'lucide-react';
import { Chef } from './chef';

interface ChefsTableProps {
  chefs: Chef[];
  onSelectChef: (chef: Chef) => void;
  onViewCertificate: (url: string) => void;
}

const ChefsTable = ({ chefs, onSelectChef, onViewCertificate }: ChefsTableProps) => {
console.log(chefs);

 
  return (
    <div className="overflow-hidden bg-white shadow-sm rounded-lg border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
            <tr>
               <th className="px-6 py-4">Profile</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Experience</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Certificate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {chefs.length > 0 ? (
              chefs.map((chef) => (
                <tr 
                  key={chef.id} 
                  className="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-gray-600">

                    {chef.profileImage ? (
                      <img
                        src={chef?.profileImage}
                        alt="avatar.png"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#fcd8bd] text-[#8b3e0f] flex items-center justify-center text-xl font-semibold">
                        {chef.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                              </td>
                  <td 
                    className="px-6 py-4 font-medium text-gray-900 cursor-pointer"
                    onClick={() => onSelectChef(chef)}
                  >
                    {chef.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{chef.email}</td>
                  <td className="px-6 py-4 text-gray-600">{chef.district}</td>
                  <td className="px-6 py-4 text-gray-600">{chef.experience} years</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        chef.isBlocked
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {chef.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewCertificate(chef.certificate)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-150"
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No chefs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChefsTable;