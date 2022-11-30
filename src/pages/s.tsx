import { useSession } from "next-auth/react";
import React from "react";
import Back from "../../components/Back";
import Loading from "../../components/Loading";

const SettingPage = () => {
  const { data: session, status } = useSession();
  let content;
  if (status === "authenticated") {
    content = <Unauthenticated />;
  } else if (status === "unauthenticated") {
    content = <Setting />;
  }

  return content;
  // return <Loading />;
};

export default SettingPage;

const Unauthenticated = () => {
  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <div className="flex h-full items-center justify-center text-5xl">
        Setting Page
      </div>
    </div>
  );
};

const Setting = () => {
  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <div className="flex h-full items-center justify-center text-5xl">
        You need to login to access this page
      </div>
    </div>
  );
};
