import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { trpc } from "../../src/utils/trpc";
import Back from "../Back";
import Loading from "../Loading";
import ProductItem from "../ProductItem";

const UserCategoryPageComp = () => {
  const id = useRouter().query.id;
  const [categoryId, setCategoryId] = useState("");

  const { data: products, isLoading } = trpc.product.getByCategory.useQuery({
    categoryId: categoryId as string,
  });

  useEffect(() => {
    if (id) setCategoryId(String(id));
  }, [id]);
  if (isLoading) return <Loading />;

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <p className="mt-2 text-xl">
        Showing all the products from this category
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

export default UserCategoryPageComp;
