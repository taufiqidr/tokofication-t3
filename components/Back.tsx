import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
const Back = () => {
  const router = useRouter();
  return (
    <div
      className="mb-3 flex w-20 cursor-pointer flex-row items-center gap-x-2  text-xl hover:text-blue-500"
      onClick={() => router.back()}
    >
      <BsArrowLeft /> Back
    </div>
  );
};

export default Back;
