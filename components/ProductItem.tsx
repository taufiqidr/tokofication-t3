import Link from "next/link";
import React from "react";
import { money } from "../src/utils/money";
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  seller: string;
}
const ProductItem = ({ id, name, price, stock, seller }: Product) => {
  return (
    <Link href={`/p/${id}`}>
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

export default ProductItem;
