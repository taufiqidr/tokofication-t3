import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Back from "../../components/Back";
import { money } from "../utils/money";
import React, { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import Loading from "../../components/Loading";
import ProductItem from "../../components/ProductItem";

const ProfilePage = () => {
  const { status } = useSession();
  let content;
  if (status === "authenticated") {
    content = <Profile />;
  } else if (status === "unauthenticated") {
    content = <Unauthenticated />;
  }

  return content;
};

export default ProfilePage;

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

const Profile = () => {
  const { data: session } = useSession();
  let pic;

  if (session?.user?.image?.match(new RegExp("^[https]"))) {
    pic = () => String(session.user?.image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${session?.user?.image}`
      );
  }

  return (
    <div className="mx-3 flex h-full w-auto flex-col ">
      <div className="m-3 flex justify-start">
        <div className=" h-[240px] w-[240px] rounded-full border">
          <Image
            src={pic()}
            alt="profile pic"
            loader={pic}
            height={240}
            width={240}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
          ></Image>
        </div>
        <div className="mx-3 flex flex-col justify-between">
          <div>
            <div className=" mb-3 text-5xl font-bold">
              {session?.user?.name}
            </div>
            <div className=" text-3xl ">
              {money.format(Number(session?.user?.balance))}
            </div>
            <div className=" text-3xl capitalize text-slate-500">
              {session?.user?.role.toLowerCase()}
            </div>
          </div>
          <div>
            <Link href={"/p/new"}>
              <button
                className={`w-full  rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white   
         hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto
        `}
              >
                Sell a Product
              </button>
            </Link>
            <Link href={"/s"}>
              <button
                className={`mx-3 w-full  rounded-lg bg-orange-700 px-5 py-2.5 text-center text-sm font-medium text-white   
         hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 sm:w-auto
        `}
              >
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
      <ProductList />
    </div>
  );
};

const ProductList = () => {
  const { data: session } = useSession();
  const id = session?.user?.id;
  const [userId, setUserId] = useState("");

  const { data: products, isLoading } = trpc.product.getByUser.useQuery({
    userId: userId as string,
  });

  useEffect(() => {
    if (id) setUserId(String(id));
  }, [id]);
  if (isLoading) return <Loading />;

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <div className="flex h-auto flex-row flex-wrap ">
        {products?.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            seller={String(product.user.name)}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
};
