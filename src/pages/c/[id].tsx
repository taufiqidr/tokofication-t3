import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import AdminCategoryPageComp from "../../../components/Admin/AdminCategoryPage";
import UserCategoryPageComp from "../../../components/User/UserCategoryPage";

const CategoryPage = () => {
  const { data: session, status } = useSession();
  const id = useRouter().query.id;
  const [categoryId, setCategoryId] = useState("");
  useEffect(() => {
    if (id) setCategoryId(String(id));
  }, [id]);
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminCategoryPageComp id={categoryId} />;
    } else {
      content = <UserCategoryPageComp categoryId={categoryId} />;
    }
  } else if (status === "unauthenticated") {
    content = <UserCategoryPageComp categoryId={categoryId} />;
  }
  return content;
};

export default CategoryPage;
