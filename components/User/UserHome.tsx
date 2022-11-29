import Link from "next/link";
import React from "react";
import { trpc } from "../../src/utils/trpc";
import Loading from "../Loading";
import ProductItem from "../ProductItem";

const UserHomeComp = () => {
  const { data: products, isLoading } = trpc.product.getAll.useQuery();
  if (isLoading) return <Loading />;

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <h1 className="text-5xl">Welcome to Tokofication</h1>
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
            seller={String(product.user.email)}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default UserHomeComp;
