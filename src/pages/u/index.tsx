import { useSession } from "next-auth/react";
import React from "react";
import AdminUserComp from "../../../components/Admin/AdminUser";
import UserUserComp from "../../../components/User/UserUser";

const UserHome = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    if (session.user?.role === "ADMIN") {
      content = <AdminUserComp />;
    } else {
      content = <UserUserComp />;
    }
  } else if (status === "unauthenticated") {
    content = <UserUserComp />;
  }
  return content;
};

export default UserHome;
