import Link from "next/link";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { trpc } from "../../src/utils/trpc";

interface Category {
  id: string;
  name: string;
}
const Category = ({ id, name }: Category) => {
  const { data: count, isLoading } = trpc.product.countProduct.useQuery({
    categoryId: id,
  });

  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{name}</td>
      <td className="py-4 px-6 text-white">
        {!isLoading ? count?.toString() : "loading..."}
      </td>
      <td className="border-l border-gray-400 py-4 px-6">
        <span className="text-xl text-white hover:text-blue-400">
          <Link href={`category/${id}/edit`}>
            <FaEdit />
          </Link>
        </span>
      </td>
    </tr>
  );
};

export default Category;
