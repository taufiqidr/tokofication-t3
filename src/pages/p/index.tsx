import { useSession } from "next-auth/react";
import React from "react";
import AdminProductComp from "../../../components/Admin/AdminProduct";
import Loading from "../../../components/Loading";
import UserProductComp from "../../../components/User/UserProduct";
import { trpc } from "../../utils/trpc";

const ProductHome = () => {
  const { data: session, status } = useSession();
  const { data: products, isLoading } = trpc.product.getAll.useQuery();

  if (isLoading) return <Loading />;
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminProductComp products={products} />;
    } else {
      content = <UserProductComp products={products} />;
    }
  } else if (status === "unauthenticated") {
    content = <UserProductComp products={products} />;
  }

  return content;
};

export default ProductHome;
