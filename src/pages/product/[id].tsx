import { useSession } from "next-auth/react";
import ProductPage from "../../../components/product/ProductPage";
import ProductPageAdmin from "../../../components/product/ProductPageAdmin";

const SingleProduct = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <ProductPageAdmin />;
    } else {
      content = <ProductPage />;
    }
  } else if (status === "unauthenticated") {
    content = <ProductPage />;
  }

  return content;
};

export default SingleProduct;
