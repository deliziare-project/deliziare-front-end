import React from "react";
import { Ellipsis } from "lucide-react";

interface Props {
  user: {
    _id: string;
    name: string;
    email: string;
    isBlock: boolean;
    profileImage?: string;
  };
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  handleBlockToggle: (id: string) => void;
}

const UserMobileCard: React.FC<Props> = ({
  user,
  openDropdownId,
  toggleDropdown,
  handleBlockToggle,
}) => {
  const hasImage = Boolean(user.profileImage);

  return (
    <div className="bg-white rounded-xl shadow border border-slate-100 p-5 space-y-4">
  <div className="flex justify-between items-start">
    <div className="flex items-center gap-4">
      {hasImage ? (
        <img
          src={user.profileImage}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-orange-50 text-amber-600 flex items-center justify-center text-lg font-semibold">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
      )}

      <div>
        <h4 className="text-red-800 font-semibold text-base">{user.name}</h4>
        <p className="text-sm text-slate-500">{user.email}</p>
      </div>
    </div>

    <div className="relative">
      <button onClick={() => toggleDropdown(user._id)}>
        <Ellipsis className="text-slate-500" />
      </button>

      {openDropdownId === user._id && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-30">
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
  </div>

  <div>
    <p className="text-sm text-slate-600">
      Status:{" "}
      <span
        className={`font-medium ${
          !user.isBlock ? "text-green-600" : "text-red-600"
        }`}
      >
        {!user.isBlock ? "Active" : "Inactive"}
      </span>
    </p>
  </div>
</div>

  );
};

export default UserMobileCard;
