import Link from "next/link";
import React from "react";
import { FaEdit } from "react-icons/fa";

interface Category {
  id: string;
  name: string;
  count: number;
}
const Category = ({ id, name, count }: Category) => {
  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{name}</td>
      <td className="py-4 px-6 text-white">{count}</td>
      <td className="border-l border-gray-400 py-4 px-6">
        <span className="text-xl text-white hover:text-blue-400">
          <Link href={`c/${id}`}>
            <FaEdit />
          </Link>
        </span>
      </td>
    </tr>
  );
};

export default Category;
