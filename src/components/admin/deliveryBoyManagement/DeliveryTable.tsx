import React, { useState } from "react";
import { Ellipsis } from "lucide-react";
import Certificate from "./certificate";

interface Props {
  user: any;
  openDropdownId: string | null;
  toggleDropdown: (id: string) => void;
  handleBlockToggle: (id: string) => void;
}

const DeliveryTable = ({
  user,
  openDropdownId,
  toggleDropdown,
  handleBlockToggle,
}: Props) => {
  const hasImage = Boolean(user.profileImage);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateType, setCertificateType] = useState<"license" | "idproof" | null>(null);

  return (
    <>
      <tr className="hover:bg-[#fdf4f0] transition-colors border-b border-slate-100">
        <td className="px-6 py-4">
          {hasImage ? (
            <img
              src={user.userId?.profileImage}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-50 text-amber-600 flex items-center justify-center text-lg font-medium border-2 border-white shadow-sm">
              {user.userId?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </td>
        <td className="px-6 py-4 text-red-800 font-medium">
          {user.userId?.name}
        </td>
        <td className="px-6 py-4 text-slate-600">{user.userId?.email}</td>
        <td className="px-6 py-4">
          {user.license ? (
            <button
              onClick={() => {
                setCertificateType("license");
                setShowCertificate(true);
              }}
              className="text-orange-700 hover:text-orange-900 underline"
            >
              View
            </button>
          ) : (
            <span className="text-slate-400 text-sm">Not provided</span>
          )}
        </td>
        <td className="px-6 py-4">
          {user.IDProof ? (
            <button
              onClick={() => {
                setCertificateType("idproof");
                setShowCertificate(true);
              }}
              className="text-orange-700 cursor-pointer hover:text-orange-900 underline"
            >
              View
            </button>
          ) : (
            <span className="text-slate-400 text-sm">Not provided</span>
          )}
        </td>
        <td className="px-6 py-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              !user.userId?.isBlock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {!user.userId?.isBlock ? "Active" : "Inactive"}
          </span>
        </td>
      <td className="px-6 py-4 text-right relative">
  <button
    onClick={() => toggleDropdown(user._id)}
    className="p-1 rounded-full cursor-pointer hover:bg-slate-100 text-slate-500 hover:text-slate-700"
  >
    <Ellipsis className="w-5 h-5" />
  </button>

  {openDropdownId === user._id && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200">
      <ul className="py-1">
        <li
          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          onClick={() => handleBlockToggle(user.userId._id)}
        >
          {!user.userId?.isBlock ? "Block User" : "Unblock User"}
        </li>
      </ul>
    </div>
  )}
</td>

      </tr>

      {/* Dropdown as new row */}
      {/* {openDropdownId === user._id && (
        <tr>
          <td colSpan={7}>
            <div className="relative">
              <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200">
                <ul className="py-1">
                  <li
                    className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleBlockToggle(user.userId._id)}
                  >
                    {!user.userId?.isBlock ? "Block User" : "Unblock User"}
                  </li>
                  <li
                    className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                    onClick={() => alert(`Viewing profile of ${user.userId?.name}`)}
                  >
                    View Profile
                  </li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )} */}

     
      {showCertificate && (
        <Certificate
          imageUrl={certificateType === "license" ? user.license : user.IDProof}
          onClose={() => {
            setShowCertificate(false);
            setCertificateType(null);
          }}
        />
      )}
    </>
  );
};

export default DeliveryTable;
