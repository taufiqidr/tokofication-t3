import Link from "next/link";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { money } from "../../src/utils/money";

interface User {
  userId: string;
  email: string | null;
  name: string | null;
  balance: number | null;
  role: string;
  count: number;
}

const User = ({ userId, email, name, balance, role, count }: User) => {
  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{email}</td>
      <td className="py-4 px-6 text-white">{name}</td>
      <td className="py-4 px-6 text-white">{count}</td>
      <td className="py-4 px-6 text-white">
        {balance ? money.format(balance) : money.format(0)}
      </td>
      <td className="py-4 px-6 text-white">{role}</td>
      <td className="border-l border-gray-400 py-4 px-6">
        <span className="text-xl text-white hover:text-blue-400">
          <Link href={`u/${userId}`}>
            <FaEdit />
          </Link>
        </span>
      </td>
    </tr>
  );
};

export default User;
