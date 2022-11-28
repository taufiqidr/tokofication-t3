import Link from "next/link";
import React from "react";
import { money } from "../src/utils/money";
import { trpc } from "../src/utils/trpc";
import Loading from "./Loading";

const Home = () => {
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
          <Item
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            seller={String(product.user.email)}
            sellerId={product.user.id}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  seller: string;
  sellerId: string;
}
const Item = ({ id, name, price, stock, seller, sellerId }: Product) => {
  return (
    <Link href={`/${sellerId}/${id}`}>
      <div className="m-2 flex h-60 w-40 flex-col rounded-lg">
        <div className="h-2/4 rounded-t-lg border"></div>
        <div className="h-2/4 rounded-b-lg border p-2">
          <p>{name}</p>
          <p className="font-bold">{money.format(price)}</p>
          <p className="text-sm">by: {seller}</p>
          <p className="text-sm">stock: {stock}</p>
        </div>
      </div>
    </Link>
  );
};
