import React from "react";
import Back from "./Back";

const Unauthorized = () => {
  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <Back />
      <div className="flex h-full items-center justify-center text-5xl">
        Go back, You are not unauthorized to do this
      </div>
    </div>
  );
};

export default Unauthorized;
