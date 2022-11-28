import { useSession } from "next-auth/react";
import React from "react";
import AdminHome from "../../../components/Admin/AdminHome";
import Home from "../../../components/Home";

const ProductHome = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminHome />;
    } else {
      content = <Home />;
    }
  } else if (status === "unauthenticated") {
    content = <Home />;
  }

  return content;
};

export default ProductHome;
