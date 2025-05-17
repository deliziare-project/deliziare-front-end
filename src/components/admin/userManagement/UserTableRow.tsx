// components/admin/userManagement/UserTableRow.tsx
import { Ellipsis } from "lucide-react";

interface Props {
  user: any;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  handleBlockToggle: (id: string) => void;
}

const UserTableRow = ({ user, openDropdownId, toggleDropdown, handleBlockToggle }: Props) => (
  <tr className="hover:bg-[#fff6f0] transition duration-150">
    <td className="p-4">👤</td>
    <td className="p-4">{user.name}</td>
    <td className="p-4">{user.email}</td>
    <td className="p-4">
      {!user.isBlock ? (
        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-sm">Active</span>
      ) : (
        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-sm">Inactive</span>
      )}
    </td>
    <td className="p-4">
      <div className="relative">
        <button onClick={() => toggleDropdown(user._id)}>
          <Ellipsis className="text-[#8b3e0f]" />
        </button>

        {openDropdownId === user._id && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-[#e5c8b4] rounded shadow-lg z-20">
            <ul className="text-sm text-[#5a2e0e]">
              <li
                className="px-4 py-2 hover:bg-[#fef3e5] cursor-pointer"
                onClick={() => handleBlockToggle(user._id)}
              >
                {!user.isBlock ? "Block" : "Unblock"}
              </li>
              <li
                className="px-4 py-2 hover:bg-[#fef3e5] cursor-pointer"
                onClick={() => alert(`Viewing profile of ${user.name}`)}
              >
                View Profile
              </li>
            </ul>
          </div>
        )}
      </div>
    </td>
  </tr>
);

export default UserTableRow;
