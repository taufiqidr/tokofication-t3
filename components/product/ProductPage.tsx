import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { trpc } from "../../src/utils/trpc";
import Loading from "../Loading";

const ProductPage = () => {
  const [productId, setProductId] = useState("");
  const id = useRouter().query.productId;

  const { data, isLoading } = trpc.product.getOne.useQuery({
    id: productId as string,
  });

  useEffect(() => {
    if (id) setProductId(String(id));
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <div>
      <p>{data?.name}</p>
      <p>{data?.price}</p>
      <p>{data?.stock}</p>
      <p>{data?.user.name}</p>
      <p>{data?.category.name}</p>
    </div>
  );
};

export default ProductPage;
