import { useSession } from "next-auth/react";
import AdminCategoryComp from "../../../components/Admin/AdminCategory";
import UserCategoryComp from "../../../components/User/UserCategory";

const CategoryHome = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminCategoryComp />;
    } else {
      content = <UserCategoryComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserCategoryComp />;
  }
  return content;
};

export default CategoryHome;
