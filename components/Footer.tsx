import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-gray-800 py-3 text-center">
      <p>2022 &copy; taufiqidr</p>
      <Link href={"/about"} className="text-blue-500">
        About this project
      </Link>
    </footer>
  );
};
export default Footer;
