import Link from "next/link";
import React from "react";
import { FaEdit } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  seller: string;
  category: string;
}
const Product = ({ id, name, price, stock, seller, category }: Product) => {
  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{name}</td>
      <td className="py-4 px-6 text-white">{seller}</td>
      <td className="py-4 px-6 text-white">{category}</td>
      <td className="py-4 px-6 text-white">{price}</td>
      <td className="py-4 px-6 text-white">{stock}</td>
      <td className="border-l border-gray-400 py-4 px-6">
        <span className="text-xl text-white hover:text-blue-400">
          <Link href={`p/${id}`}>
            <FaEdit />
          </Link>
        </span>
      </td>
    </tr>
  );
};

export default Product;
