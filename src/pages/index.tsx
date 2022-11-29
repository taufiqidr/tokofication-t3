import { useSession } from "next-auth/react";
import AdminHome from "../../components/Admin/AdminHome";
import UserHomeComp from "../../components/User/UserHome";

const HomePage = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminHome />;
    } else {
      content = <UserHomeComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserHomeComp />;
  }

  return content;
};

export default HomePage;
