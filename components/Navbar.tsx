import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import { trpc } from "../src/utils/trpc";

const Navbar = () => {
  const { data: session, status } = useSession();

  let menu, user;

  if (status === "authenticated") {
    menu = (
      <>
        <li>
          <span className="cursor-pointer" onClick={() => signOut()}>
            Logout
          </span>
        </li>
      </>
    );
    user = <span className="">{session.user?.email}</span>;
  } else if (status === "unauthenticated") {
    menu = (
      <>
        <li>
          <div
            onClick={() => signIn("discord")}
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-3 py-1 hover:bg-blue-500"
          >
            Login with Discord
          </div>
        </li>
      </>
    );
  }

  return (
    <header className="sticky top-0  w-full flex-none  bg-gray-800 py-3">
      <div className="flex h-full flex-row justify-between">
        <div>
          <Link href={"/"}>
            <span className="mx-3 text-2xl italic">Tokofication</span>
          </Link>
        </div>
        <div>{user}</div>
        <nav className="h-full">
          <ul className="mx-3 flex flex-row items-center gap-x-3 text-xl">
            <li>
              <Link href={"/c"}>
                <span className="cursor-pointer">Category</span>
              </Link>
            </li>
            <li>
              <Link href={"/p"}>
                <span className="cursor-pointer">Product</span>
              </Link>
            </li>
            <li>
              <Link href={"/u"}>
                <span className="cursor-pointer">User</span>
              </Link>
            </li>
            {menu}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
