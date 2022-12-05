import { useSession } from "next-auth/react";
import React from "react";
import AdminRequestPageComp from "../../components/Admin/AdminRequestPage";
import Unauthenticated from "../../components/Unauthenticated";
import UserRequestPageComp from "../../components/User/UserRequestPage";

const RequestPage = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminRequestPageComp />;
    } else {
      content = <UserRequestPageComp />;
    }
  } else if (status === "unauthenticated") {
    content = <Unauthenticated />;
  }

  return content;
};

export default RequestPage;
