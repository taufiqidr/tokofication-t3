import { useSession } from "next-auth/react";
import React from "react";
import AdminNewCategoryComp from "../../../components/Admin/AdminNewCategory";
import Unauthorized from "../../../components/Unauthorized";

const NewCategory = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminNewCategoryComp />;
    } else {
      content = <Unauthorized />;
    }
  } else if (status === "unauthenticated") {
    content = <Unauthorized />;
  }
  return content;
};

export default NewCategory;
