import { useSession } from "next-auth/react";
import UserProductPageComp from "../../../components/User/UserProductPage";
import AdminProductPageComp from "../../../components/Admin/AdminProductPage";

const ProductPage = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminProductPageComp />;
    } else {
      content = <UserProductPageComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserProductPageComp />;
  }

  return content;
};

export default ProductPage;
