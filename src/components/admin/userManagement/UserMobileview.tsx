import React from "react";

interface Props {
  user: {
    _id: string;
    name: string;
    email: string;
    isBlock: boolean;
  };
}

const UserMobileCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 cursor-pointer">
      <p className="text-lg font-semibold">
        Name: <span className="font-normal">{user.name}</span>
      </p>
      <p className="text-lg font-semibold">
        Email: <span className="font-normal">{user.email}</span>
      </p>
      <p className="text-lg font-semibold">
        Status:{" "}
        <span
          className={`font-bold ${
            !user.isBlock ? "text-green-600" : "text-red-600"
          }`}
        >
          {!user.isBlock ? "Active" : "Inactive"}
        </span>
      </p>
    </div>
  );
};

export default UserMobileCard;
