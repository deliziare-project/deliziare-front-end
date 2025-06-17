import { Ellipsis } from "lucide-react";

interface Props {
  user: any;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  handleBlockToggle: (id: string) => void;
}

const UserTableRow = ({
  user,
  openDropdownId,
  toggleDropdown,
  handleBlockToggle,
}: Props) => {
  const hasImage = Boolean(user.profileImage);

  return (
    <tr className="hover:bg-[#fdf4f0] transition duration-150 border-b border-slate-100">
  <td className="p-4">
    {hasImage ? (
      <img
        src={user.profileImage}
        alt="User Avatar"
        className="w-12 h-12 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-orange-50 text-amber-600 flex items-center justify-center text-lg font-medium shadow-sm">
        {user.name?.[0]?.toUpperCase() || "U"}
      </div>
    )}
  </td>
  <td className="p-4 text-red-800 font-medium">{user.name}</td>
  <td className="p-4 text-slate-600">{user.email}</td>
  <td className="p-4">
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${
        !user.isBlock
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {!user.isBlock ? "Active" : "Inactive"}
    </span>
  </td>
  <td className="p-4">
    <div className="relative">
      <button
        onClick={() => toggleDropdown(user._id)}
        className="p-1 rounded-full hover:bg-slate-100"
      >
        <Ellipsis className="text-slate-600 w-5 h-5" />
      </button>

      {openDropdownId === user._id && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded shadow-md z-20">
          <ul className="text-sm text-slate-700">
            <li
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
              onClick={() => handleBlockToggle(user._id)}
            >
              {!user.isBlock ? "Block" : "Unblock"}
            </li>
            <li
              className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
              onClick={() => alert(`Viewing profile of ${user.name}`)}
            >
              View Post
            </li>
          </ul>
        </div>
      )}
    </div>
  </td>
</tr>

  );
};

export default UserTableRow;
