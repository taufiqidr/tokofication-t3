import { useSession } from "next-auth/react";
import React from "react";
import AdminNewProductComp from "../../../components/Admin/AdminNewProduct";
import Unauthorized from "../../../components/Unauthorized";

const NewProduct = () => {
  const { status } = useSession();
  let content;
  if (status === "authenticated") {
    content = <AdminNewProductComp />;
  } else if (status === "unauthenticated") {
    content = <Unauthorized />;
  }
  return content;
};

export default NewProduct;
