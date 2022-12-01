import { useSession } from "next-auth/react";
import UserProductPageComp from "../../../components/User/UserProductPage";
import AdminProductPageComp from "../../../components/Admin/AdminProductPage";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Loading from "../../../components/Loading";

const ProductPage = () => {
  const [productId, setProductId] = useState("");
  const { data: session } = useSession();
  let content;
  const id = useRouter().query.id;
  useEffect(() => {
    if (id) setProductId(String(id));
  }, [id]);
  const { data: product, isLoading } = trpc.product.getOne.useQuery({
    id: productId,
  });

  if (!session) {
    content = <UserProductPageComp product={product} />;
  } else {
    if (session?.user?.role === "ADMIN") {
      content = <AdminProductPageComp data={product} />;
    } else if (session?.user?.role === "USER") {
      if (session?.user?.id !== product?.user?.id) {
        content = <UserProductPageComp product={product} session={session} />;
      } else {
        content = <AdminProductPageComp data={product} />;
      }
    }
  }
  if (isLoading) return <Loading />;
  return content;
};

export default ProductPage;
