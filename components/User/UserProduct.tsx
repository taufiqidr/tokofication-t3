import Link from "next/link";
import React from "react";
import ProductItem from "../ProductItem";
import { type Category, type User } from "@prisma/client";

interface Props {
  products:
    | {
        user: User;
        id: string;
        name: string;
        category: Category;
        price: number;
        stock: number;
      }[]
    | undefined;
}
const UserHomeComp = ({ products }: Props) => {
  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <p className="mt-2 text-xl">
        You can buy these product or discover{" "}
        <Link href="category" className="text-blue-500">
          category
        </Link>
      </p>
      <div className="flex h-auto flex-row flex-wrap ">
        {products?.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            seller={String(product.user.name)}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default UserHomeComp;
