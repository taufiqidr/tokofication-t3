import { useSession } from "next-auth/react";
import React from "react";
import AdminCategoryPageComp from "../../../components/Admin/AdminCategoryPage";
import UserCategoryPageComp from "../../../components/User/UserCategoryPage";

const CategoryPage = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminCategoryPageComp />;
    } else {
      content = <UserCategoryPageComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserCategoryPageComp />;
  }
  return content;
};

export default CategoryPage;
