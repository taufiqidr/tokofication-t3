import Image from "next/image";
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
            image={category?.image}
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
  image: string | null;
}
const Item = ({ categoryId, name, image }: Category) => {
  const img = () =>
    String(
      `https://ugulpstombooodglvogg.supabase.co/storage/v1/object/public/tokofication-image/category/${image}`
    );
  return (
    <Link href={`/c/${categoryId}`}>
      <div className="m-2 flex h-60 w-40 flex-col rounded-lg hover:text-blue-500">
        <div className="h-2/4 rounded-t-lg border">
          {image && (
            <Image
              src={img()}
              alt={categoryId}
              loader={img}
              width={240}
              height={240}
              className="h-full w-full rounded-t-lg object-cover object-top"
            ></Image>
          )}
        </div>
        <div className="h-2/4 rounded-b-lg border p-2">
          <div className="flex h-full w-full items-center justify-center rounded-lg border p-2 text-3xl">
            <p>{name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
