import Link from "next/link";
import React from "react";
import { trpc } from "../../src/utils/trpc";
import Loading from "../Loading";

const UserCategoryComp = () => {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();
  if (isLoading) return <Loading />;

  return (
    <div className="mx-3 flex h-full w-auto flex-col">
      <h1 className="text-5xl">Welcome to Tokofication</h1>
      <p className="mt-2 text-xl">List of all the categories</p>
      <div className="flex h-auto flex-row flex-wrap ">
        {categories?.map((category) => (
          <Item
            key={category.id}
            categoryId={category.id}
            name={category.name}
          />
        ))}
      </div>
    </div>
  );
};

export default UserCategoryComp;

interface Category {
  categoryId: string;
  name: string;
}
const Item = ({ categoryId, name }: Category) => {
  return (
    <Link href={`/c/${categoryId}`}>
      <div className="m-2 flex h-40 w-40 flex-col rounded-lg hover:text-blue-500">
        <div className="flex h-full w-full items-center justify-center rounded-lg border p-2 text-3xl">
          <p>{name}</p>
        </div>
      </div>
    </Link>
  );
};
