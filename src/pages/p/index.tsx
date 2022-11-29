import { useSession } from "next-auth/react";
import React from "react";
import AdminProductComp from "../../../components/Admin/AdminProduct";
import UserProductComp from "../../../components/User/UserProduct";

const ProductHome = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminProductComp />;
    } else {
      content = <UserProductComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserProductComp />;
  }

  return content;
};

export default ProductHome;
