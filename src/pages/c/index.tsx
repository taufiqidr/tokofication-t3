import { useSession } from "next-auth/react";
import AdminCategory from "../../../components/Admin/AdminCategory";
import CategoryComp from "../../../components/Category";

const Category = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminCategory />;
    } else {
      content = <CategoryComp />;
    }
  } else if (status === "unauthenticated") {
    content = <CategoryComp />;
  }
  return content;
};

export default Category;
