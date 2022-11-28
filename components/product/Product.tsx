import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  let action;

  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      action = (
        <span className="text-xl text-white hover:text-blue-400">
          <Link href={`product/${id}/edit`}>
            <FaEdit />
          </Link>
        </span>
      );
    } else {
      action = (
        <span className="text-xl text-white hover:text-blue-400">
          <Link href={`product/${id}`}>
            <FaEdit />
          </Link>
        </span>
      );
    }
  } else if (status === "unauthenticated") {
    action = <></>;
  }

  return (
    <tr className="border-b bg-white hover:bg-gray-600 dark:border-gray-700 dark:bg-gray-800">
      <td className="py-4 px-6 text-white">{name}</td>
      <td className="py-4 px-6 text-white">{seller}</td>
      <td className="py-4 px-6 text-white">{category}</td>
      <td className="py-4 px-6 text-white">{price}</td>
      <td className="py-4 px-6 text-white">{stock}</td>
      <td className="border-l border-gray-400 py-4 px-6">{action}</td>
    </tr>
  );
};

export default Product;
