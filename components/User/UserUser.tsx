import Image from "next/image";
import Link from "next/link";
import React from "react";
import { trpc } from "../../src/utils/trpc";
import Loading from "../Loading";

const UserUserComp = () => {
  const { data: users, isLoading } = trpc.user.getAllPublic.useQuery();

  if (isLoading) return <Loading />;
  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <h1 className="text-5xl">Welcome to Tokofication</h1>
      <p className="mt-2 text-xl">List of all the users</p>
      <div className="flex h-auto flex-row flex-wrap ">
        {users?.map((user) => (
          <Item
            key={user.id}
            userId={user.id}
            name={String(user.name)}
            image={user.image}
          />
        ))}
      </div>
    </div>
  );
};

export default UserUserComp;

interface User {
  userId: string;
  name: string;
  image: string | null;
}
const Item = ({ userId, name, image }: User) => {
  let pic;

  if (image?.match(new RegExp("^[https]"))) {
    pic = () => String(image);
  } else {
    pic = () =>
      String(
        `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/user/${image}`
      );
  }

  return (
    <Link href={`/u/${userId}`}>
      <div className="m-2 flex h-40 w-40 flex-col rounded-lg hover:text-blue-500">
        <div className="flex h-full w-full items-center justify-center rounded-lg border p-2 text-3xl">
          <Image
            src={pic()}
            alt="profile pic"
            loader={pic}
            height={240}
            width={240}
            className="h-full w-full object-cover opacity-50"
            loading="lazy"
          ></Image>
          <p className="absolute bg-black/50">{name}</p>
        </div>
      </div>
    </Link>
  );
};
