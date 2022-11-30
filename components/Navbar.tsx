import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
// import { trpc } from "../src/utils/trpc";

const Navbar = () => {
  const { data: session, status } = useSession();
  const pic = () => String(session?.user?.image);

  const [show, setShow] = useState(true);
  let menu;

  if (status === "authenticated") {
    menu = (
      <Image
        src={String(session.user?.image)}
        alt="profile pic"
        loader={pic}
        height={36}
        width={36}
        className="cursor-pointer rounded-full border border-slate-500 hover:brightness-90"
        onClick={() => setShow((prev) => !prev)}
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        unoptimized={true}
        loading="lazy"
      ></Image>
    );
  } else if (status === "unauthenticated") {
    menu = (
      <div
        onClick={() => signIn("discord")}
        className="w-full cursor-pointer rounded-lg bg-blue-600 px-3 py-1 hover:bg-blue-500"
      >
        Login with Discord
      </div>
    );
  }

  return (
    <header className="sticky top-0 w-full flex-none  bg-gray-800 py-3">
      <div className="flex h-full flex-row items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="mx-3 text-2xl italic">Tokofication</span>
          </Link>
        </div>
        <nav className="mx-3 flex h-full flex-row items-center justify-end ">
          <ul className="mx-3 flex flex-row items-center gap-x-3 text-xl">
            <li className="hover:text-blue-500">
              <Link href={"/c"}>
                <span className="cursor-pointer">Category</span>
              </Link>
            </li>
            <li className="hover:text-blue-500">
              <Link href={"/p"}>
                <span className="cursor-pointer">Product</span>
              </Link>
            </li>
            <li className="hover:text-blue-500">
              <Link href={"/u"}>
                <span className="cursor-pointer">User</span>
              </Link>
            </li>
          </ul>
          {menu}
        </nav>
      </div>
      <div
        className="absolute right-0 z-10 mx-3  mt-5 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        hidden={show}
        onMouseLeave={() => setShow(true)}
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          <Link
            href="/me"
            className="block bg-slate-500 px-4 py-2 text-sm font-bold hover:bg-slate-600"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-0"
          >
            {session?.user?.name}
          </Link>
          <Link
            href="/s"
            className="block px-4 py-2 text-sm hover:text-blue-500"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-1"
          >
            Account settings
          </Link>
          <button
            className="block w-full px-4 py-2 text-left text-sm hover:text-blue-500"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-3"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
