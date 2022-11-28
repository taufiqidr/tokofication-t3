import Link from "next/link";
import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";

interface Props {
  link: string;
  item: string;
}
const New = (props: Props) => {
  const [show, setShow] = useState(false);
  return (
    <div className="fixed right-0 bottom-10 m-3 ">
      <Link href={props.link} className="flex flex-row items-center gap-x-3 ">
        <div
          className={`${
            show ? "" : "hidden"
          } rounded-lg bg-blue-700 py-2 px-3 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
        >
          Add {props.item}
        </div>
        <button
          className="rounded-full bg-blue-700 px-3 py-3 text-3xl text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <BsPlus />
        </button>
      </Link>
    </div>
  );
};

export default New;
