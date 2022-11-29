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
          <Item key={user.id} userId={user.id} name={String(user.name)} />
        ))}
      </div>
    </div>
  );
};

export default UserUserComp;

interface User {
  userId: string;
  name: string;
}
const Item = ({ userId, name }: User) => {
  return (
    <Link href={`/u/${userId}`}>
      <div className="m-2 flex h-40 w-40 flex-col rounded-lg hover:text-blue-500">
        <div className="flex h-full w-full items-center justify-center rounded-lg border p-2 text-3xl">
          <p>{name}</p>
        </div>
      </div>
    </Link>
  );
};
