import Image from "next/image";
import Link from "next/link";
import React from "react";
import { money } from "../src/utils/money";
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  seller: string;
  image: string | null;
}
const ProductItem = ({ id, name, price, stock, seller, image }: Product) => {
  const img = () =>
    String(
      `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/product/${image}`
    );
  return (
    <Link href={`/p/${id}`}>
      <div className="m-2 flex h-60 w-40 flex-col rounded-lg">
        <div className="h-2/4 rounded-t-lg border">
          {image && (
            <Image
              src={img()}
              alt={id}
              loader={img}
              width={240}
              height={240}
              className="h-full w-full rounded-t-lg object-cover object-top"
            ></Image>
          )}
        </div>
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
