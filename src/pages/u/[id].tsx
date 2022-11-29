import { useSession } from "next-auth/react";
import React from "react";
import AdminUserPageComp from "../../../components/Admin/AdminUserPage";
import UserUserPageComp from "../../../components/User/UserUserPage";

const UserPage = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminUserPageComp />;
    } else {
      content = <UserUserPageComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserUserPageComp />;
  }
  return content;
};

export default UserPage;
