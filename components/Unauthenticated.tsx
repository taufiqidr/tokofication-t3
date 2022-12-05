import { signIn } from "next-auth/react";
import React from "react";
import Back from "./Back";

const Unauthenticated = () => {
  return (
    <div className="mx-3 flex h-full w-auto flex-col ">
      <Back />
      <div className="flex h-full flex-col items-center justify-center text-5xl">
        <p>You need to login to access this page</p>
        <div
          onClick={() => signIn("discord")}
          className="mt-3 cursor-pointer rounded-lg bg-blue-600 px-3 py-1 text-base hover:bg-blue-500"
        >
          Login with Discord
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;
